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
    def load_val_ds(self, image_dir, img_size=(256, 256), batch_size=2):
        def get_label(file_path):
            # Extraire le nom du dossier parent (0 ou 1) et le convertir en entier
            parts = tf.strings.split(file_path, os.sep)
            return tf.strings.to_number(parts[-2], out_type=tf.int32)

        def decode_img(img_path):
            img = tf.io.read_file(img_path)
            img = tf.image.decode_png(img, channels=3)
            img = tf.image.resize(img, img_size)
            img = (tf.cast(img, tf.float32) / 127.5) - 1.0  # Normalisation [-1, 1]
            return img

        def process_path(file_path):
            label = get_label(file_path)
            img = decode_img(file_path)
            return img, label

        image_paths = []
        for label in ["0", "1"]:
            folder = os.path.join(image_dir, label)
            if os.path.exists(folder):
                for fname in os.listdir(folder):
                    if fname.lower().endswith(".jpg"):
                        image_paths.append(os.path.join(folder, fname))

        dataset = tf.data.Dataset.from_tensor_slices(image_paths)
        dataset = dataset.map(process_path, num_parallel_calls=tf.data.AUTOTUNE)
        dataset = dataset.batch(batch_size)
        dataset = dataset.prefetch(tf.data.AUTOTUNE)

        return dataset

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
        print("validation set est chargé ")
        print(val_ds.element_spec)
        