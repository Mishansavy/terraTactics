# from rest_framework import viewsets
# from .models import User
# from .serializers import UserSerializer
# from rest_framework.response import Response

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

#     def answer_question(self, request, pk, is_correct):
#         user = self.get_object()  # Get the user by primary key (pk)
        
#         # Convert the `is_correct` integer to a boolean
#         is_correct_bool = bool(is_correct)

#         # Update the user's coins based on whether the answer is correct
#         if is_correct_bool:
#             user.coinCount += 5
#             user.CorrectAnswer += 1
#         else:
#             user.coinCount -= 5
#             user.wrongAnswer += 1

#         user.save()

#         return Response({"message": "Answer recorded successfully", "coinCount": user.coinCount})


from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def answer_question(self, request, pk):
        user = self.get_object()  # Get the user by primary key (pk)
        is_correct = request.data.get('is_correct')  # Get the is_correct from the request body

        # Convert the `is_correct` to a boolean
        is_correct_bool = str(is_correct).lower() == "true"

        # Update the user's coins based on whether the answer is correct
        if is_correct_bool:
            user.coinCount += 5  # Add 5 points for correct answer
            user.CorrectAnswer += 1
        else:
            user.wrongAnswer += 1  # Only increase wrong answer count, no deduction of coins

        user.save()

        return Response({"message": "Answer recorded successfully", "coinCount": user.coinCount})
