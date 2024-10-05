from django.db import models

class User(models.Model):
    username = models.CharField(max_length=255)
    coinCount = models.IntegerField(default=10)
    CorrectAnswer = models.IntegerField(default=0)
    wrongAnswer = models.IntegerField(default=0)

    def __str__(self):
        return self.username