# Generated by Django 5.2.1 on 2025-05-25 17:03

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="GeneratedImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("image_url", models.CharField(max_length=255)),
                ("fid", models.FloatField()),
                ("kid", models.FloatField()),
                ("likes", models.IntegerField(default=0)),
                ("dislikes", models.IntegerField(default=0)),
            ],
        ),
    ]
