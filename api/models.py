from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import datetime

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    university = models.CharField(max_length=255)
    date_of_birth = models.DateField(default=datetime.date.today)

class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)
    logo_url = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(null=True, blank=True)
    website = models.CharField(max_length=255, null=True, blank=True)
    headquarters = models.CharField(max_length=255, null=True, blank=True)
    industry = models.CharField(max_length=255, null=True, blank=True)
    founded_year = models.IntegerField(blank=True, null=True)

class Board(models.Model):
    title = models.CharField(max_length=255)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Stage(models.Model): #online assessment, phone interview, video interview, on-site interview, etc
    name = models.CharField(max_length=255)

class BoardList(models.Model): 
    title = models.CharField(max_length=255, unique=True) #applied, interview, offer, rejected, etc

class Application(models.Model):
    company_name = models.CharField(max_length=255)
    icon = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=255)
    link = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    date_applied = models.DateField(default=datetime.date.today, blank=True)
    order_index = models.IntegerField(blank=True, null=True)
    board_list = models.ForeignKey(BoardList, on_delete=models.PROTECT, related_name='applications')
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='applications')
    created_at = models.DateTimeField(auto_now_add=True)

class Interview(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    stage = models.ForeignKey(Stage, null=True, on_delete=models.SET_NULL, related_name='interviews')
    description = models.TextField(blank=True, null=True)
    date = models.DateField(default=datetime.date.today, blank=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    result = models.BooleanField(blank=True, null=True) #e.g. pass (true) / fail (false)
    duration = models.IntegerField(blank=True, null=True) #e.g. 40 (mins)
    experience = models.CharField(max_length=255, blank=True, null=True) #positive, neutral, negative
    difficulty = models.CharField(max_length=255, blank=True, null=True) #difficult, average, easy

class Question(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()

class Note(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='notes')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)