# Generated by Django 5.1.1 on 2024-10-05 08:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=255)),
                ('coinCount', models.IntegerField(default=10)),
                ('CorrectAnswer', models.IntegerField(default=0)),
                ('wrongAnswer', models.IntegerField(default=0)),
            ],
        ),
    ]
