from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, Stage, Company, Board, Application, Interview, BoardList, Question

# Define an inline admin descriptor for UserProfile model
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Stage)
admin.site.register(BoardList)
admin.site.register(Company)
admin.site.register(Board)
admin.site.register(Application)
admin.site.register(Interview)
admin.site.register(Question)