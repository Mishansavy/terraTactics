# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from .models import User
# from .serializers import UserSerializer

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

#     def create(self, request, *args, **kwargs):
#         #new user creation
#         serializer = self.get_serializer(data= request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def answer_question(self, request, pk, is_correct):
#         user = self.get_object()
#         if is_correct:
#             user.coinCount += 5
#             user.correctAnswers += 1
#         else:
#             user.coinCount -= 5
#             user.wrongAnswers += 1
#         user.save()
#         return Response(UserSerializer(user).data)

# user/views.py
from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def answer_question(self, request, pk, is_correct):
        user = self.get_object()  # Get the user by primary key (pk)
        
        # Convert the `is_correct` integer to a boolean
        is_correct_bool = bool(is_correct)

        # Update the user's coins based on whether the answer is correct
        if is_correct_bool:
            user.coinCount += 5
            user.CorrectAnswer += 1
        else:
            user.coinCount -= 5
            user.wrongAnswer += 1

        user.save()

        return Response({"message": "Answer recorded successfully", "coinCount": user.coinCount})
