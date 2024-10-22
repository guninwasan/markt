import pytest
from pathlib import Path

from utils.errors import ErrorRsp
from public import create_app_api
from database.db import db
from database.models import User

TEST_DB = "test_user.db"

@pytest.fixture
def client():
    BASE_DIR = Path(__file__).resolve().parent.parent
    app = create_app_api()
    app.config["TESTING"] = True
    app.config["DATABASE"] = BASE_DIR.joinpath(TEST_DB)
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{BASE_DIR.joinpath(TEST_DB)}"

    with app.app_context():
        db.create_all()  # setup
        yield app.test_client()  # tests run here
        db.drop_all()  # teardown

def test_register(client):
    wrong_data = {"username": "hello"}
    rsp = client.post('/api/user/register', json=wrong_data)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]

    non_UofT_user = {"username":"UserOne", "password":"abc123",
                     "email":"user@gmail.com", "phone":"6478290835"}
    rsp = client.post('/api/user/register', json=non_UofT_user)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Email must be a valid UofT email!' in rsp["data"]

    UofT_valid_buyer = {"username":"UserThree", "password":"hij23",
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
    wrong_data = {"username": "hello"}
    rsp = client.post('/api/user/login', json=wrong_data)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]

    user = User("testUser", "mypassword", "user@mail.utoronto.ca", "6478290835")
    db.session.add(user)
    db.session.commit()

    invalid_username = {"username":"UserOne", "password":"abc123"}
    rsp = client.post('/api/user/login', json=invalid_username)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert 'User does not exist!' in rsp["data"]

    invalid_password = {"username":"testUser", "password":"iamwrong"}
    rsp = client.post('/api/user/login', json=invalid_password)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Incorrect password!' in rsp["data"]

    valid_user = {"username":"testUser", "password":"mypassword"}
    rsp = client.post('/api/user/login', json=valid_user)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User logged in successfully!' in rsp["data"]
