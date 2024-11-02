import pytest

from utils.errors import ErrorRsp
from public import create_app_api
from database.db import db
from database.models import User

@pytest.fixture
def client():
    app = create_app_api(testing=True)

    with app.app_context():
        db.create_all()  # setup
        yield app.test_client()  # tests run here
        db.session.remove()  # Clear session to prevent dirty reads
        db.drop_all()  # teardown

def test_register(client):
    wrong_data = {"utorid": "hello"}
    rsp = client.post('/api/user/register', json=wrong_data)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]

    non_UofT_user = {"utorid":"UserOne", "password":"abc123",
                     "email":"user@gmail.com", "phone":"6478290835"}
    rsp = client.post('/api/user/register', json=non_UofT_user)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Email must be a valid UofT email!' in rsp["data"]

    UofT_valid_buyer = {"utorid":"UserThree", "password":"hij23",
                        "email":"user@utoronto.ca", "phone":"6478290835"}
    rsp = client.post('/api/user/register', json=UofT_valid_buyer)
    assert rsp.status_code == 201
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User registered successfully!' in rsp["data"]

    rsp = client.post('/api/user/register', json=UofT_valid_buyer)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'User already exists!' in rsp["data"]

def test_login(client):
    wrong_data = {"email": "hello"}
    rsp = client.post('/api/user/login', json=wrong_data)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]

    user = User(utorid="testUser", email="user@mail.utoronto.ca", phone="6478290835", password="mypassword")
    db.session.add(user)
    db.session.commit()

    non_existant_user = {"email": "wrong_email@mail.utoronto.ca", "password": "abc123"}
    rsp = client.post('/api/user/login', json=non_existant_user)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert 'User does not exist!' in rsp["data"]

    invalid_password = {"email": "user@mail.utoronto.ca", "password": "iamwrong"}
    rsp = client.post('/api/user/login', json=invalid_password)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Incorrect password!' in rsp["data"]

    valid_user = {"email": "user@mail.utoronto.ca", "password": "mypassword"}
    rsp = client.post('/api/user/login', json=valid_user)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User logged in successfully!' in rsp["data"]
    assert user.validate_password(valid_user["password"])
