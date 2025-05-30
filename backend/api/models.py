from django.db import models
from django.core.exceptions import *
from django.contrib.auth.models import User
from django.db.models.functions import TruncDate
from django.db.models import Count

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
   
    
    #  Méthode pour le total des images générées
    @staticmethod
    def total_generated_images():
        return GeneratedImage.objects.count()

    #  Méthode pour le total des likes
    @staticmethod
    def total_likes():
        return ImageVote.objects.filter(vote_type='like').count()

    # Méthode pour le total des dislikes
    @staticmethod
    def total_dislikes():
        return ImageVote.objects.filter(vote_type='dislike').count()



    @staticmethod
    def generation_history_chart():
        data = (
            GeneratedImage.objects
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        labels = [str(entry['date']) for entry in data]
        counts = [entry['count'] for entry in data]

        return {
            "labels": labels,
            "datasets": [
                {
                    "label": "Nombre d'images générées",
                    "data": counts,
                    "backgroundColor": "rgba(75, 192, 192, 0.6)"
                }
            ]
        }
        
    @staticmethod
    def like_dislike_pie_chart():
        likes = GeneratedImage.total_likes()
        dislikes = GeneratedImage.total_dislikes()

        return {
            "labels": ["Likées", "Dislikées"],
            "datasets": [
                {
                    "data": [likes, dislikes],
                    "backgroundColor": ["#36A2EB", "#FF6384"]
                }
            ]
        }





class ImageVote(models.Model):
    LIKE = 'like'
    DISLIKE = 'dislike'
    VOTE_CHOICES = [(LIKE, 'Like'), (DISLIKE, 'Dislike')]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ForeignKey(GeneratedImage, on_delete=models.CASCADE)
    vote_type = models.CharField(max_length=7, choices=VOTE_CHOICES)
    def __str__(self):
        return f"ImageVote {self.user} - {self.vote_type}"
    class Meta:
        unique_together = ('user', 'image')  # Un seul vote par image par utilisateur