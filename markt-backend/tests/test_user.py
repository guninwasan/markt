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
    # Not enough parameters
    wrong_data = {"email": "hello"}
    rsp = client.post('/api/user/register', json=wrong_data)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]

    # Invalid email, phone number, and password
    non_UofT_user = {"full_name": "Test User", "password": "abc123",
                     "email": "user@gmail.com", "phone": "6478290835"}
    rsp = client.post('/api/user/register', json=non_UofT_user)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Email must be a valid UofT email!' in rsp["data"]

    # Valid data
    UofT_valid_buyer = {"full_name": "Test User", "password": "abc123C$",
                        "email": "user@utoronto.ca", "phone": "6478290835"}
    rsp = client.post('/api/user/register', json=UofT_valid_buyer)
    assert rsp.status_code == 201
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User registered successfully!' in rsp["data"]

    # Try to register same user twice
    rsp = client.post('/api/user/register', json=UofT_valid_buyer)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM_DUP.value == rsp["status"]
    assert 'User already exists!' in rsp["data"]

def test_login(client):
    # Not enough parameters
    wrong_data = {"email": "hello"}
    rsp = client.post('/api/user/login', json=wrong_data)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]

    # Create a user in the database
    user = User(full_name="Jane Doe", password="myPass%wor3",
                email="user@mail.utoronto.ca", phone="6478290835")
    db.session.add(user)
    db.session.commit()

    # Try to login with a non existant user's email
    non_existant_user = {"email": "wrong_email@mail.utoronto.ca", "password": "abc123C$"}
    rsp = client.post('/api/user/login', json=non_existant_user)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert 'User does not exist!' in rsp["data"]

    # Try to login with wrong password
    invalid_password = {"email": "user@mail.utoronto.ca", "password": "IamWrong$5"}
    rsp = client.post('/api/user/login', json=invalid_password)
    assert rsp.status_code != 200
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Incorrect password!' in rsp["data"]

    # Login with correct credentials
    valid_user = {"email": "user@mail.utoronto.ca", "password": "myPass%wor3"}
    rsp = client.post('/api/user/login', json=valid_user)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User logged in successfully!' in rsp["data"]

def test_update(client):
    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    db.session.add(user)
    db.session.commit()

    # Invalid user
    non_existent_user = {
        "verification_email": "invalid@mail.utoronto.ca",
        "new_phone": "8394039291"
    }
    rsp = client.post('/api/user/update', json=non_existent_user)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert 'User does not exist!' in rsp["data"]

    # Valid update data
    update_data = {
        "verification_email": user.email,
        "new_full_name": "John Smith",
        "new_email": "new_email@mail.utoronto.ca",
        "new_phone": "1234567890",
        "new_password": "mY8iwp@ssword"
    }
    rsp = client.post('/api/user/update', json=update_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert update_data["new_email"] == rsp["data"]["email"]
    assert update_data["new_full_name"] == rsp["data"]["full_name"]
    assert update_data["new_phone"] == rsp["data"]["phone"]
    assert "Updated" == rsp["data"]["password"]

    # Verify updates in the database
    updated_user = User.query.filter_by(email=update_data["new_email"]).first()
    assert updated_user.email == update_data["new_email"]
    assert updated_user.phone == update_data["new_phone"]
    assert updated_user.full_name == update_data["new_full_name"]

def test_rating(client):
    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    db.session.add(user)
    db.session.commit()

    # Invalid rating
    update_data = {
        "verification_email": user.email,
        "new_rating": -10
    }
    rsp = client.post('/api/user/update', json=update_data)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]

    # Rating 1: 5
    update_data = {
        "verification_email": user.email,
        "new_rating": 5
    }
    rsp = client.post('/api/user/update', json=update_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert update_data["new_rating"] == rsp["data"]["rating"]

    # Rating 2: 3.5, Average: 4.25
    update_data = {
        "verification_email": user.email,
        "new_rating": 3.5
    }
    rsp = client.post('/api/user/update', json=update_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 4.25 == rsp["data"]["rating"]
