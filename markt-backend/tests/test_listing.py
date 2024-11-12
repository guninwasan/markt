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
        "used": True,
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
        "used": True,
        "owner_email": "invalid@gmail.com"
    }
    rsp = client.post('/api/listing/create', json=invalid_user)
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_FOUND.value
    assert rsp['data'] == "User does not exist!"

    # User is not verified
    invalid_user = {
        "title": "Math Textbook",
        "description": "A great MAT188 textbook",
        "price": 38,
        "pickup_location": "UofT Mississauga",
        "display_image": "temp_url.png",
        "quantity": 1,
        "used": True,
        "owner_email": test_user.email
    }
    rsp = client.post('/api/listing/create', json=invalid_user)
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
    data = {
        "title": "Math Textbook",
        "description": "A great MAT188 textbook",
        "price": 100,
        "pickup_location": "UofT Mississauga",
        "display_image": "temp_url.png",
        "quantity": 1,
        "used": True,
        "owner_email": test_user.email
    }
    rsp = client.post('/api/listing/create', json=data)
    assert rsp.status_code == 201
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert rsp['data']['database']['id'] is not None
    assert rsp['data']["essential"]['title'] == data['title']
    assert rsp['data']['database']['sold'] == False # check default value

    # Check if listing is in User's listing_not_sold list
    listing_id = rsp['data']['database']['id']
    assert test_user.listings_not_sold.filter_by(id=listing_id).first() is not None

    # Check if test_user is listing's owner
    listing_owner_email = rsp['data']['database']['owner']['email']
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
        pickup_location="UofT Mississauga",
        display_image="temp_url.png",
        quantity=1,
        owner_id=test_user.id
    )
    db.session.add(listing)
    db.session.commit()

    # Invalid listing ID
    rsp = client.get(f'/api/listing/get/{999}/', json={})
    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_FOUND.value
    assert rsp['data'] == "Listing does not exist!"

    # Valid request
    rsp = client.get(f'/api/listing/get/{listing.id}/', json={'minimal': False})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert rsp['data']['essential']['title'] == "Used Laptop"
    assert 'rating' in rsp['data']['database']['owner']
    assert rsp['data']['database']['owner']['rating'] is not None

def test_get_all_listings(client):
    # empty database
    rsp = client.get('/api/listing/all', json={})
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
        price=100, pickup_location="UofT Mississauga",
        display_image="temp_url.png", owner_id=test_user.id)
    listing2 = Listing(title="Item 2", description="test description",
        price=500, pickup_location="UofT Mississauga",
        display_image="temp_url.png", owner_id=test_user.id)

    db.session.add(listing1)
    db.session.add(listing2)
    db.session.commit()

    # Get listings
    rsp = client.get('/api/listing/all', json={'minimal': False})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert len(rsp['data']) == 2
    assert rsp['data'][0]['essential']['title'] == "Item 1"
    assert rsp['data'][1]['essential']['title'] == "Item 2"
    for listing in rsp['data']:
        assert 'rating' in listing['database']['owner']
        assert listing['database']['owner']['rating'] is not None

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
        pickup_location="UofT Mississauga",
        display_image="temp_url.png",
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
    assert rsp['data']['essential']['title'] == update_data["title"]

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
        pickup_location="UofT Mississauga",
        display_image="temp_url.png",
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
    assert rsp['data']['database']['sold'] == True and listing.sold == True
    assert (rsp['data']['database']['buyer']['email'] == test_buyer.email and
            listing.buyer.email == test_buyer.email)
    # Check if listing is in Buyer's listings_bought list
    listing_id = rsp['data']['database']['id']
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
        pickup_location="UofT Mississauga",
        display_image="temp_url.png",
        owner_id=test_user.id
    )
    db.session.add(listing)
    db.session.commit()

    # Wrong listing id
    rsp = client.delete(f'/api/listing/delete/{9999}/', json={"user_email": "test@utoronto.ca"})

    assert rsp.status_code == 404
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_FOUND.value
    assert rsp['data'] == "Listing does not exist!"

    rsp = client.delete(f'/api/listing/delete/{listing.id}/', json={"user_email": "not_test@utoronto.ca"})
    assert rsp.status_code == 403  # Assuming 403 Forbidden for unauthorized action
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.ERR_NOT_ALLOWED.value
    assert rsp['data'] == "You are not authorized to delete this listing."

    # Correct listing id
    rsp = client.delete(f'/api/listing/delete/{listing.id}/', json={"user_email": "test@utoronto.ca"})
    assert rsp.status_code == 200
    rsp = rsp.get_json()
    assert rsp['status'] == ErrorRsp.OK.value
    assert rsp['data'] == "Listing deleted successfully"

    # Make sure the listing is deleted
    listing_in_db = db.session.get(Listing, listing.id)
    assert listing_in_db is None

