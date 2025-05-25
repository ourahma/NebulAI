from django.apps import AppConfig
from django.apps import AppConfig
import tensorflow as tf

class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"
    name = 'api'
    latent_dim = 256        
    num_classes = 2 
    # Load the model once when the app starts
    def ready(self):
        global model
        model = tf.saved_model.load("E:/Documents/PE/Master/S2/Prjt1/projet_web/backend/api/generateur")        