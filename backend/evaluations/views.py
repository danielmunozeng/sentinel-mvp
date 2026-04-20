#from django.shortcuts import render

from rest_framework import viewsets
from .models import Evaluation
from .serializers import EvaluationSerializer


class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all().order_by('-created_at')
    serializer_class = EvaluationSerializer
