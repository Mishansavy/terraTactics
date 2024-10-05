# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from .models import Quiz
# from .serializers import QuizSerializer
# import requests

# class QuizViewSet(viewsets.ModelViewSet):
#     queryset = Quiz.objects.all()
#     serializer_class = QuizSerializer

#     def list(self, request, *args, **kwargs):
#         """
#         Overriding the list method to return quiz questions and answers.
#         """
#         queryset = self.get_queryset()
#         serializer = self.get_serializer(queryset, many=True)

#         # Customize the list response to include the necessary fields
#         return Response(serializer.data)

#     def retrieve(self, request, *args, **kwargs):
#         # Retrieve the Quiz instance
#         instance = self.get_object()
        
#         # Extract the choices from the instance
#         choices = instance.choices  # Assuming it's a JSON array or list
#         first_choice = choices[0] if choices else None
        
#         # Customize your response
#         return Response({
#             'question': instance.question,
#             'answer': instance.answer,
#             'description': instance.description,
#             'first_choice': first_choice,  # First choice from the choices list
#             'all_choices': choices,        # All choices returned as list
#         })

#     def get_nasa_image(self, query):
#         url = f"https://images-api.nasa.gov/search?q={query}"
#         response = requests.get(url)
#         data = response.json()

#         # Extract the first image and description
#         if data['collection']['items']:
#             return data['collection']['items'][0]['links'][0]['href'], data['collection']['items'][0]['data'][0]['description']
#         return None, None

#     @action(detail=True, methods=['post'], url_path='answer', url_name='answer-question')
#     def answer_question(self, request, pk=None):
#         # Logic to check if the answer is correct
#         quiz = self.get_object()
#         user_answer = request.data.get('answer')  # Answer sent in the request payload

#         if user_answer == quiz.answer:
#             # If the answer is correct, fetch the NASA image and description
#             image_url, description = self.get_nasa_image(quiz.question)
#             response_data = {
#                 'correct': True,
#                 'image_url': image_url,
#                 'description': description
#             }
#             return Response(response_data, status=status.HTTP_200_OK)
#         else:
#             return Response({'correct': False}, status=status.HTTP_200_OK)


# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Quiz
from .serializers import QuizSerializer
import requests
import os

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def list(self, request, *args, **kwargs):
        """
        Overriding the list method to return quiz questions and answers.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        choices = instance.choices
        first_choice = choices[0] if choices else None
        return Response({
            'question': instance.question,
            'answer': instance.answer,
            'description': instance.description,
            'first_choice': first_choice,
            'all_choices': choices,
        })

    def get_apod_image(self):
        api_key = 'oieouBpKog1WD4etk9GYmyeZVHnLEdOYOB6WU0AY'

        url = f"https://api.nasa.gov/planetary/apod?api_key={api_key}"

        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            if data['media_type'] == 'image':
                return data['url'], data['explanation']
            else:
                return None, None 

        except requests.exceptions.RequestException as e:
            print(f"Error fetching APOD image: {e}")
            return None, None

    @action(detail=True, methods=['post'], url_path='answer', url_name='answer-question')
    def answer_question(self, request, pk=None):
        quiz = self.get_object()
        user_answer = request.data.get('answer')

        if user_answer == quiz.answer:
            image_url, description = self.get_apod_image()
            response_data = {
                'correct': True,
                'image_url': image_url,
                'description': description
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'correct': False}, status=status.HTTP_200_OK)