from django.urls import path
from .views import UserViewSet

urlpatterns = [
    path('users/', UserViewSet.as_view({'post': 'create'}), name='user-create'),
    path('users/<int:pk>/answer/<int:is_correct>/', UserViewSet.as_view({'post': 'answer_question'}), name='user-answer'),
]
