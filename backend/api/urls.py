from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path("generate-image/", view=views.generate_image, name="generate_image"),
    
]

