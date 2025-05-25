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
from .apps import *
from PIL import Image
import numpy as np

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

    # Créer instance GeneratedImage avec image sauvegardée
    image_instance = GeneratedImage()
    image_instance.image_url.save(f'generated_{random.randint(1000,9999)}.png', img_content)
    image_instance.fid = round(random.uniform(1, 10), 2)
    image_instance.kid = round(random.uniform(1, 10), 2)
    image_instance.save()

    return Response(GeneratedImageSerializer(image_instance).data)

def generer_image_from_model(request):
    noise = tf.random.normal([1, latent_dim])
    epsilon = tf.random.normal([1, latent_dim])
    noise += epsilon

    label = 1 if random.random() >= 0.5 else 0
    labels = tf.constant([[label]], dtype=tf.int32)

    generator_fn = model.signatures["serving_default"]
    generated_image_tensor = generator_fn(inputs=noise, inputs_1=labels)["output_0"]

    
    img_array = generated_image_tensor[0].numpy()

    
    img_array = (img_array + 1) * 127.5
    img_array = np.clip(img_array, 0, 255).astype(np.uint8)

    # Convertir en image PIL (assumant 3 canaux RGB)
    pil_image = Image.fromarray(img_array)

    return pil_image
