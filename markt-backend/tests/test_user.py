import pytest
from pathlib import Path
from flask import jsonify

from public.errors import ErrorRsp
from public import create_app_api
from src.db import db
from src.models import User

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
    non_UofT_user = {"username":"UserOne", "password":"abc123", "email":"user@gmail.com", "role":"buyer"}
    rsp = client.post('/api/register_user', json=non_UofT_user)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Email must be a valid UofT email!' in rsp["message"]

    UofT_user_invalid_role = {"username":"UserTwo", "password":"efg123", "email":"user@utoronto.ca", "role":"student"}
    rsp = client.post('/api/register_user', json=UofT_user_invalid_role)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert "Role must be 'buyer' or 'seller'!" in rsp["message"]

    UofT_valid_buyer = {"username":"UserThree", "password":"hij23", "email":"user@utoronto.ca", "role":"buyer"}
    rsp = client.post('/api/register_user', json=UofT_valid_buyer)
    assert rsp.status_code == 201
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User registered successfully!' in rsp["message"]

    rsp = client.post('/api/register_user', json=UofT_valid_buyer)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'User already exists!' in rsp["message"]

    UofT_valid_seller = {"username":"UserFour", "password":"klm123", "email":"user@mail.utoronto.ca", "role":"seller"}
    rsp = client.post('/api/register_user', json=UofT_valid_seller)
    assert rsp.status_code == 201
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User registered successfully!' in rsp["message"]

def test_login(client):
    user = User("testUser", "mypassword", "user@mail.utoronto.ca", User.UserRole.BUYER)
    db.session.add(user)
    db.session.commit()

    invalid_username = {"username":"UserOne", "password":"abc123"}
    rsp = client.post('/api/login', json=invalid_username)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert 'User does not exist!' in rsp["message"]

    invalid_password = {"username":"testUser", "password":"iamwrong"}
    rsp = client.post('/api/login', json=invalid_password)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Incorrect password!' in rsp["message"]

    valid_user = {"username":"testUser", "password":"mypassword"}
    rsp = client.post('/api/login', json=valid_user)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User logged in successfully!' in rsp["message"]
