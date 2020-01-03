from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.renderers import JSONRenderer
from rest_framework.exceptions import PermissionDenied
from rest_framework import viewsets, generics, status
from knox.models import AuthToken
from .models import User, Stage, Company, Board, Application, Interview, BoardList, Note, Question
from .serializers import NoteSerializer, StageSerializer, ApplicationSerializer, BoardListSerializer, InterviewSerializer, QuestionSerializer, CompanySerializer, BoardSerializer, UserSerializer, APIUserSerializer, LoginSerializer, ChangePasswordSerializer
from .permissions import IsOwner, IsOwnerApplication, IsOwnerInterview, IsSameUser
from django.db.models import F

class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.all()
    serializer_class = StageSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAdminUser]
        elif self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list':
            permission_classes = [IsAuthenticated]
        elif self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class BoardListViewSet(viewsets.ModelViewSet):
    serializer_class = BoardListSerializer

    def get_queryset(self):
        return BoardList.objects.all().order_by('id')

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAdminUser]
        elif self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list':
            permission_classes = [IsAuthenticated]
        elif self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Board.objects.all().order_by('id')
        return Board.objects.filter(user=self.request.user).order_by('id')

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list':
            permission_classes = [IsAuthenticated]
        elif self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAuthenticated, IsOwner]
        elif self.action == 'destroy':
            permission_classes = [IsAuthenticated, IsOwner]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAdminUser]
        elif self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list':
            permission_classes = [IsAuthenticated]
        elif self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Application.objects.all().order_by('id')
        return Application.objects.filter(user=self.request.user).order_by('id')

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'retrieve':
            permission_classes = [IsAuthenticated, IsOwner]
        elif self.action == 'list':
            permission_classes = [IsAuthenticated, IsOwner]
        elif self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAuthenticated, IsOwner]
        elif self.action == 'destroy':
            permission_classes = [IsAuthenticated, IsOwner]
        return [permission() for permission in permission_classes]

    def perform_destroy(self, instance):
        board_list = instance.board_list
        board = instance.board
        instance.delete()

        applications = Application.objects.filter(board_list=board_list, board=board).order_by('order_index')
        for c, application in enumerate(applications):
            application.order_index = c
            application.save()

    def perform_update(self, serializer):
        #only consider for ordering updates
        order_index = serializer.validated_data.get('order_index')
        if order_index:
            board_list = serializer.validated_data.get('board_list')
            prev_board_list_id = self.get_object().board_list.id
            prev_order_index = self.get_object().order_index

            if prev_board_list_id != board_list.id:
                #shift jobs (below) down one
                Application.objects.filter(board_list=board_list, board=self.get_object().board, order_index__gte=order_index).update(order_index=F('order_index') + 1)
                #re-order previous board list
                applications = Application.objects.filter(board_list=board_list, board=self.get_object().board).order_by('order_index')
                for c, application in enumerate(applications):
                    application.order_index = c
                    application.save()
            elif order_index > prev_order_index:
                #shift jobs (below) up one
                Application.objects.filter(board_list=board_list, board=self.get_object().board, order_index__gte=order_index).update(order_index=F('order_index') - 1)
            elif order_index < prev_order_index:
                #shift jobs (above) down one
                Application.objects.filter(board_list=board_list, board=self.get_object().board, order_index__lte=order_index).update(order_index=F('order_index') + 1)

            serializer.save()

            # #re-order new board list
            applications = Application.objects.filter(board_list=board_list, board=self.get_object().board).order_by('order_index')
            for i, application in enumerate(applications):
                application.order_index = i
                application.save()
        else:
            serializer.save()

    def perform_create(self, serializer):
        # search board and find owner (user)
        board = serializer.validated_data.get('board')
        found_board = Board.objects.get(pk=board.pk)

        if found_board.user == self.request.user:
            board_list = serializer.validated_data.get('board_list')
            count = Application.objects.filter(user=self.request.user, board=board, board_list=board_list).count()
            serializer.save(user=self.request.user, order_index=count)
        else: # forbid users from creating applications in other user boards
            raise PermissionDenied(detail=None, code=None)

class ApplicationsByBoardIdView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        board_id = self.kwargs['board_id']
        queryset = Application.objects.filter(board__id=board_id)
        if self.request.user.is_superuser:
            return queryset.order_by('id')
        return queryset.filter(user=self.request.user).order_by('id')

class InterviewViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, IsOwnerApplication)
    serializer_class = InterviewSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Interview.objects.all().order_by('-id')
        return Interview.objects.filter(application__user=self.request.user).order_by('-id')

    # def get_permissions(self):
    #     permission_classes = []
    #     if self.action == 'create':
    #         permission_classes = [IsAuthenticated, IsOwnerApplication]
    #     elif self.action == 'retrieve':
    #         permission_classes = [IsAuthenticated, IsOwnerApplication]
    #     elif self.action == 'list':
    #         permission_classes = [IsAdminUser]
    #     elif self.action == 'update' or self.action == 'partial_update':
    #         permission_classes = [IsAuthenticated, IsOwnerApplication]
    #     elif self.action == 'destroy':
    #         permission_classes = [IsAuthenticated, IsOwnerApplication]
    #     return [permission() for permission in permission_classes]


class NoteViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, IsOwnerApplication)
    serializer_class = NoteSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Note.objects.all().order_by('-id')
        return Note.objects.filter(application__user=self.request.user).order_by('-id')

class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, IsOwnerInterview)
    serializer_class = QuestionSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Question.objects.all().order_by('id')
        return Question.objects.filter(interview__application__user=self.request.user).order_by('id')

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [AllowAny]
        elif self.action == 'retrieve':
            permission_classes = [IsAuthenticated, IsSameUser]
        elif self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAuthenticated, IsSameUser]
        elif self.action == 'list' or self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs): #OVERRIDE create (for registering new users)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "user": APIUserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class UserApiView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = APIUserSerializer

    def get_object(self):
        return self.request.user

class LoginApiView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": APIUserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password is valid
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response("Invalid password.", status=status.HTTP_400_BAD_REQUEST)

            # Check new password is valid
            if serializer.data.get("old_password") == serializer.data.get("new_password"):
                return Response('New password same as old password.', status=status.HTTP_400_BAD_REQUEST)
            
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response(status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
