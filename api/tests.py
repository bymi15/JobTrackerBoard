import json
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase
from knox.models import AuthToken
import datetime

from api.serializers import UserProfileSerializer
from api.models import UserProfile, Stage, Company, Application, Interview, Board, BoardList, Note

class LoginTestCase(APITestCase):
    def setUp(self):
        User.objects.create_user(username="user1", email="user1@user1.com", 
                                password="user1", first_name="James",
                                last_name="Bond")

    def test_login_correct(self):
        data = {"username": "user1", "password": "user1"}
        response = self.client.post("/api/auth/login/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["username"], "user1")
        self.assertTrue(response.data["token"])

    def test_login_incorrect1(self):
        data = {"username": "user1", "password": "user123"}
        response = self.client.post("/api/auth/login/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_incorrect2(self):
        data = {"username": "user123", "password": "user1"}
        response = self.client.post("/api/auth/login/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class RegisterTestCase(APITestCase):
    def test_register(self):
        profile = {"university": "test", "date_of_birth": "1999-09-09"}
        data = {"username": "test123", "email": "test@test.com",
                "password": "asd_123_test#",
                "first_name": "James", "last_name": "Bond",
                "profile": profile}
        response = self.client.post("/api/user/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().first_name, 'James')

class UserTestCase(APITestCase):
    def setUp(self):
        self.adminUser = User.objects.create_superuser(username="admin", password="admin", email="admin@admin.com")

        self.user = User.objects.create_user(username="user1", email="user1@user1.com", 
                                            password="user1", first_name="James",
                                            last_name="Bond")
        UserProfile.objects.create(user=self.user, university="test", date_of_birth="1999-09-09")
        self.token = AuthToken.objects.create(self.user)[1]
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token)

        self.anotherUser = User.objects.create_user(username="user2", email="user2@user2.com", 
                                            password="user2", first_name="Peter",
                                            last_name="Parker")

    def test_get_user_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "user1")
        self.assertEqual(response.data["profile"]["date_of_birth"], "1999-09-09")

    def test_get_user_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_list_by_nonadmin(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/user/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_user_list_by_admin(self):
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.get('/api/user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_get_user_list_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/user/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_user_data(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/user/' + str(self.user.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_another_user_data(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/user/' + str(self.anotherUser.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_user_by_admin(self):
        anotherUser_id = self.anotherUser.id
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.delete('/api/user/' + str(anotherUser_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.filter(id=anotherUser_id).exists(), False)

    def test_destroy_user_by_nonadmin(self):
        anotherUser_id = self.anotherUser.id
        self.client.force_authenticate(user=self.user)
        response = self.client.delete('/api/user/' + str(anotherUser_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.filter(id=anotherUser_id).exists(), True)
        
    def test_update_user(self):
        profile = {"university": "test_changed", "date_of_birth": "2000-01-01"}
        data = {"username": "user1_changed", "email": "user1_changed@user1.com",
                "password": "user1",
                "first_name": "James_changed", "last_name": "Bond_changed",
                "profile": profile}

        self.client.force_authenticate(user=self.user)
        response = self.client.put('/api/user/' + str(self.user.id) + '/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK) # correct response
        self.assertEqual(User.objects.filter(first_name="James_changed").exists(), False) # first_name should not change
        self.assertEqual(User.objects.filter(first_name="Bond_changed").exists(), False) # last_name should not change
        self.assertEqual(User.objects.filter(username="user1_changed").exists(), False) # username should not change
        self.assertEqual(User.objects.filter(username="user1").exists(), True) # username should not change
        self.assertEqual(User.objects.filter(email="user1_changed@user1.com").exists(), True) # email should change
        self.assertEqual(User.objects.filter(profile__university="test_changed").exists(), True) # profile university should change
        self.assertEqual(User.objects.filter(profile__date_of_birth="2000-01-01").exists(), False) # profile date_of_birth should not change

    def test_update_another_user(self):
        profile = {"university": "test", "date_of_birth": "1999-09-09"}
        data = {"username": "user1_changed", "email": "user1@user1.com",
                "first_name": "James", "last_name": "Bond",
                "profile": profile}

        self.client.force_authenticate(user=self.user)
        response = self.client.put('/api/user/' + str(self.anotherUser.id) + '/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.filter(username="user1_changed").exists(), False)

    def test_partial_update_user(self):
        profile = {"university": "test_changed" }
        data = {"email": "user1_changed@user1.com", "profile": profile}

        self.client.force_authenticate(user=self.user)
        response = self.client.patch('/api/user/' + str(self.user.id) + '/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.filter(email="user1_changed@user1.com").exists(), True)
        self.assertEqual(User.objects.filter(profile__university="test_changed").exists(), True)

    def test_partial_update_another_user(self):
        profile = {"university": "test_changed" }
        data = {"username": "user1_changed", "profile": profile}

        self.client.force_authenticate(user=self.user)
        response = self.client.patch('/api/user/' + str(self.anotherUser.id) + '/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.filter(username="user1_changed").exists(), False)

class CompanyTestCase(APITestCase):
    def setUp(self):
        self.adminUser = User.objects.create_superuser(username="admin", password="admin", email="admin@admin.com")

        self.user = User.objects.create_user(username="user1", email="user1@user1.com", 
                                            password="user1", first_name="James",
                                            last_name="Bond")

        self.company = Company.objects.create(name="Google", icon="none", description="none")
        Company.objects.create(name="Amazon", icon="none", description="none")

    def test_create_company_by_admin(self):
        company_data = {"name": "Facebook", "icon": "none", "description": "none"}
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.post('/api/company/', company_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Facebook")

    def test_create_company_by_nonadmin(self):
        company_data = {"name": "Facebook", "icon": "none", "description": "none"}
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/company/', company_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_company_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/company/' + str(self.company.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Google")

    def test_get_company_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/company/' + str(self.company.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_company_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/company/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_company_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/company/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_company_by_admin(self):
        company_id = self.company.id
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.delete('/api/company/' + str(company_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Company.objects.filter(id=company_id).exists(), False)

    def test_destroy_company_by_nonadmin(self):
        company_id = self.company.id
        self.client.force_authenticate(user=self.user)
        response = self.client.delete('/api/company/' + str(company_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Company.objects.filter(id=company_id).exists(), True)

    def test_update_company_by_admin(self):
        company_data = {"name": "Google", "icon": "new_icon", "description": "new_desc"}

        self.client.force_authenticate(user=self.adminUser)
        response = self.client.put('/api/company/' + str(self.company.id) + '/', company_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK) # correct response
        self.assertEqual(Company.objects.filter(name="Google", icon="new_icon", description="new_desc").exists(), True)

    def test_update_company_by_nonadmin(self):
        company_data = {"name": "Google", "icon": "new_icon", "description": "new_desc"}

        self.client.force_authenticate(user=self.user)
        response = self.client.put('/api/company/' + str(self.company.id) + '/', company_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_company_by_admin(self):
        company_data = {"icon": "new_icon"}

        self.client.force_authenticate(user=self.adminUser)
        response = self.client.patch('/api/company/' + str(self.company.id) + '/', company_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK) # correct response
        self.assertEqual(Company.objects.filter(name="Google", icon="new_icon").exists(), True)

    def test_partial_update_company_by_nonadmin(self):
        company_data = {"icon": "new_icon"}

        self.client.force_authenticate(user=self.user)
        response = self.client.patch('/api/company/' + str(self.company.id) + '/', company_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class StageTestCase(APITestCase):
    def setUp(self):
        self.adminUser = User.objects.create_superuser(username="admin", password="admin", email="admin@admin.com")

        self.user = User.objects.create_user(username="user1", email="user1@user1.com", 
                                            password="user1", first_name="James",
                                            last_name="Bond")

        self.stage = Stage.objects.create(name="Phone Interview")
        Stage.objects.create(name="Online Assessment")

    def test_create_stage_by_admin(self):
        data = {"name": "On-site Interview"}
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.post('/api/stage/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "On-site Interview")

    def test_create_stage_by_nonadmin(self):
        data = {"name": "On-site Interview"}
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/stage/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_stage_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/stage/' + str(self.stage.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Phone Interview")

    def test_get_stage_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/stage/' + str(self.stage.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_stage_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/stage/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_stage_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/stage/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_stage_by_admin(self):
        stage_id = self.stage.id
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.delete('/api/stage/' + str(stage_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Stage.objects.filter(id=stage_id).exists(), False)

    def test_destroy_stage_by_nonadmin(self):
        stage_id = self.stage.id
        self.client.force_authenticate(user=self.user)
        response = self.client.delete('/api/stage/' + str(stage_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Stage.objects.filter(id=stage_id).exists(), True)
    
    def test_update_stage_by_admin(self):
        data = {"name": "Phone Interview 2"}

        self.client.force_authenticate(user=self.adminUser)
        response = self.client.put('/api/stage/' + str(self.stage.id) + '/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK) # correct response
        self.assertEqual(Stage.objects.filter(name="Phone Interview 2").exists(), True)

    def test_update_stage_by_nonadmin(self):
        data = {"name": "Phone Interview 2"}

        self.client.force_authenticate(user=self.user)
        response = self.client.put('/api/stage/' + str(self.stage.id) + '/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class BoardListTestCase(APITestCase):
    def setUp(self):
        self.adminUser = User.objects.create_superuser(username="admin", password="admin", email="admin@admin.com")

        self.user = User.objects.create_user(username="user1", email="user1@user1.com", 
                                            password="user1", first_name="James",
                                            last_name="Bond")

        self.boardList = BoardList.objects.create(title="Applied")
        BoardList.objects.create(title="Offer")

    def test_create_boardlist_by_admin(self):
        data = {"title": "Interview"}
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.post('/api/boardlist/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Interview")

    def test_create_boardlist_by_nonadmin(self):
        data = {"title": "Interview"}
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/boardlist/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_boardlist_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/boardlist/' + str(self.boardList.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Applied")

    def test_get_boardlist_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/boardlist/' + str(self.boardList.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_boardlist_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/boardlist/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_boardlist_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/boardlist/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_boardlist_by_admin(self):
        boardlist_id = self.boardList.id
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.delete('/api/boardlist/' + str(boardlist_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(BoardList.objects.filter(id=boardlist_id).exists(), False)

    def test_destroy_boardlist_by_nonadmin(self):
        boardlist_id = self.boardList.id
        self.client.force_authenticate(user=self.user)
        response = self.client.delete('/api/boardlist/' + str(boardlist_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(BoardList.objects.filter(id=boardlist_id).exists(), True)
    
    def test_update_boardlist_by_admin(self):
        data = {"title": "Rejected"}
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.put('/api/boardlist/' + str(self.boardList.id) + '/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(BoardList.objects.filter(title="Rejected").exists(), True)

    def test_update_boardlist_by_nonadmin(self):
        data = {"title": "Rejected"}
        self.client.force_authenticate(user=self.user)
        response = self.client.put('/api/boardlist/' + str(self.boardList.id) + '/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class BoardTestCase(APITestCase):
    def setUp(self):
        self.adminUser = User.objects.create_superuser(username="admin", password="admin", email="admin@admin.com")

        self.user = User.objects.create_user(username="user1", email="user1@user1.com", 
                                            password="user1", first_name="James",
                                            last_name="Bond")

        self.anotherUser = User.objects.create_user(username="user2", email="user2@user2.com", 
                                            password="user2", first_name="Peter",
                                            last_name="Parker")

        self.board = Board.objects.create(title="2020 Summer Internships", user=self.user)
        Board.objects.create(title="2021 Graduate SWE", user=self.user)
        Board.objects.create(title="Another User Board 1", user=self.anotherUser)
        Board.objects.create(title="Another User Board 2", user=self.anotherUser)

    def test_create_board_authenticated(self):
        data = {"title": "2022 SWE Role"}
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/board/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "2022 SWE Role")

    def test_create_board_unauthenticated(self):
        data = {"title": "2022 SWE at FANG"}
        self.client.force_authenticate(user=None)
        response = self.client.post('/api/board/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_board_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/board/' + str(self.board.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "2020 Summer Internships")

    def test_get_board_another_user(self):
        self.client.force_authenticate(user=self.anotherUser)
        response = self.client.get('/api/board/' + str(self.board.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) #board query gets filtered by user id

    def test_get_board_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/board/' + str(self.board.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_board_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/board/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["title"], "2020 Summer Internships")

    def test_list_board_by_admin(self):
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.get('/api/board/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_list_board_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/board/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_board(self):
        board_id = self.board.id
        self.client.force_authenticate(user=self.user)
        response = self.client.delete('/api/board/' + str(board_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Board.objects.filter(id=board_id).exists(), False)

    def test_destroy_board_by_another_user(self):
        board_id = self.board.id
        self.client.force_authenticate(user=self.anotherUser)
        response = self.client.delete('/api/board/' + str(board_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Board.objects.filter(id=board_id).exists(), True)

    def test_update_board(self):
        data = {"title": "2050 SWE"}
        self.client.force_authenticate(user=self.user)
        response = self.client.put('/api/board/' + str(self.board.id) + '/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Board.objects.filter(title="2050 SWE").exists(), True)

    def test_update_board_by_another_user(self):
        data = {"title": "2050 SWE"}
        self.client.force_authenticate(user=self.anotherUser)
        response = self.client.put('/api/board/' + str(self.board.id) + '/', data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class ApplicationTestCase(APITestCase):
    def setUp(self):
        self.adminUser = User.objects.create_superuser(username="admin", password="admin", email="admin@admin.com")

        self.user = User.objects.create_user(username="user1", email="user1@user1.com", 
                                            password="user1", first_name="James",
                                            last_name="Bond")

        self.anotherUser = User.objects.create_user(username="user2", email="user2@user2.com", 
                                            password="user2", first_name="Peter",
                                            last_name="Parker")

        self.board = Board.objects.create(title="2020 Summer Internships", user=self.user)

        self.anotherBoard = Board.objects.create(title="2021 Graduate SWE", user=self.anotherUser)

        self.boardList = BoardList.objects.create(title="Applied")
        self.boardList2 = BoardList.objects.create(title="Interview")

        self.application = Application.objects.create(board=self.board, company_name="Google", board_list=self.boardList, user=self.user,
                                                        description="job description", role="Software Engineering Intern", link="http://google.com", 
                                                        location="London, UK", date_applied=datetime.date.today())

        Application.objects.create(board=self.board, company_name="Facebook", board_list=self.boardList2, user=self.user,
                                                        description="job description 2", role="Software Engineering Co-op", link="http://facebook.com", 
                                                        location="London, UK", date_applied=datetime.date.today())

        Application.objects.create(board=self.anotherBoard, company_name="Google", board_list=self.boardList, user=self.anotherUser,
                                                        description="job description 3", role="Graduate Software Engineer", link="http://google.com", 
                                                        location="Kings Cross, London", date_applied=datetime.date.today())

    def test_create_application_authenticated(self):
        data = {
            "board":{ "id": self.board.id }, "company_name":"Facebook", "board_list":{ "id": self.boardList.id },
            "description":"job description 3", "role":"Software Engineering Co-op", "link":"http://facebook.com", 
            "location":"San Francisco, California", "date_applied":"2019-10-29"
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/application/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["role"], "Software Engineering Co-op")
        self.assertEqual(response.data["board"]["title"], "2020 Summer Internships")
        self.assertEqual(response.data["board"]["user"]["username"], "user1")
        self.assertEqual(response.data["user"]["username"], "user1")

    def test_create_application_another_user_board(self):
        data = {
            "board":{ "id": self.anotherBoard.id }, "company_name":"Facebook", "board_list":{ "id": self.boardList.id },
            "description":"job description 3", "role":"Software Engineering Co-op", "link":"http://facebook.com", 
            "location":"San Francisco, California", "date_applied":"2019-10-29"
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/application/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_application_unauthenticated(self):
        data = {
            "board":{ "id": self.board.id }, "company_name":"Facebook", "board_list":{ "id": self.boardList.id },
            "description":"job description 3", "role":"Software Engineering Co-op", "link":"http://facebook.com", 
            "location":"San Francisco, California", "date_applied":"2019-10-29"
        }
        self.client.force_authenticate(user=None)
        response = self.client.post('/api/application/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_application_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/application/' + str(self.application.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], "Software Engineering Intern")
        self.assertEqual(response.data["board"]["title"], "2020 Summer Internships")
        self.assertEqual(response.data["board"]["user"]["username"], "user1")

    def test_get_application_another_user(self):
        self.client.force_authenticate(user=self.anotherUser)
        response = self.client.get('/api/application/' + str(self.application.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) # application query gets filtered by user id

    def test_get_application_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/application/' + str(self.application.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_application_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/application/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]["role"], "Software Engineering Co-op")

    def test_list_application_by_admin(self):
        self.client.force_authenticate(user=self.adminUser)
        response = self.client.get('/api/application/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_list_application_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/application/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_application_by_board_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/application/board/' + str(self.board.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_application_by_board_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/application/board/' + str(self.board.id) + '/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_application(self):
        application_id = self.application.id
        self.client.force_authenticate(user=self.user)
        response = self.client.delete('/api/application/' + str(application_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Application.objects.filter(id=application_id).exists(), False)

    def test_destroy_application_by_another_user(self):
        application_id = self.application.id
        self.client.force_authenticate(user=self.anotherUser)
        response = self.client.delete('/api/application/' + str(application_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Application.objects.filter(id=application_id).exists(), True)

    def test_update_application(self):
        data = {
            "board":{ "id": self.board.id }, "company_name":"Amazon", "icon":"http://amazon.com/icon", "board_list":{ "id": self.boardList2.id },
            "description":"job description 9", "role":"Graduate Software Engineer", "link":"http://amazon.com", 
            "location":"Cambridge, UK", "date_applied":"2019-10-29"
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put('/api/application/' + str(self.application.id) + '/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Application.objects.filter(company_name="Amazon").exists(), True)

    def test_update_application_by_another_user(self):
        data = {
            "board":{ "id": self.board.id }, "company_name":"Amazon", "icon":"http://amazon.com/icon", "board_list":{ "id": self.boardList2.id },
            "description":"job description 9", "role":"Graduate Software Engineer", "link":"http://amazon.com", 
            "location":"Cambridge, UK", "date_applied":"2019-10-29"
        }
        self.client.force_authenticate(user=self.anotherUser)
        response = self.client.put('/api/application/' + str(self.application.id) + '/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_partial_update_application(self):
        data = {"icon": "new_icon", "board_list":{"id": self.boardList2.id }}
        self.client.force_authenticate(user=self.user)
        response = self.client.patch('/api/application/' + str(self.application.id) + '/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK) # correct response
        self.assertEqual(Application.objects.filter(icon="new_icon", company_name="Google", board_list__title="Interview").exists(), True)

    def test_partial_update_application_by_another_user(self):
        data = {"icon": "new_icon", "board_list":{"id": self.boardList2.id }}
        self.client.force_authenticate(user=self.anotherUser)
        response = self.client.patch('/api/application/' + str(self.application.id) + '/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        
class NoteTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user1", email="user1@user1.com", 
                                            password="user1", first_name="James",
                                            last_name="Bond")

        self.anotherUser = User.objects.create_user(username="user2", email="user2@user2.com", 
                                            password="user2", first_name="Peter",
                                            last_name="Parker")

        self.board = Board.objects.create(title="2020 Summer Internships", user=self.user)

        self.boardList = BoardList.objects.create(title="Applied")

        self.application = Application.objects.create(board=self.board, company_name="Google", board_list=self.boardList, user=self.user,
                                                        description="job description", role="Software Engineering Intern", link="http://google.com", 
                                                        location="London, UK", date_applied=datetime.date.today())

        self.anotherApplication = Application.objects.create(board=self.board, company_name="Facebook", board_list=self.boardList, user=self.anotherUser,
                                                        description="job description 2", role="Software Engineering Co-op", link="http://facebook.com", 
                                                        location="London, UK", date_applied=datetime.date.today())

        self.note = Note.objects.create(application=self.application, note="test note")
        self.anotherNote = Note.objects.create(application=self.anotherApplication, note="test note 2")

    def test_create_note_authenticated(self):
        data = {
            "application":{ "id": self.application.id },
            "note": "test note 123"
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/note/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["note"], "test note 123")
        
    def test_create_note_another_user(self):
        data = {
            "application":{ "id": self.application.id },
            "note": "test note 123"
        }
        self.client.force_authenticate(user=self.anotherUser)
        response = self.client.post('/api/note/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_note_unauthenticated(self):
        data = {
            "application":{ "id": self.application.id },
            "note": "test note 123"
        }
        self.client.force_authenticate(user=None)
        response = self.client.post('/api/note/', data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)