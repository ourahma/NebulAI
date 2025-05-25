from django.db import models

class GeneratedImage(models.Model):
    image_url = models.ImageField(upload_to='generated_images/')
    fid = models.FloatField(null=True, blank=True)
    kid = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Image {self.id}"