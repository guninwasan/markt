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
        "quantity": 1,
        "condition": "used",
        "owner_email": "invalid@gmail.com"
    }
    rsp = client.post('/api/listing/create', json=invalid_user)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_FOUND.value
    assert rsp['data'] == "User does not exist!"

    # Invalid price
    invalid_user = {
        "title": "Math Textbook",
        "description": "A great MAT188 textbook",
        "price": -4848,
        "quantity": 1,
        "condition": "used",
        "owner_email": test_user.email
    }
    rsp = client.post('/api/listing/create', json=invalid_user)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_PARAM.value

    # Valid listing
    data = {
        "title": "Math Textbook",
        "description": "A great MAT188 textbook",
        "price": 100,
        "quantity": 1,
        "condition": "used",
        "owner_email": test_user.email
    }
    rsp = client.post('/api/listing/create', json=data)
    assert rsp.status_code == 201
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert rsp['data']['id'] is not None
    assert rsp['data']['title'] == data['title']
    assert rsp['data']['sold'] == False # check default value

    # Check if listing is in User's listing_not_sold list
    listing_id = rsp['data']['id']
    assert test_user.listings_not_sold.filter_by(id=listing_id).first() is not None

    # Check if test_user is listing's owner
    listing_owner_email = rsp['data']['owner']['email']
    assert test_user.email == listing_owner_email

def test_get_listing(client):
    # Create a test user
    test_user = User(full_name="Test User", password="abC$9082$9082",
                     email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    # Create a listing
    listing = Listing(
        title="Used Laptop",
        description="A second-hand laptop",
        price=300,
        quantity=1,
        condition="used",
        owner_id=test_user.id
    )
    db.session.add(listing)
    db.session.commit()

    # Invalid listing ID
    rsp = client.get(f'/api/listing/get/{999}/')
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_FOUND.value
    assert rsp['data'] == "Listing does not exist!"

    # Valid request
    rsp = client.get(f'/api/listing/get/{listing.id}/')
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert rsp['data']['title'] == "Used Laptop"
    assert 'rating' in rsp['data']['owner']
    assert rsp['data']['owner']['rating'] is not None

def test_get_all_listings(client):
    # empty database
    rsp = client.get('/api/listing/all')
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert len(rsp['data']) == 0

    # Create a test user
    test_user = User(full_name="Test User", password="abC$9082",
                     email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    # Create 2 listings
    listing1 = Listing(
        title="Item 1", description="test description",
        price=100, quantity=1, condition="new", owner_id=test_user.id)
    listing2 = Listing(title="Item 2", description="test description",
        price=500, quantity=1, condition="old", owner_id=test_user.id)

    db.session.add(listing1)
    db.session.add(listing2)
    db.session.commit()

    # Get listings
    rsp = client.get('/api/listing/all')
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert len(rsp['data']) == 2
    assert rsp['data'][0]['title'] == "Item 1"
    assert rsp['data'][1]['title'] == "Item 2"
    for listing in rsp['data']:
        assert 'rating' in listing['owner']
        assert listing['owner']['rating'] is not None

def test_update_listing(client):
    # Create a test user
    test_user = User(full_name="Test User", password="abC$9082",
                     email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    # Create a test listing
    listing = Listing(
        title="Old Laptop",
        description="Old Laptop",
        price=400,
        quantity=1,
        condition="used",
        owner_id=test_user.id
    )
    db.session.add(listing)
    db.session.commit()

    # JSON request data
    update_data = {
        "title": "New Laptop",
        "quantity": "2"
    }

    # Wrong listing id
    rsp = client.put(f'/api/listing/update/{9999}/', json=update_data)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_FOUND.value
    assert rsp['data'] == "Listing does not exist!"

    # Correct listing id
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=update_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert rsp['data']['title'] == update_data["title"]

def test_sell_listing(client):
    # Create a test user
    test_user = User(full_name="Test User", password="abC$9082",
                     email="test@utoronto.ca", phone="6478290835")
    test_buyer = User(full_name="I am Buyer", password="adddbC$9082",
                     email="test_buyer@utoronto.ca", phone="6478220835")
    db.session.add(test_user)
    db.session.add(test_buyer)
    db.session.commit()

    # Create a test listing
    listing = Listing(
        title="Old Laptop",
        description="Old Laptop",
        price=400,
        quantity=1,
        condition="used",
        owner_id=test_user.id
    )
    db.session.add(listing)
    db.session.commit()

    # Invalid update listing: set sold, no buyer_email
    update_data_only_sold = {
        "sold": True,
    }
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=update_data_only_sold)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_PARAM_EMAIL.value
    assert listing.sold == False
    assert listing.buyer == None

    # Invalid update listing: no sold, set buyer_email
    update_data_only_email = {
        "buyer_email": test_buyer.email,
        "sold": False
    }
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=update_data_only_email)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_PARAM.value
    assert listing.sold == False
    assert listing.buyer == None

    # Invalid buyer email
    update_data_invalid_email = {
        "sold": True,
        "buyer_email": "invalid@utoronto.ca",
    }
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=update_data_invalid_email)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_FOUND.value
    assert listing.sold == False
    assert listing.buyer == None

    # Invalid buyer email same as owner email
    update_data_owner_email = {
        "sold": True,
        "buyer_email": test_user.email,
    }
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=update_data_owner_email)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_PARAM_EMAIL.value
    assert listing.sold == False
    assert listing.buyer == None

    # Valid data
    update_data_valid = {
        "sold": True,
        "buyer_email": test_buyer.email,
    }
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=update_data_valid)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert rsp['data']['sold'] == True and listing.sold == True
    assert (rsp['data']['buyer']['email'] == test_buyer.email and
            listing.buyer.email == test_buyer.email)
    # Check if listing is in Buyer's listings_bought list
    listing_id = rsp['data']['id']
    assert test_buyer.listings_bought.filter_by(id=listing_id).first() is not None
    assert test_buyer.listings_of_interest.filter_by(id=listing_id).first() is None
    # Check if listing is in Owner's listings_sold list
    assert test_user.listings_sold.filter_by(id=listing_id).first() is not None
    assert test_user.listings_not_sold.filter_by(id=listing_id).first() is None

    # Try to mark this listing as unsold now
    update_data_unsold = {
        "sold": False,
        "buyer_email": test_buyer.email,
    }
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=update_data_unsold)
    assert rsp.status_code == 400
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_PARAM.value
    assert listing.sold == True
    assert listing.buyer == test_buyer

def test_delete_listing(client):
    # Create a test user
    test_user = User(full_name="Test User", password="abC$9082",
                     email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    # Create a listing
    listing = Listing(
        title="Delete Me",
        description="Delete this item",
        price=100,
        quantity=1,
        condition="used",
        owner_id=test_user.id
    )
    db.session.add(listing)
    db.session.commit()

    # Wrong listing id
    rsp = client.delete(f'/api/listing/delete/{9999}/')

    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_FOUND.value
    assert rsp['data'] == "Listing does not exist!"

    # Correct listing id
    rsp = client.delete(f'/api/listing/delete/{listing.id}/')
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert rsp['data'] == "Listing deleted successfully"

    # Make sure the listing is deleted
    listing_in_db = db.session.get(Listing, listing.id)
    assert listing_in_db is None
