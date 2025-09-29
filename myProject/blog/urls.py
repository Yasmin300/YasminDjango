from django.urls import path
from .views import GetPostSearchArticles, GetEditDeleteArticle, addviewComment, CommentDetail, MyArticlesView


urlpatterns = [
    path("comments/<int:pk>/", CommentDetail.as_view(), name="comment-detail"),
    path('articles/<int:pk>/comments/',
         addviewComment.as_view(), name='add-View-comments'),
    path('articles/', GetPostSearchArticles.as_view(),
         name='article-list-search-post'),
    path('articles/<int:pk>/', GetEditDeleteArticle.as_view(),
         name='one-article-get-delete-edit'),
    path('articles/my-articles/', MyArticlesView.as_view(), name='my-articles'),
]
