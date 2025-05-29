from django.db import models
from django.core.exceptions import *

class GeneratedImage(models.Model):
    image_url = models.ImageField(upload_to='generated_images/')
    fid = models.FloatField(null=True, blank=True)
    kid = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Image {self.id}"
    
    def like(self):
        self.likes += 1
        self.save()

    def dislike(self):
        self.dislikes += 1
        self.save()
        
    @staticmethod
    def get_image_by_id(image_id):
        try:
            return GeneratedImage.objects.get(id=image_id)
        except ObjectDoesNotExist:
            return None
    @property
    def total_likes(self):
        return self.like_set.filter(is_like=True).count()

    @property
    def total_dislikes(self):
        return self.like_set.filter(is_like=False).count()
