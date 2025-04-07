from django.db import models
from django.contrib.auth.models import User

class Wishlist(models.Model):
    WISHLIST_TYPES = (
        ('gift_card', 'Gift Card'),
        ('text', 'Text'),
    )
    type = models.CharField(max_length=20, choices=WISHLIST_TYPES, default='gift_card')
    text = models.TextField()
    image = models.ImageField(upload_to='wishlists/', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlists')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} by {self.author.username}"

class Comment(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.wishlist}"