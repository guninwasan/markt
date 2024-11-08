import pytest

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
        "phone": "1234567890",
        "password": "mY8iwp@ssword"
    }
    rsp = client.post(f'/api/user/{user.email}/update', json=update_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert update_data["email"] == rsp["data"]["email"]
    assert update_data["full_name"] == rsp["data"]["full_name"]
    assert update_data["phone"] == rsp["data"]["phone"]
    assert "Updated" == rsp["data"]["password"]

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

def test_add_interest(client):
    # Create test users
    test_user = User(full_name="Test User", password="abC$9082",
                     email="test@utoronto.ca", phone="6478290835")
    test_buyer = User(full_name="I am Buyer", password="adddbC$9082",
                     email="test_buyer@utoronto.ca", phone="6478220835")
    interested_user = User(full_name="Interested User", password="adddbC$9082",
                     email="interested_user@utoronto.ca", phone="6478220835")
    db.session.add(test_user)
    db.session.add(test_buyer)
    db.session.add(interested_user)
    db.session.commit()

    # Create a test listing
    listing_1 = Listing(
        title="Old Laptop",
        description="Old Laptop",
        price=400,
        quantity=1,
        condition="used",
        owner_id=test_user.id
    )
    listing_2 = Listing(
        title="Old Calculator",
        description="Old Calculator",
        price=20,
        quantity=2,
        condition="used",
        owner_id=test_user.id
    )
    db.session.add(listing_1)
    db.session.add(listing_2)
    db.session.commit()

    # Send empty request
    listings = { 'listing_ids': [] }
    rsp = client.post(f'/api/user/{test_buyer.email}/add_interest/', json=listings)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert "No listings provided, nothing changed." == rsp["data"]

    # Invalid email
    listings = { 'listing_ids': [listing_2.id] }
    invalid_email = "invalid@utoronto.ca"
    rsp = client.post(f'/api/user/{invalid_email}/add_interest/', json=listings)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_NOT_FOUND.value == rsp["status"]
    assert "User does not exist!" == rsp["data"]

    # Owner marks as interested
    listings = { 'listing_ids': [listing_1.id] }
    rsp = client.post(f'/api/user/{test_user.email}/add_interest/', json=listings)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert ErrorRsp.ERR_PARAM.value == rsp["status"]
    assert str(listing_1.id) in rsp["data"]

    # Both users interested in both listings
    listings = { 'listing_ids': [listing_1.id, listing_2.id] }
    rsp = client.post(f'/api/user/{test_buyer.email}/add_interest/', json=listings)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert "Listings added successfully!" == rsp["data"]
    assert (listing_1 in test_buyer.listings_of_interest.all() and
            listing_2 in test_buyer.listings_of_interest.all())

    rsp = client.post(f'/api/user/{interested_user.email}/add_interest/', json=listings)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]
    assert "Listings added successfully!" == rsp["data"]
    assert (listing_1 in interested_user.listings_of_interest.all() and
            listing_2 in interested_user.listings_of_interest.all())

    # Listing 1 is sold
    selling_data = {
        "sold": True,
        "buyer_email": test_buyer.email
    }
    rsp = client.put(f'/api/listing/update/{listing_1.id}/', json=selling_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert ErrorRsp.OK.value == rsp["status"]

    # Make sure the listing is in the correct lists
    assert (listing_1 not in interested_user.listings_of_interest.all() and
            listing_2 in interested_user.listings_of_interest.all())

    assert (listing_1 in test_buyer.listings_bought.all() and
            listing_2 in test_buyer.listings_of_interest.all())

    assert (listing_1 in test_user.listings_sold.all() and
            listing_1 not in test_user.listings_not_sold.all())

def test_get_info(client):
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