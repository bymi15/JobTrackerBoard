from rest_framework import serializers
from rest_framework.fields import empty
from rest_framework.validators import UniqueForDateValidator
from .models import UserProfile, Stage, Company, Board, Application, Interview, BoardList, Note, Question
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
from django.utils import timezone

#README: https://www.erol.si/2015/09/django-rest-framework-nestedserializer-with-relation-and-crud/
class RelationModelSerializer(serializers.ModelSerializer):
    def __init__(self, instance=None, data=empty, **kwargs):
        self.is_relation = kwargs.pop('is_relation', False)
        super(RelationModelSerializer, self).__init__(instance, data, **kwargs)
 
    def validate_empty_values(self, data):
        if self.is_relation:
            model = getattr(self.Meta, 'model')
            model_pk = model._meta.pk.name

            if not isinstance(data, dict):
                return super(RelationModelSerializer, self).validate_empty_values(data)

            if not model_pk in data:
                raise serializers.ValidationError({model_pk: model_pk + ' is required'})

            try:
                instance = model.objects.get(pk=data[model_pk])
                return True, instance
            except:
                raise serializers.ValidationError({model_pk: model_pk + ' is not valid'})
 
        return super(RelationModelSerializer, self).validate_empty_values(data)
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('university', 'date_of_birth')

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile

        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile.university = profile_data.get('university', profile.university)
        profile.save()

        return instance

class APIUserSerializer(RelationModelSerializer):
    profile = UserProfileSerializer(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'email', 'date_joined', 'profile')

class AuthUserSerializer(RelationModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
        
class StageSerializer(RelationModelSerializer):
    class Meta:
        model = Stage
        fields = ('id', 'name')

class BoardListSerializer(RelationModelSerializer):
    class Meta:
        model = BoardList
        fields = ('id', 'title')

class CompanySerializer(RelationModelSerializer):
    class Meta:
        model = Company
        fields = ('id', 'name', 'icon', 'description')

class BoardSerializer(RelationModelSerializer):
    user = AuthUserSerializer(read_only=True, is_relation=True)

    class Meta:
        model = Board
        fields =  ('id', 'title', 'user', 'created_at')
        extra_kwargs = {
            'user':  { 'read_only': True }
        }

class QuestionSerializer(RelationModelSerializer):
    class Meta:
        model = Question
        fields =  ('id', 'text', 'interview')

class InterviewSerializer(RelationModelSerializer):
    stage = StageSerializer(read_only=False, is_relation=True)
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Interview
        fields =  ('id', 'application', 'stage', 'description', 'date', 'location', 'result', 'duration', 'experience', 'difficulty', 'questions')
        extra_kwargs = {
            'questions':  { 'read_only': True }
        }

    def get_questions(self, instance):
        questions = instance.questions.all().order_by('-id')
        return QuestionSerializer(questions, read_only=True, many=True, is_relation=True).data

class NoteSerializer(RelationModelSerializer):
    class Meta:
        model = Note
        fields =  ('id', 'text', 'application', 'created_at')

class ApplicationSerializer(RelationModelSerializer):
    board_list = BoardListSerializer(read_only=False, is_relation=True)
    board = BoardSerializer(read_only=False, is_relation=True)
    user = AuthUserSerializer(read_only=True, is_relation=True)
    notes = serializers.SerializerMethodField()
    interviews = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields =  ('id', 'company_name', 'icon', 'description', 'role', 'link', 'location', 'date_applied', 'order_index', 'board_list', 'user', 'board', 'interviews', 'notes', 'created_at')
        extra_kwargs = {
            'user':  { 'read_only': True },
            'interviews':  { 'read_only': True },
            'notes':  { 'read_only': True }
        }

    def get_notes(self, instance):
        notes = instance.notes.all().order_by('-created_at')
        return NoteSerializer(notes, read_only=True, many=True, is_relation=True).data

    def get_interviews(self, instance):
        interviews = instance.interviews.all().order_by('-date')
        return InterviewSerializer(interviews, read_only=True, many=True, is_relation=True).data