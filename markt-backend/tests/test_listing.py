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
    assert rsp['data'] == "Listing created successfully!"

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

def test_buy_item(client):
    # Create test users
    test_seller = User(full_name="Test User", password="ab1C#34c",
                       email="test@utoronto.ca", phone="6478290835")

    test_buyer = User(full_name="Test User", password="09uhD$sk",
                      email="hello@utoronto.ca", phone="4167892038")
    db.session.add(test_seller)
    db.session.add(test_buyer)
    db.session.commit()

    # Create a test listing
    listing = Listing(
        title="Old Laptop",
        description="Old Laptop",
        price=400,
        quantity=1,
        condition="used",
        owner_id=test_seller.id
    )
    db.session.add(listing)
    db.session.commit()

    # Invalid buyer
    invalid_buyer = {
        "buyer_email": "invalid@utoronto.ca",
        "sold": True
    }
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=invalid_buyer)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_FOUND.value
    assert rsp['data'] == "User does not exist!"

    # Test_buyer
    buy_data = {
        "buyer_email": test_buyer.email,
        "sold": True
    }
    rsp = client.put(f'/api/listing/update/{listing.id}/', json=buy_data)
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert rsp['data']['sold'] == True
    assert test_buyer.listings_bought[0].id == listing.id

# --- Search API Tests ---
def test_search_by_query(client):
    # Create a test user
    test_user = User(full_name="Test User", password="abC$9082$9082", email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    # Create mock listings
    listings = [
        Listing(title="Red Chair", description="A comfy red chair", price=150, quantity=5, condition="new", owner_id=test_user.id),
        Listing(title="Blue Chair", description="A large blue sofa", price=450, quantity=2, condition="used", owner_id=test_user.id),
        Listing(title="Green Chair", description="A modern green chair", price=100, quantity=8, condition="new", owner_id=test_user.id),
        Listing(title="Wooden Table", description="A rustic wooden table", price=200, quantity=10, condition="used", owner_id=test_user.id)
    ]
    db.session.add_all(listings)
    db.session.commit()

    # Search for 'chair'
    rsp = client.get('/api/listing/search?query=chair&filter=price_low&page=1&page_size=3')
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['status'] == ErrorRsp.OK.value
    assert len(rsp_json['data']) == 3  # Should return 3 listings, check if search logic works

def test_search_by_invalid_query(client):
    # Create a test user and listings
    test_user = User(full_name="Test User", password="abC$9082$9082",
                     email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    listings = [
        Listing(title="Red Chair", description="A comfy red chair", price=150, quantity=5, condition="new", owner_id=test_user.id),
        Listing(title="Blue Sofa", description="A large blue sofa", price=450, quantity=2, condition="used", owner_id=test_user.id)
    ]
    db.session.add_all(listings)
    db.session.commit()

    # Search for 'laptop' (should return no results)
    rsp = client.get('/api/listing/search?query=laptop&filter=price_low&page=1&page_size=2')
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['status'] == ErrorRsp.OK.value
    assert len(rsp_json['data']) == 0  # No listings should match

def test_search_by_price_low(client):
    # Create a test user and listings
    test_user = User(full_name="Test User", password="abC$9082$9082",
                     email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    listings = [
        Listing(title="Red Chair", description="A comfy red chair", price=150, quantity=5, condition="new", owner_id=test_user.id),
        Listing(title="Blue Sofa", description="A large blue sofa", price=450, quantity=2, condition="used", owner_id=test_user.id),
        Listing(title="Green Chair", description="A modern green chair", price=100, quantity=8, condition="new", owner_id=test_user.id),
        Listing(title="Wooden Table", description="A rustic wooden table", price=200, quantity=10, condition="used", owner_id=test_user.id)
    ]
    db.session.add_all(listings)
    db.session.commit()

    # Search and sort by 'price_low'
    rsp = client.get('/api/listing/search?query=chair&filter=price_low&page=1&page_size=3')
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['status'] == ErrorRsp.OK.value
    assert rsp_json['data'][0]['price'] == 100  # Green Chair should be first as it's the cheapest

def test_search_by_price_high(client):
    # Create a test user and listings
    test_user = User(full_name="Test User", password="abC$9082$9082",
                     email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    listings = [
        Listing(title="Red Chair", description="A comfy red chair", price=150, quantity=5, condition="new", owner_id=test_user.id),
        Listing(title="Blue Sofa", description="A large blue sofa", price=450, quantity=2, condition="used", owner_id=test_user.id),
        Listing(title="Green Chair", description="A modern green chair", price=100, quantity=8, condition="new", owner_id=test_user.id),
        Listing(title="Wooden Table", description="A rustic wooden table", price=200, quantity=10, condition="used", owner_id=test_user.id)
    ]
    db.session.add_all(listings)
    db.session.commit()

    # Search and sort by 'price_high'
    rsp = client.get('/api/listing/search?query=chair&filter=price_high&page=1&page_size=3')
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['status'] == ErrorRsp.OK.value
    assert rsp_json['data'][0]['price'] == 150  # Red Chair should be the most expensive chair

def test_search_pagination(client):
    # Create a test user and listings
    test_user = User(full_name="Test User", password="abC$9082$9082", email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    listings = [
        Listing(title="Red Chair", description="A comfy red chair", price=150, quantity=5, condition="new", owner_id=test_user.id),
        Listing(title="Blue Chair", description="A large blue sofa", price=450, quantity=2, condition="used", owner_id=test_user.id),
        Listing(title="Green Chair", description="A modern green chair", price=100, quantity=8, condition="new", owner_id=test_user.id),
        Listing(title="Wooden Table", description="A rustic wooden table", price=200, quantity=10, condition="used", owner_id=test_user.id)
    ]
    db.session.add_all(listings)
    db.session.commit()

    # Search and paginate results
    rsp = client.get('/api/listing/search?query=chair&filter=price_low&page=1&page_size=2')
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['status'] == ErrorRsp.OK.value
    assert len(rsp_json['data']) == 2  # Only two items should be returned on page 1

    rsp = client.get('/api/listing/search?query=chair&filter=price_low&page=2&page_size=2')
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['status'] == ErrorRsp.OK.value
    assert len(rsp_json['data']) == 1  # Only one item should be returned on page 2 (Green Chair)
