from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "phone",
            "first_name",
            "middle_name",
            "last_name",
            "country",
            "city",
            "street",
            "house_number",
            "is_admin",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)   # hash password
        user.save()
        return user


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "middle_name",
            "last_name",
            "phone",
            "country",
            "city",
            "street",
            "house_number",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
