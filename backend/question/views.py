from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Quiz
from .serializers import QuizSerializer
import requests

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def retrieve(self, request, *args, **kwargs):
        # Retrieve the Quiz instance
        instance = self.get_object()
        
        # Extract the choices from the instance
        choices = instance.choices  #  a JSON array or list
        first_choice = choices[0] if choices else None
        
        # Customize your response
        return Response({
            'question': instance.question,
            'answer': instance.answer,
            'description': instance.description,
            'first_choice': first_choice,  # First choice from the choices list
            'all_choices': choices,        # All choices returned as list
        })

    def get_nasa_image(self, query):
        url = f"https://images-api.nasa.gov/search?q={query}"
        response = requests.get(url)
        data = response.json()

        # Extract the first image and description
        if data['collection']['items']:
            return data['collection']['items'][0]['links'][0]['href'], data['collection']['items'][0]['data'][0]['description']
        return None, None

    @action(detail=True, methods=['post'], url_path='answer', url_name='answer-question')
    def answer_question(self, request, pk=None):
        # Logic to check if the answer is correct
        quiz = self.get_object()
        user_answer = request.data.get('answer')  # Answer sent in the request payload

        if user_answer == quiz.answer:
            # If the answer is correct, fetch the NASA image and description
            image_url, description = self.get_nasa_image(quiz.question)
            response_data = {
                'correct': True,
                'image_url': image_url,
                'description': description
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'correct': False}, status=status.HTTP_200_OK)
