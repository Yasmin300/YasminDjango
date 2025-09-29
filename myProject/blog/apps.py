from django.apps import AppConfig
from django.core.management import call_command


class BlogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blog'

    def ready(self):
        try:
            call_command("seed")
        except Exception as e:
            print(f"⚠️ Seeding failed: {e}")
