from django.contrib import admin
from django.urls import include, path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("api/generate-image/", view=views.generate_image, name="generate_image"),
    path("api/token/", views.CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    
    path("api/vote-image/<int:image_id>/",views.vote_image, name="vote-image"),
    path('api/dashboard-stats/', views.dashboard_stats, name='dashboard-stats'),
    
    path('api/metrics/<int:image_id>/', views.get_metrics, name='get_metrics'),
    
    ### permettre le telechargement des images générées
    path('api/download/<int:image_id>/', views.download_image),
]

