import os
import io
import base64
import random
from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import GeneratedImage
from .serializers import GeneratedImageSerializer
import tensorflow as tf
from .apps import model , feature_extractor, val_ds, inference_fn
from PIL import Image
import numpy as np
## calculer et retourner les métriques FID et KID
from scipy.linalg import sqrtm
from tensorflow.keras.applications.inception_v3 import InceptionV3, preprocess_input
from sklearn.metrics.pairwise import polynomial_kernel

latent_dim = 256        
num_images = 5      
num_classes = 2 

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
    fid = compute_fid(inference_fn, val_ds, noise_dim=latent_dim, num_images=20)
    kid_mean, _ = compute_kid(inference_fn, val_ds, noise_dim=latent_dim, num_images=20)

    # Créer instance GeneratedImage avec image sauvegardée
    image_instance = GeneratedImage()
    image_instance.image_url.save(f'generated_{random.randint(1000,9999)}.png', img_content)
    image_instance.fid = round(fid, 2)
    image_instance.kid = round(kid_mean , 2)
    image_instance.save()

    return Response(GeneratedImageSerializer(image_instance).data)

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

def compute_fid(generateur, val_ds, noise_dim, num_images=10):
    real_images = []
    generated_images = []
    for images, labels in val_ds:
        for img, label in zip(images, labels):
            label_int = int(label.numpy()[0]) # [[0]] vers 0
            real_images.append(img)
            # Génère une image conditionnée
            noise = tf.random.normal([1, noise_dim])
            label_input = tf.convert_to_tensor([[label_int]])
            generated_img = generateur([noise, label_input], training=False)[0]
            generated_images.append(generated_img)
            # Stop si on a assez d’images
            if len(real_images) >= num_images:
                break
        if len(real_images) >= num_images:
            break
    # Empilement et resize
    real_imgs = tf.image.resize(tf.stack(real_images[:num_images]), (299, 299))
    fake_imgs = tf.image.resize(tf.stack(generated_images[:num_images]), (299, 299))
    act1 = feature_extractor(preprocess_input(real_imgs * 127.5 + 127.5))
    act2 = feature_extractor(preprocess_input(fake_imgs * 127.5 + 127.5))
    fid = calculate_fid(act1.numpy(), act2.numpy())
    
    return fid

def calculate_kid(features1, features2, subset_size=20, num_subsets=50):
    n1, n2 = len(features1), len(features2)
    assert n1 >= subset_size and n2 >= subset_size

    kid_scores = []

    for _ in range(num_subsets):
        i = np.random.choice(n1, subset_size, replace=False)
        j = np.random.choice(n2, subset_size, replace=False)
        X, Y = features1[i], features2[j]

        k_xx = polynomial_kernel(X, X, degree=3, gamma=None, coef0=1)
        k_yy = polynomial_kernel(Y, Y, degree=3, gamma=None, coef0=1)
        k_xy = polynomial_kernel(X, Y, degree=3, gamma=None, coef0=1)

        kid = np.mean(k_xx) + np.mean(k_yy) - 2 * np.mean(k_xy)
        kid_scores.append(kid)

    return np.mean(kid_scores), np.std(kid_scores)
    
def compute_kid(generateur, val_ds, noise_dim, num_images=20):
    real_images = []
    generated_images = []
    
    for images, labels in val_ds:
        for img, label in zip(images, labels):
            label_int = int(label.numpy()[0])
            real_images.append(img)
            noise = tf.random.normal([1, noise_dim])
            label_input = tf.convert_to_tensor([[label_int]])
            generated_img = generateur([noise, label_input], training=False)[0]
            generated_images.append(generated_img)
            if len(real_images) >= num_images:
                break
        if len(real_images) >= num_images:
            break

    real_imgs = tf.image.resize(tf.stack(real_images[:num_images]), (299, 299))
    fake_imgs = tf.image.resize(tf.stack(generated_images[:num_images]), (299, 299))

    real_imgs = preprocess_input(real_imgs * 127.5 + 127.5)
    fake_imgs = preprocess_input(fake_imgs * 127.5 + 127.5)

    real_features = feature_extractor.predict(real_imgs, verbose=0)
    fake_features = feature_extractor.predict(fake_imgs, verbose=0)

    mean_kid, std_kid = calculate_kid(real_features, fake_features)
    return mean_kid, std_kid

## liker une images
def like_image(request, id):
    image