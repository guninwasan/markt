import pytest

from utils.errors import ErrorRsp
from public import create_app_api
from database.db import db
from database.models import Listing, User

@pytest.fixture
def client():
    app = create_app_api(testing=True)

    with app.app_context():
        db.create_all()  # setup
        yield app.test_client()  # tests run here
        db.session.remove()  # Clear session to prevent dirty reads
        db.drop_all()  # teardown

def test_create_listing(client):
    # Create a test user
    test_user = User(full_name="Test User", password="abC$9082$9082",
                     email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    # Not enough parameters
    incomplete_data = {
        "title": "Math Textbook",
        "condition": "used",
        "owner_email": test_user.email
    }
    rsp = client.post('/api/listing/create', json=incomplete_data)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_PARAM.value
    assert rsp['data'] == "Missing parameters"

    # User does not exist
    invalid_user = {
        "title": "Math Textbook",
        "description": "A great MAT188 textbook",
        "price": 100,
        "pickup_location": "UofT Mississauga",
        "display_image": "temp_url.png",
        "quantity": 1,
        "condition": "used",
        "owner_email": "invalid@gmail.com"
    }
    rsp = client.post('/api/listing/create', json=invalid_user)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_FOUND.value
    assert rsp['data'] == "User does not exist!"

    # User email not verified
    unverified_user_data = {
        "title": "Math Textbook",
        "description": "A great MAT188 textbook",
        "price": 38,
        "pickup_location": "UofT Mississauga",
        "display_image": "temp_url.png",
        "quantity": 1,
        "condition": "used",
        "owner_email": test_user.email
    }
    rsp = client.post('/api/listing/create', json=unverified_user_data)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR.value
    assert "User email has not been verified" in rsp["data"]

    # Set user as verified and re-test
    test_user.email_verified = True
    db.session.commit()

    # Invalid price
    invalid_price_data = {
        "title": "Math Textbook",
        "description": "A great MAT188 textbook",
        "price": 38,
        "pickup_location": "UofT Mississauga",
        "display_image": "temp_url.png",
        "quantity": 1,
        "condition": "used",
        "owner_email": test_user.email
    }
    rsp = client.post('/api/listing/create', json=invalid_price_data)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR.value
    assert "User email has not been verified" in rsp["data"]
    # set user verified
    test_user.email_verified = True
    db.session.commit()

    # Invalid price
    invalid_price = {
        "title": "Math Textbook",
        "description": "A great MAT188 textbook",
        "price": -4848,
        "pickup_location": "UofT Mississauga",
        "display_image": "temp_url.png",
        "quantity": 1,
        "used": True,
        "owner_email": test_user.email
    }
    rsp = client.post('/api/listing/create', json=invalid_price)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_PARAM.value

    # Valid listing
    valid_data = {
        "title": "Math Textbook",
        "description": "A great MAT188 textbook",
        "price": 100,
        "pickup_location": "UofT Mississauga",
        "display_image": "temp_url.png",
        "quantity": 1,
        "condition": "used",
        "owner_email": test_user.email
    }
    rsp = client.post('/api/listing/create', json=valid_data)
    assert rsp.status_code == 201
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert rsp['data']['database']['id'] is not None
    assert rsp['data']["essential"]['title'] == valid_data['title']
    assert rsp['data']['database']['sold'] == False  # check default value

    # Check if listing is in User's listing_not_sold list
    listing_id = rsp['data']['database']['id']
    assert test_user.listings_not_sold.filter_by(id=listing_id).first() is not None

    # Check if test_user is listing's owner
    listing_owner_email = rsp['data']['database']['owner']['email']
    assert test_user.email == listing_owner_email

def test_get_listing(client):
    # Create a verified user
    test_user = User(full_name="Test User", password="abC$9082$9082",
                     email="test@utoronto.ca", phone="6478290835", email_verified=True)
    db.session.add(test_user)
    db.session.commit()

    # Create a listing
    listing = Listing(
        title="Used Laptop",
        description="A second-hand laptop",
        price=300,
        pickup_location="UofT Mississauga",
        display_image="temp_url.png",
        quantity=1,
        owner_id=test_user.id
    )
    db.session.add(listing)
    db.session.commit()

    # Valid request
    rsp = client.get(f'/api/listing/get/{listing.id}/', json={'minimal': False})
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['status'] == ErrorRsp.OK.value
    assert rsp_json['data']['essential']['title'] == "Used Laptop"
    assert 'rating' in rsp_json['data']['database']['owner']

def test_get_all_listings(client):
    # Create a verified user and listings
    test_user = User(full_name="Test User", password="abC$9082",
                     email="test@utoronto.ca", phone="6478290835", email_verified=True)
    db.session.add(test_user)
    db.session.commit()

    # Create two listings
    listing1 = Listing(
        title="Item 1", description="test description",
        price=100, pickup_location="UofT Mississauga",
        display_image="temp_url.png", owner_id=test_user.id)
    listing2 = Listing(
        title="Item 2", description="test description",
        price=500, pickup_location="UofT Mississauga",
        display_image="temp_url.png", owner_id=test_user.id)
    db.session.add_all([listing1, listing2])
    db.session.commit()

    rsp = client.get('/api/listing/all', json={'minimal': False})
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['status'] == ErrorRsp.OK.value
    assert len(rsp_json['data']) == 2

def test_update_listing(client):
    # Create a verified user
    test_user = User(full_name="Test User", password="abC$9082",
                     email="test@utoronto.ca", phone="6478290835")
    test_user.email_verified = True
    db.session.add(test_user)
    db.session.commit()

    # Create a test listing
    listing = Listing(
        title="Old Laptop",
        description="Old Laptop",
        price=400,
        pickup_location="UofT Mississauga",
        display_image="temp_url.png",
        owner_id=test_user.id
    )
    db.session.add(listing)
    db.session.commit()

    update_data = {
        "title": "New Laptop",
        "quantity": 2
    }
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=update_data)
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['data']['essential']['title'] == "New Laptop"

