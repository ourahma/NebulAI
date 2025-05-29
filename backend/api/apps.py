from django.apps import AppConfig
from django.apps import AppConfig
import tensorflow as tf
from django.conf import settings
import os
from tensorflow.keras.applications.inception_v3 import InceptionV3, preprocess_input

class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"
    name = 'api'
    latent_dim = 256        
    num_classes = 2 
    ## charger validation 
    def load_val_ds(self,image_dir, img_size=(128, 128), batch_size=32):
        def preprocess(img_path):
            img = tf.io.read_file(img_path)
            img = tf.image.decode_png(img, channels=3)
            img = tf.image.resize(img, img_size)
            img = (tf.cast(img, tf.float32) / 127.5) - 1.0  # Normalisation [-1, 1]
            return img
        
        image_paths = [os.path.join(image_dir, fname) for fname in os.listdir(image_dir)]
        dataset = tf.data.Dataset.from_tensor_slices(image_paths)
        dataset = dataset.map(lambda x: (preprocess(x), tf.constant([0], dtype=tf.int32)))  # dummy label
        return dataset.batch(batch_size)
    # Load the model once when the app starts
    def ready(self):
        global model
        global inference_fn
        global feature_extractor 
        global val_ds 
        global preprocess_input
        
        print("BASE_DIR :",settings.BASE_DIR)
        model = tf.saved_model.load(os.path.join(settings.BASE_DIR,"api","generateur"))  
        inference_fn = model.signatures["serving_default"]    
        feature_extractor = InceptionV3(weights='imagenet', include_top=False, pooling='avg')
        # Charger au lancement de Django
        val_ds = self.load_val_ds(os.path.join(settings.BASE_DIR,"media","validation_ds"))
        