# --- Search API Tests ---
def test_search_by_query(client):
    # Create a test user
    test_user = User(full_name="Test User", password="abC$9082$9082", email="test@utoronto.ca", phone="6478290835")
    db.session.add(test_user)
    db.session.commit()

    # Create mock listings
    listings = [
        Listing(title="Red Chair", description="A comfy red chair", price=150, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Blue Chair", description="A large blue sofa", price=450, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Green Chair", description="A modern green chair", price=100, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Wooden Table", description="A rustic wooden table", price=200, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id)
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
        Listing(title="Red Chair", description="A comfy red chair", price=150, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Blue Sofa", description="A large blue sofa", price=450, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id)
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
        Listing(title="Red Chair", description="A comfy red chair", price=150, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Blue Sofa", description="A large blue sofa", price=450, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Green Chair", description="A modern green chair", price=100, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Wooden Table", description="A rustic wooden table", price=200, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id)
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
        Listing(title="Red Chair", description="A comfy red chair", price=150, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Blue Sofa", description="A large blue sofa", price=450, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Green Chair", description="A modern green chair", price=100, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Wooden Table", description="A rustic wooden table", price=200, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id)
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
        Listing(title="Red Chair", description="A comfy red chair", price=150, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Blue Chair", description="A large blue sofa", price=450, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Green Chair", description="A modern green chair", price=100, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id),
        Listing(title="Wooden Table", description="A rustic wooden table", price=200, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user.id)
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

def test_search_top_rated(client):
    # Create test users with different ratings
    test_user_1 = User(full_name="Test User 1", password="abC$9082$9082", email="test1@utoronto.ca", phone="6478290835")
    test_user_2 = User(full_name="Test User 2", password="abC$9082$9082", email="test2@utoronto.ca", phone="6478290836")
    db.session.add(test_user_1)
    db.session.add(test_user_2)
    db.session.commit()

    # Create mock listings with different seller ratings
    listing_1 = Listing(title="Red Chair", description="A comfy red chair", price=150, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user_1.id)
    listing_2 = Listing(title="Blue Sofa", description="A large blue sofa", price=450, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user_2.id)
    listing_3 = Listing(title="Green Chair", description="A modern green chair", price=100, pickup_location="UofT Mississauga", display_image="temp_url.png", owner_id=test_user_1.id)
    
    # Set ratings for users
    test_user_1.update_total_rating(4.5)  # Rating for Test User 1
    test_user_2.update_total_rating(3.0)  # Rating for Test User 2
    
    db.session.add_all([listing_1, listing_2, listing_3])
    db.session.commit()

    # Search for 'chair' and sort by 'top_rated' filter
    rsp = client.get('/api/listing/search?query=chair&filter=top_rated&page=1&page_size=3')
    
    assert rsp.status_code == 200
    rsp_json = rsp.get_json()
    assert rsp_json['status'] == ErrorRsp.OK.value
    assert len(rsp_json['data']) == 2

    # Verify listings are sorted by seller rating in descending order
    seller_ratings = [listing['owner_rating'] for listing in rsp_json['data']]
    assert seller_ratings == sorted(seller_ratings, reverse=True)  # Ratings should be sorted from high to low