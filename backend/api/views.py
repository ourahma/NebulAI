import os
import io
import base64
import random
from django.conf import settings
from django.core.files.base import ContentFile
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view , permission_classes
from .models import *
from .serializers import GeneratedImageSerializer
import tensorflow as tf
from .apps import model , feature_extractor, val_ds, inference_fn
from PIL import Image
import numpy as np
## calculer et retourner les métriques FID et KID
from scipy.linalg import sqrtm
from tensorflow.keras.applications.inception_v3 import InceptionV3, preprocess_input
from sklearn.metrics.pairwise import polynomial_kernel
from rest_framework.permissions import IsAuthenticated


latent_dim = 256        
num_images = 5      
num_classes = 2 


#### traiter les images par batch
def extract_features_in_batches(images, batch_size=4):
    features = []
    for i in range(0, len(images), batch_size):
        batch = images[i:i+batch_size]
        batch = preprocess_input(batch * 127.5 + 127.5)
        batch_features = feature_extractor(batch)
        features.append(batch_features)
    return tf.concat(features, axis=0)


@api_view(['POST'])
def generate_image(request):
    print("Received request to generate image")
    # Génère l'image via la fonction dédiée
    pil_image = generer_image_from_model(request)

    # Convertir PIL Image en bytes pour sauvegarde Django
    img_io = io.BytesIO()
    pil_image.save(img_io, format='PNG')
    img_content = ContentFile(img_io.getvalue(), 'generated.png')

    # calculer le fid et le kid 
    fid = compute_fid(inference_fn, val_ds, noise_dim=latent_dim, num_images=10)
    kid_mean, _ = compute_kid(inference_fn, val_ds, noise_dim=latent_dim, num_images=10)
    print("======================================================================")
    print("FID",fid)
    print("KID",kid_mean)
    # Créer instance GeneratedImage avec image sauvegardée
    image_instance = GeneratedImage()
    image_instance.image_url.save(f'generated_{random.randint(1000,9999)}.png', img_content)
    image_instance.fid = fid
    image_instance.kid = kid_mean
    image_instance.save()
    serializer = GeneratedImageSerializer(image_instance)
    return Response(serializer.data)

def generer_image_from_model(request):
    noise = tf.random.normal([1, latent_dim])
    epsilon = tf.random.normal([1, latent_dim])
    noise += epsilon

    label = 1 if random.random() >= 0.5 else 0
    labels = tf.constant([[label]], dtype=tf.int32)

    generator_fn = model.signatures["serving_default"]
    generated_image_tensor = generator_fn(**{"inputs": noise, "inputs_1": labels})["output_0"]
    img_array = generated_image_tensor[0].numpy()
    img_array = (img_array + 1) * 127.5
    img_array = np.clip(img_array, 0, 255).astype(np.uint8)
    # Convertir en image PIL (assumant 3 canaux RGB)
    pil_image = Image.fromarray(img_array)

    return pil_image


#### evaluer et retourner les métriques FID et KID
def calculate_fid(act1, act2):
    # Calcul des statistiques des activations
    mu1, sigma1 = act1.mean(axis=0), np.cov(act1, rowvar=False)
    mu2, sigma2 = act2.mean(axis=0), np.cov(act2, rowvar=False)
    
    # Calcul de la distance Fréchet
    ssdiff = np.sum((mu1 - mu2)**2)  # Distance entre les moyennes
    covmean = sqrtm(sigma1 @ sigma2)  # Racine carrée du produit des covariances
    
    if np.iscomplexobj(covmean):
        covmean = covmean.real  # Éviter les valeurs complexes
    
    fid = ssdiff + np.trace(sigma1 + sigma2 - 2 * covmean)  # Formule FID
    return fid

def compute_fid(generator_fn,val_ds, noise_dim, num_images=10):
    real_images = []
    generated_images = []
    for images, labels in val_ds:
        for img, label in zip(images, labels):
            label_int = int(label.numpy()[0]) # [[0]] vers 0
            real_images.append(img)
            # Génère une image conditionnée
            noise = tf.random.normal([1, noise_dim])
            label_input = tf.convert_to_tensor([[label_int]])
            generated_img = generator_fn(**{"inputs": noise, "inputs_1": label_input})["output_0"]
         
            generated_images.append(generated_img)
            # Stop si on a assez d’images
            if len(real_images) >= num_images:
                break
        if len(real_images) >= num_images:
            break
    
    ## enlever le 1 dans generated images pour avor 4D
    generated_images = [tf.squeeze(img, axis=0) for img in generated_images[:num_images]]

    real_imgs = tf.image.resize(tf.stack(real_images[:num_images]), (299, 299))
    fake_imgs = tf.image.resize(tf.stack(generated_images[:num_images]), (299, 299))
    act1 = extract_features_in_batches(real_imgs)
    act2 = extract_features_in_batches(fake_imgs)
    fid = calculate_fid(act1.numpy(), act2.numpy())
    
    return fid

