from django.db import models

class Quiz(models.Model):
    question = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    description = models.TextField()
    choices = models.JSONField()

    def __str__(self):
        return self.question