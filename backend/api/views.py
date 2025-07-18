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
from .serializers import *
import tensorflow as tf
from .apps import model , feature_extractor, val_ds, inference_fn
from PIL import Image
import numpy as np
## calculer et retourner les métriques FID et KID
from scipy.linalg import sqrtm
from tensorflow.keras.applications.inception_v3 import InceptionV3, preprocess_input
from sklearn.metrics.pairwise import polynomial_kernel
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.http import FileResponse, Http404
## login
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework import status
import threading
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import threading
import time
latent_dim = 256        
num_images = 5      
num_classes = 2 

### gérer les token 



User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Email ou mot de passe invalide")

        if not user.check_password(password):
            raise serializers.ValidationError("Email ou mot de passe invalide")

        # Injecter le username dans les credentials pour que JWT fonctionne
        attrs["username"] = user.username
        data = super().validate(attrs)
        data.update({
            "user_id":user.id,
            "email":user.email,
            "first_name":user.first_name,
            "last_name": user.last_name,
            "admin" :user.is_superuser
        })
        return data
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"]=user.username
        token["email"] = user.email
        token["first_name"] = user.first_name
        token["last_name"] = user.first_name
        token["admin"] = user.is_superuser
        return token

    def to_internal_value(self, data):
        
        return {
            "email": data.get("email"),
            "password": data.get("password"),
        }

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


#### register 
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            ## generer un token au utilisateur
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Compte créé avec succès",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username":user.username,
                "email": user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#### traiter les images par batch
def extract_features_in_batches(images, batch_size=4):
    features = []
    for i in range(0, len(images), batch_size):
        batch = images[i:i+batch_size]
        batch = preprocess_input(batch * 127.5 + 127.5)
        batch_features = feature_extractor(batch)
        features.append(batch_features)
    return tf.concat(features, axis=0)



def async_metric_task(image_id, label):
    from .models import GeneratedImage
    instance = GeneratedImage.objects.get(id=image_id)
    fid = compute_fid(inference_fn, val_ds, noise_dim=latent_dim, label_target = label,num_images=num_images)
    kid_mean, _ = compute_kid(inference_fn, val_ds, noise_dim=latent_dim, label_target = label,num_images=num_images)
    
    print("======================================================================")
    print("FID",fid)
    print("KID",kid_mean)
    
    instance.fid = fid
    instance.kid = kid_mean
    instance.save()
    
## retiurner les métrique après calcul :
@api_view(['GET'])
@permission_classes([AllowAny])
def get_metrics(request, image_id):
    """
    Attend que FID et KID soient calculés, puis les renvoie.
    """
    timeout = 15  # secondes max d'attente
    waited = 0
    interval = 1  # fréquence de vérification

    while waited < timeout:
        try:
            image = GeneratedImage.objects.get(id=image_id)
        except GeneratedImage.DoesNotExist:
            return Response({"error": "Image non trouvée"}, status=404)

        if image.fid is not None and image.kid is not None:
            return Response({
                "fid": image.fid,
                "kid": image.kid
            })

        time.sleep(interval)
        waited += interval

    # Si le timeout est atteint
    return Response({
        "fid": None,
        "kid": None,
        "message": "Les métriques ne sont pas encore prêtes"
    }, status=202)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def generate_image(request):
   
    # Génère l'image via la fonction dédiée
    pil_image,label = generer_image_from_model(request)

    print("Image est généré, calcul de metriques....")
    # Convertir PIL Image en bytes pour sauvegarde Django
    img_io = io.BytesIO()
    pil_image.save(img_io, format='PNG')
    img_content = ContentFile(img_io.getvalue(), 'generated.png')

    # calculer le fid et le kid 
    #fid = compute_fid(inference_fn, val_ds, noise_dim=latent_dim, label_target = label,num_images=num_images)
    #kid_mean, _ = compute_kid(inference_fn, val_ds, noise_dim=latent_dim, label_target = label,num_images=num_images)
    
    # Créer instance GeneratedImage avec image sauvegardée
    image_instance = GeneratedImage()
    image_instance.image_url.save(f'generated_{random.randint(1000,9999)}.png', img_content)
    image_instance.save()
    ## lancer le calcul de fid et kid dans un thread
    thread = threading.Thread(target=async_metric_task, args=(image_instance.id, label))
    thread.start()

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

    return pil_image, label


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

def compute_fid(generator_fn,val_ds, noise_dim, label_target,num_images=num_images):
    real_images = []
    generated_images = []
    for images, labels in val_ds:
        for img, label in zip(images, labels):
            label_int = int(label.numpy()) 

            if label_int != label_target:
                continue
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


    
def compute_kid(generator_fn, val_ds, noise_dim, label_target,num_images=num_images):
    real_images = []
    generated_images = []
    
    for images, labels in val_ds:
        for img, label in zip(images, labels):
            label_int = int(label.numpy())
            
            if label_int != label_target:
                continue
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
    user = request.user
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
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    images = GeneratedImage.objects.all()
    #for i in images:
        #print("Id", i.id, "Fid",i.fid,"Kid",i.kid)
    data = {
        "total_generated": GeneratedImage.objects.count(),
        "total_likes": GeneratedImage.total_likes(),
        "total_dislikes": GeneratedImage.total_dislikes(),
        "generation_history": GeneratedImage.generation_history_chart(),
        "like_dislike_pie": GeneratedImage.like_dislike_pie_chart(),
        "fid_history": GeneratedImage.get_fids(),
        "kid_history": GeneratedImage.get_kids(),
    }
    return JsonResponse(data)

def download_image(request, image_id):
    
    try:
        image = GeneratedImage.objects.get(id=image_id)
    except GeneratedImage.DoesNotExist:
        raise Http404("Image non trouvée")

    image_path = os.path.join(settings.MEDIA_ROOT, image.image_url.name)
    if not os.path.exists(image_path):
        raise Http404("Image non trouvée")

    # Nom du fichier pour le téléchargement, récupéré depuis le nom du fichier stocké
    image_name = os.path.basename(image.image_url.name)

    response = FileResponse(open(image_path, 'rb'), content_type='application/octet-stream')
    response['Content-Disposition'] = f'attachment; filename="{image_name}"'
    return response