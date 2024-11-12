import pytest

from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock
from utils.errors import ErrorRsp
from public import create_app_api
from database.db import db
from database.models import User, Listing

@pytest.fixture
def client():
    app = create_app_api(testing=True)

    with app.app_context():
        db.create_all()  # setup
        yield app.test_client()  # tests run here
        db.session.remove()  # Clear session to prevent dirty reads
        db.drop_all()  # teardown

@patch('public.mail.send')
def test_register(mock_mail_send, client):
    mock_mail_send.return_value = MagicMock()

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
    assert 'User registered, email verification pending' in rsp["data"]
    mock_mail_send.assert_called_once()

    # verify email
    email = UofT_valid_buyer['email']
    # Invalid code
    rsp = client.post(f'/api/user/{email}/verify_email', json={"code": 9999})
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Invalid validation code' in rsp["data"]
    # correct code
    user = User.query.filter_by(email=email).first()
    code = user.validation_code
    rsp = client.post(f'/api/user/{email}/verify_email', json={"code": code})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User email verified successfully!' in rsp["data"]

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
    invalid_email = "invalid@mail.utoronto.ca"
    non_existent_user = {
        "phone": "8394039291"
    }
    rsp = client.post(f'/api/user/{invalid_email}/update', json=non_existent_user)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert 'User does not exist!' in rsp["data"]

    # Valid update data
    update_data = {
        "full_name": "John Smith",
        "email": "email@mail.utoronto.ca",
        "phone": "1234567890"
    }
    rsp = client.post(f'/api/user/{user.email}/update', json=update_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert update_data["email"] == rsp["data"]["email"]
    assert update_data["full_name"] == rsp["data"]["full_name"]
    assert update_data["phone"] == rsp["data"]["phone"]

    # Verify updates in the database
    updated_user = User.query.filter_by(email=update_data["email"]).first()
    assert updated_user.email == update_data["email"]
    assert updated_user.phone == update_data["phone"]
    assert updated_user.full_name == update_data["full_name"]

def test_change_password(client):
    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    db.session.add(user)
    db.session.commit()

    # Not enough data
    update_data = {
        "current_password": "mY8iwp@ssword"
    }
    rsp = client.post(f'/api/user/{user.email}/change_password', json=update_data)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]

    # Invalid current password and invalid format of new password
    update_data = {
        "current_password": "wrong_password!",
        "new_password": "hello_new_password"
    }
    rsp = client.post(f'/api/user/{user.email}/change_password', json=update_data)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM_PWD.value == rsp["status"]
    assert "Current password is incorrect" in rsp["data"]
    assert "New password must contain at minimum 8 characters," in rsp["data"][1]

    # Valid data
    update_data = {
        "current_password": "mY8iw$02j",
        "new_password": "HeLl0_n#w_password"
    }
    rsp = client.post(f'/api/user/{user.email}/change_password', json=update_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert "Password changed successfully!" in rsp["data"]

    # Verify updates in the database
    assert user.check_password(update_data["new_password"])

@patch('public.mail.send')
def test_forgot_password(mock_mail_send, client):
    mock_mail_send.return_value = MagicMock()

    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    db.session.add(user)
    db.session.commit()

    # Not enough data
    rsp = client.post(f'/api/user/{user.email}/forgot_password', json={})
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]

    # Invalid email for verification
    update_data = {
        "new_password": "hello_new_password"
    }
    rsp = client.post('/api/user/invalid@utoronto.ca/forgot_password', json=update_data)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert "User does not exist!" in rsp["data"]

    # Call forget password without email validation
    update_data = {
        "new_password": "HeLl0_n#w_password"
    }
    rsp = client.post(f'/api/user/{user.email}/forgot_password', json=update_data)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR.value == rsp["status"]
    assert "User email must be verified before resetting password" in rsp["data"]

    # Email verification process
    # Call verify_email for forgot password, state=UNSET
    rsp = client.post(f'/api/user/{user.email}/verify_email', json={'code': 999, 'for_forget_pwd': True})
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR.value == rsp["status"]
    assert "Email verification code has not been sent" in rsp["data"]

    # Call send_code
    rsp = client.post(f'/api/user/{user.email}/send_code', json={'for_forget_pwd': True})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert "Verification code sent to user's email" in rsp["data"]
    mock_mail_send.assert_called_once()
    assert user.forget_pwd == User.ForgetPasswordState.CodeSent

    # Call verify_email with code
    rsp = client.post(f'/api/user/{user.email}/verify_email', json={'code': user.validation_code, 'for_forget_pwd': True})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert "User email verified successfully!" in rsp["data"]

    # Invalid password format
    update_data = {
        "new_password": "hello_new_password"
    }
    rsp = client.post(f'/api/user/{user.email}/forgot_password', json=update_data)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM_PWD.value == rsp["status"]

    # Valid data
    update_data = {
        "new_password": "HeLl0_n#w_password"
    }
    rsp = client.post(f'/api/user/{user.email}/forgot_password', json=update_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert "Password reset successfully!" in rsp["data"]

    # Verify updates in the database
    assert user.check_password(update_data["new_password"])

def test_rating(client):
    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    db.session.add(user)
    db.session.commit()

    # Invalid rating
    update_data = {
        "rating": -10
    }
    rsp = client.post(f'/api/user/{user.email}/update', json=update_data)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]

    # Rating 1: 5
    update_data = {
        "rating": 5
    }
    rsp = client.post(f'/api/user/{user.email}/update', json=update_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert update_data["rating"] == rsp["data"]["rating"]

    # Rating 2: 3.5, Average: 4.25
    update_data = {
        "rating": 3.5
    }
    rsp = client.post(f'/api/user/{user.email}/update', json=update_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 4.25 == rsp["data"]["rating"]

def test_get_listings(client):
    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    user2 = User(full_name="Test Buyer", password="mY8333s$02j",
                email="buyer@mail.utoronto.ca", phone="6478234235")
    db.session.add(user)
    db.session.add(user2)
    db.session.commit()

    # Create listings
    listing_1 = Listing(
        title="Old Laptop",
        description="Old Laptop",
        price=400,
        pickup_location="UofT Mississauga",
        display_image="temp_url.png",
        owner_id=user.id
    )
    listing_2 = Listing(
        title="Old Calculator",
        description="Old Calculator",
        price=20,
        pickup_location="UofT Mississauga",
        display_image="temp_url.png",
        owner_id=user.id
    )
    db.session.add(listing_1)
    db.session.add(listing_2)
    db.session.commit()

    # Invalid email
    data = {"get_unsold": True}
    invalid_email = "invalid@utoronto.ca"
    rsp = client.get(f'/api/user/{invalid_email}/get_listings', json=data)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert "User does not exist!" == rsp["data"]

    # Check not sold list
    data = {"get_unsold": True, "minimal": False}
    rsp = client.get(f'/api/user/{user.email}/get_listings', json=data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    listing_ids = [l['database']['id'] for l in rsp["data"]["unsold_listings"]]
    assert listing_1.id in listing_ids
    assert listing_2.id in listing_ids

    # Mark listing as interested
    user2.listings_of_interest.append(listing_2)
    db.session.commit()

    # Check user2 listings
    data = {"get_interested": True, 'minimal': False}
    rsp = client.get(f'/api/user/{user2.email}/get_listings', json=data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert listing_2.id in [l['database']['id'] for l in rsp["data"]["interested_listings"]]

    # Mark listing as sold
    listing_1.sold = True
    listing_1.buyer_id = user2.id
    db.session.commit()

    # Check owner listings
    data = {"get_sold": True, "get_unsold": True, 'minimal': False}
    rsp = client.get(f'/api/user/{user.email}/get_listings', json=data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert listing_1.id in [l['database']['id'] for l in rsp["data"]["sold_listings"]]
    listing_ids = [l['database']['id'] for l in rsp["data"]["unsold_listings"]]
    assert (listing_2.id in listing_ids and
            listing_1.id not in listing_ids)

    # Check buyer listings
    data = {"get_bought": True, 'minimal': False}
    rsp = client.get(f'/api/user/{user2.email}/get_listings', json=data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert listing_1.id in [l['database']['id'] for l in rsp["data"]["bought_listings"]]

    # Check full
    data = {"get_bought": True, "minimal": False}
    rsp = client.get(f'/api/user/{user2.email}/get_listings', json=data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert listing_1.owner.email == rsp["data"]["bought_listings"][0]["database"]["owner"]["email"]

def test_delete(client):
    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    db.session.add(user)
    db.session.commit()

    # Invalid email
    rsp = client.delete('/api/user/invalid@utoronto.ca/delete')
    assert rsp.status_code == 404

    # Delete user
    rsp = client.delete(f'/api/user/{user.email}/delete')
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert rsp["data"] == "Deleted user successfully!"

    # Check user in database
    user_in_db = User.query.filter_by(email=user.email).first()
    assert user_in_db is None

def test_delete(client):
    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    db.session.add(user)
    db.session.commit()

    # Invalid email
    rsp = client.delete('/api/user/invalid@utoronto.ca/delete')
    assert rsp.status_code == 404

    # Delete user
    rsp = client.delete(f'/api/user/{user.email}/delete')
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert rsp["data"] == "Deleted user successfully!"

    # Check user in database
    user_in_db = User.query.filter_by(email=user.email).first()
    assert user_in_db is None

@patch('public.mail.send')
def test_send_code(mock_mail_send, client):
    mock_mail_send.return_value = MagicMock()

    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    db.session.add(user)
    db.session.commit()
    
    # Invalid email
    rsp = client.post('/api/user/invalid@mail.com/send_code', json={})
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert 'User does not exist!' in rsp["data"]

    # valid email
    rsp = client.post(f'/api/user/{user.email}/send_code', json={})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'Verification code sent to user\'s email' in rsp["data"]
    mock_mail_send.assert_called_once()

    # email already verified
    user.email_verified = True
    db.session.commit()
    rsp = client.post(f'/api/user/{user.email}/send_code', json={})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User email is already verified!' in rsp["data"]

def test_verify_email(client):
    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    
    # Mock set validation code and expiry
    code = 568392
    expiration_time = datetime.now() + timedelta(minutes=10)
    user.set_validation_code(code, expiration_time)
    db.session.add(user)
    db.session.commit()

    # Not enough data
    rsp = client.post('/api/user/invalid@mail.com/verify_email', json={})
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Missing parameters' in rsp["data"]

    # Invalid email
    rsp = client.post('/api/user/invalid@mail.com/verify_email', json={'code': 999})
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert 'User does not exist!' in rsp["data"]

    # Invalid code
    rsp = client.post(f'/api/user/{user.email}/verify_email', json={'code': 999})
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Invalid validation code' in rsp["data"]

    # Past expiration time
    previous_time = user.validation_code_expiration
    # Change expiration to be 11 minutes ago
    user.validation_code_expiration = datetime.now() - timedelta(minutes=11)
    db.session.commit()

    rsp = client.post(f'/api/user/{user.email}/verify_email', json={'code': user.validation_code})
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Validation code has expired' in rsp["data"]

    user.validation_code_expiration = previous_time # restore
    db.session.commit()

    # Valid request
    rsp = client.post(f'/api/user/{user.email}/verify_email', json={'code': user.validation_code})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User email verified successfully!' in rsp["data"]
@patch('public.mail.send')
def test_send_code(mock_mail_send, client):
    mock_mail_send.return_value = MagicMock()

    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    db.session.add(user)
    db.session.commit()
    
    # Invalid email
    rsp = client.post('/api/user/invalid@mail.com/send_code', json={})
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert 'User does not exist!' in rsp["data"]

    # valid email
    rsp = client.post(f'/api/user/{user.email}/send_code', json={})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'Verification code sent to user\'s email' in rsp["data"]
    mock_mail_send.assert_called_once()

    # email already verified
    user.email_verified = True
    db.session.commit()
    rsp = client.post(f'/api/user/{user.email}/send_code', json={})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User email is already verified!' in rsp["data"]

def test_verify_email(client):
    # Create a user
    user = User(full_name="Test User", password="mY8iw$02j",
                email="user@mail.utoronto.ca", phone="6478290835")
    
    # Mock set validation code and expiry
    code = 568392
    expiration_time = datetime.now() + timedelta(minutes=10)
    user.set_validation_code(code, expiration_time)
    db.session.add(user)
    db.session.commit()

    # Not enough data
    rsp = client.post('/api/user/invalid@mail.com/verify_email', json={})
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Missing parameters' in rsp["data"]

    # Invalid email
    rsp = client.post('/api/user/invalid@mail.com/verify_email', json={'code': 999})
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert 'User does not exist!' in rsp["data"]

    # Invalid code
    rsp = client.post(f'/api/user/{user.email}/verify_email', json={'code': 999})
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Invalid validation code' in rsp["data"]

    # Past expiration time
    previous_time = user.validation_code_expiration
    # Change expiration to be 11 minutes ago
    user.validation_code_expiration = datetime.now() - timedelta(minutes=11)
    db.session.commit()

    rsp = client.post(f'/api/user/{user.email}/verify_email', json={'code': user.validation_code})
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert 'Validation code has expired' in rsp["data"]

    user.validation_code_expiration = previous_time # restore
    db.session.commit()

    # Valid request
    rsp = client.post(f'/api/user/{user.email}/verify_email', json={'code': user.validation_code})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert 'User email verified successfully!' in rsp["data"]