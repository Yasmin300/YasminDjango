from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from blog.models import Post, Comment
from django.utils import timezone
User = get_user_model()


class Command(BaseCommand):
    help = "Seed the database with initial data"

    def handle(self, *args, **options):
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                username="admin1", email="admin1@example.com", password="admin123"
            )
            User.objects.create_superuser(
                username="admin2", email="admin2@example.com", password="admin123"
            )
            self.stdout.write(self.style.SUCCESS("✅ Created 2 admin users"))

        if User.objects.count() < 5:
            User.objects.create_user(
                username="user1", email="user1@example.com", password="user123")
            User.objects.create_user(
                username="user2", email="user2@example.com", password="user123")
            self.stdout.write(self.style.SUCCESS("✅ Created 2 regular users"))
        posts = []
        if Post.objects.count() < 2:
            u1 = User.objects.filter(is_superuser=True).first()
            posts.append(Post.objects.create(
                title="First Article",
                body="This is the body of the first article.",
                author=u1,
                created_at=timezone.now(),
            ))
            posts.append(Post.objects.create(
                title="Second Article",
                body="This is the body of the second article.",
                author=u1,
                created_at=timezone.now(),
            ))
            self.stdout.write(self.style.SUCCESS("✅ Created 2 articles"))
        if posts:
            u2 = User.objects.filter(is_superuser=False).last()
            for post in posts:
                if Comment.objects.filter(post=post).count() < 2:
                    Comment.objects.create(
                        post=post, user=u2, text="Nice article!")
                    Comment.objects.create(
                        post=post, user=u2, text="Thanks for sharing!")
                    self.stdout.write(self.style.SUCCESS(
                        f"✅ Added 2 comments for {post.title}"))
