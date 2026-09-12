from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email    = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'username': 'Username sudah digunakan.'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'email': 'Email sudah terdaftar.'}, status=400)

    user  = User.objects.create_user(username=username, email=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': { 'id': user.id, 'username': user.username, 'email': user.email }
    }, status=201)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user     = authenticate(username=username, password=password)

    if not user:
        return Response({'error': 'Username atau password salah.'}, status=400)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': { 'id': user.id, 'username': user.username, 'email': user.email }
    })