def polynomial_mmd(x, y, degree=3, gamma=None, coef0=1):
    k_xx = polynomial_kernel(x, x, degree=degree, gamma=gamma, coef0=coef0)
    k_yy = polynomial_kernel(y, y, degree=degree, gamma=gamma, coef0=coef0)
    k_xy = polynomial_kernel(x, y, degree=degree, gamma=gamma, coef0=coef0)

    m = x.shape[0]
    n = y.shape[0]

    # Retirer la diagonale
    mmd = (np.sum(k_xx) - np.trace(k_xx)) / (m * (m - 1)) \
        + (np.sum(k_yy) - np.trace(k_yy)) / (n * (n - 1)) \
        - 2 * np.sum(k_xy) / (m * n)

    return mmd

def calculate_kid(real_features, fake_features, subset_size=50, num_subsets=100):
    n1 = real_features.shape[0]
    n2 = fake_features.shape[0]

    min_n = min(n1, n2)
    if subset_size > min_n:
        print(f"[AVERTISSEMENT] subset_size réduit de {subset_size} à {min_n} car pas assez de données.")
        subset_size = min_n

    mmds = []

    for _ in range(num_subsets):
        x = real_features[np.random.choice(n1, subset_size, replace=False)]
        y = fake_features[np.random.choice(n2, subset_size, replace=False)]
        mmd = polynomial_mmd(x, y)
        mmds.append(mmd)

    return float(np.mean(mmds)), float(np.std(mmds))


    
def compute_kid(generator_fn, val_ds, noise_dim, num_images=20):
    real_images = []
    generated_images = []
    
    for images, labels in val_ds:
        for img, label in zip(images, labels):
            label_int = int(label.numpy()[0])
            real_images.append(img)
            noise = tf.random.normal([1, noise_dim])
            label_input = tf.convert_to_tensor([[label_int]])
            generated_img = generator_fn(**{"inputs": noise, "inputs_1": label_input})["output_0"]
            generated_images.append(generated_img)
            if len(real_images) >= num_images:
                break
        if len(real_images) >= num_images:
            break
    generated_images = [tf.squeeze(img, axis=0) for img in generated_images[:num_images]]
    real_imgs = tf.image.resize(tf.stack(real_images[:num_images]), (299, 299))
    fake_imgs = tf.image.resize(tf.stack(generated_images[:num_images]), (299, 299))

    real_features = extract_features_in_batches(real_imgs).numpy()
    fake_features = extract_features_in_batches(fake_imgs).numpy()
    mean_kid, std_kid = calculate_kid(real_features, fake_features)
    return mean_kid, std_kid

## liker ou disliker les images
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote_image(request, image_id):
    print("vote image is triggered ")
    user = request.user
    print(f"User =========== {user}")
    vote_type = request.data.get('vote_type') 
    user = request.user

    if vote_type not in ['like', 'dislike']:
        return Response({'error': 'Invalid vote_type'}, status=400)

    try:
        image = GeneratedImage.objects.get(pk=image_id)
    except GeneratedImage.DoesNotExist:
        return Response({'error': 'Image not found'}, status=404)

    vote, created = ImageVote.objects.get_or_create(user=user, image=image)
    vote.vote_type = vote_type
    vote.save()

    
    likes = ImageVote.objects.filter(image=image, vote_type='like').count()
    dislikes = ImageVote.objects.filter(image=image, vote_type='dislike').count()

    return Response({'likes': likes, 'dislikes': dislikes})

### retourner les statistiques de dashboard 
def dashboard_stats(request):
    data = {
        "total_generated": GeneratedImage.objects.count(),
        "total_likes": GeneratedImage.total_likes(),
        "total_dislikes": GeneratedImage.total_dislikes(),
        "generation_history": GeneratedImage.generation_history_chart(),
        "like_dislike_pie": GeneratedImage.like_dislike_pie_chart(),
    }
    return JsonResponse(data)