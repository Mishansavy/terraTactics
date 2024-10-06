from django.db import models

class Quiz(models.Model):
    question = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    description = models.TextField()
    choices = models.JSONField()
    imageUpload = models.ImageField(upload_to='uploads/', null=True, blank=True)

    def __str__(self):
        return self.question