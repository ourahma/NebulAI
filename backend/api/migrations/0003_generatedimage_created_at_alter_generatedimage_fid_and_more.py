# Generated by Django 5.2.1 on 2025-05-25 17:28

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_alter_generatedimage_image_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="generatedimage",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="generatedimage",
            name="fid",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="generatedimage",
            name="kid",
            field=models.FloatField(blank=True, null=True),
        ),
    ]
