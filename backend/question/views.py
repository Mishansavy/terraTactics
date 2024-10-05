from rest_framework import viewsets
from rest_framework.response import Response
from .models import Quiz
from .serializers import QuizSerializer

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def retrieve(self, request, *args, **kwargs):
        # Retrieve the Quiz instance
        instance = self.get_object()
        
        # Extract the choices from the instance
        choices = instance.choices  # This is a list like ["10.5 billion years", "13.8 billion years", ...]

        # Example: Return the first choice, but you can customize this as needed
        first_choice = choices[0] if choices else None
        
        # You can also return all choices or filter them as needed
        all_choices = choices  # Return all choices

        # Customize your response
        return Response({
            'question': instance.question,
            'answer': instance.answer,
            'description': instance.description,
            'first_choice': first_choice,  # First choice from the choices list
            'all_choices': all_choices,      # All choices
        })