def test_sell_listing(client):
    # Create a verified user and buyer
    test_user = User(full_name="Test User", password="abC$9082",
                     email="test@utoronto.ca", phone="6478290835")
    test_user.email_verified = True

    test_buyer = User(full_name="Buyer User", password="Buyer$9082",
                      email="buyer@utoronto.ca", phone="6478880835")
    test_buyer.email_verified = True
    
    db.session.add_all([test_user, test_buyer])
    db.session.commit()

    # Create a test listing
    listing = Listing(
        title="Old Laptop",
        description="Old Laptop",
        price=400,
        pickup_location="UofT Mississauga",
        display_image="temp_url.png",
        owner_id=test_user.id
    )
    db.session.add(listing)
    db.session.commit()

    update_data_valid = {
        "sold": True,
        "buyer_email": test_buyer.email,
    }
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=update_data_valid)
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['data']['database']['sold'] == True
    assert rsp_json['data']['database']['buyer']['email'] == test_buyer.email

def test_delete_listing(client):
    # Create a verified user
    test_user = User(full_name="Test User", password="abC$9082",
                     email="test@utoronto.ca", phone="6478290835")
    test_user.email_verified = True
    db.session.add(test_user)
    db.session.commit()

    # Create a listing
    listing = Listing(
        title="Delete Me",
        description="Delete this item",
        price=100,
        pickup_location="UofT Mississauga",
        display_image="temp_url.png",
        owner_id=test_user.id
    )
    db.session.add(listing)
    db.session.commit()

    rsp = client.delete(f'/api/listing/delete/{listing.id}/', json={"user_email": test_user.email})
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['data'] == "Listing deleted successfully"

def test_search_by_query(client):
    # Create a verified user and listings
    test_user = User(full_name="Test User", password="abC$9082$9082", email="test@utoronto.ca", phone="6478290835", email_verified=True)
    db.session.add(test_user)
    db.session.commit()

    listings = [
        Listing(title="Red Chair", description="A comfy red chair", price=150, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Blue Chair", description="A large blue chair", price=450, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id)
    ]
    db.session.add_all(listings)
    db.session.commit()

    rsp = client.get('/api/listing/search?query=chair&filter=price_low&page=1&page_size=2')
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert len(rsp_json['data']) == 2

def test_search_top_rated(client):
    # Create verified users with ratings
    test_user_1 = User(full_name="Test User 1", password="abC$9082$9082", email="test1@utoronto.ca", phone="6478290835", email_verified=True)
    test_user_2 = User(full_name="Test User 2", password="abC$9082$9082", email="test2@utoronto.ca", phone="6478290836", email_verified=True)
    db.session.add_all([test_user_1, test_user_2])
    db.session.commit()

    listing_1 = Listing(title="Red Chair", description="A comfy red chair", price=150, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user_1.id)
    listing_2 = Listing(title="Blue Sofa", description="A large blue sofa", price=450, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user_2.id)
    db.session.add_all([listing_1, listing_2])
    db.session.commit()

    # Update user ratings
    test_user_1.update_total_rating(4.5)
    test_user_2.update_total_rating(3.0)
    db.session.commit()

    rsp = client.get('/api/listing/search?query=chair&filter=top_rated&page=1&page_size=2')
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    seller_ratings = [listing['owner_rating'] for listing in rsp_json['data']]
    assert seller_ratings == sorted(seller_ratings, reverse=True)
