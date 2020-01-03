from django.urls import include, path
from rest_framework import routers
from api import views
from knox import views as knox_views

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet, basename='user') #generates routes for a standard set of create/retrieve/update/destroy style actions
router.register(r'stage', views.StageViewSet, basename='stage')
router.register(r'boardlist', views.BoardListViewSet, basename='boardlist')
router.register(r'board', views.BoardViewSet, basename='board')
router.register(r'application', views.ApplicationViewSet, basename='application')
router.register(r'company', views.CompanyViewSet, basename='company')
router.register(r'interview', views.InterviewViewSet, basename='interview')
router.register(r'question', views.QuestionViewSet, basename='question')
router.register(r'note', views.NoteViewSet, basename='note')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.LoginApiView.as_view()), #authenticates user and generates token
    path('auth/user/', views.UserApiView.as_view()), #get only - retrieves current logged in user
    path('auth/changepassword/', views.ChangePasswordView.as_view()),
    path('auth/logout/', knox_views.LogoutView.as_view(), name='knox_logout'), #expires token
    path('application/board/<board_id>/', views.ApplicationsByBoardIdView.as_view(), name='application_board') #lists job application entries by board_id
]