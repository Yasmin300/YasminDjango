from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import CommentSerializer, UserSerializer, TagSerializer, ArticleSerializer
from users.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.decorators import action
from .models import Post, Tag, Comment
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsOwnerOrAdmin
from rest_framework import generics, permissions, filters  # filters is SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
import django_filters


class addviewComment(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        article_id = self.kwargs["pk"]  # <id> from URL
        return Comment.objects.filter(post_id=article_id).select_related("user")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        article_id = self.kwargs["pk"]
        article = Post.objects.get(pk=article_id)
        comment = serializer.save(post=article, user=self.request.user)
        return Response({
            "id": comment.id,
            "message": "comment created successfully"
        }, status=201)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrAdmin]


class PostFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(
        field_name="title", lookup_expr="icontains")
    body = django_filters.CharFilter(
        field_name="body", lookup_expr="icontains")
    author__username = django_filters.CharFilter(
        field_name="author__username", lookup_expr="icontains")
    tags__name = django_filters.CharFilter(
        field_name="tags__name", lookup_expr="icontains")

    class Meta:
        model = Post
        fields = ["title", "body", "author__username", "tags__name"]


class GetPostSearchArticles(generics.ListCreateAPIView):
    queryset = Post.objects.order_by("-created_at")
    serializer_class = ArticleSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ["title", "body", "author__username", "tags__name"]
    filterset_class = PostFilter

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class GetEditDeleteArticle(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = ArticleSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class MyArticlesView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # request.user comes from the token
        return Post.objects.filter(author=self.request.user)
