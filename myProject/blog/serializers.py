from rest_framework import serializers
from .models import Post, Tag, Comment
from django.conf import settings
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # keep it minimal to avoid exposing password
        fields = ["id", "username", "email", "first_name", "last_name"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "text", "created_at", "user", "post"]

    def get_user_id(self, obj):
        return obj.user.id


class ArticleSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    tags = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    tags_detail = TagSerializer(many=True, read_only=True, source="tags")

    class Meta:
        model = Post
        fields = ["id", "title", "body", "author",
                  "created_at", "tags", "tags_detail", "comments"]

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        post = Post.objects.create(**validated_data)
        for tag_name in tags:
            tag, _ = Tag.objects.get_or_create(name=tag_name.strip())
            post.tags.add(tag)
        return post

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        instance = super().update(instance, validated_data)
        if tags is not None:
            instance.tags.clear()
            for tag_name in tags:
                tag, _ = Tag.objects.get_or_create(name=tag_name.strip())
                instance.tags.add(tag)
        return instance
