from flask import Blueprint, jsonify, request
from flasgger import Swagger, swag_from
from marshmallow import ValidationError

from database.db import db
from database.models import Listing, User
from utils.errors import ErrorRsp
from schemas.listing_schema import ListingInformationSchema, ListingUpdate, ListingGetSchema

listing_api_bp = Blueprint('listing_api', __name__)
swagger = Swagger()

"""
    Endpoint: Creating listings
    Route: 'api/listing/create'
"""
@listing_api_bp.route('/create', methods=['POST'])
# Endpoint parameter specification
@swag_from('../docs/listing_docs.yml', endpoint='create')
# API implementation
def create():
    data = request.get_json()
    schema = ListingInformationSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if user exists
    user = User.query.filter_by(email=data['owner_email']).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    # Create listing
    listing = Listing(
        # backend
        owner_id=user.id,
        sold=False,

        # essential
        title=data['title'],
        price=data['price'],
        pickup_location=data['pickup_location'],
        display_image=data['display_image'],
        price_negotiable=data['price_negotiable'],
        like_new=data['like_new'],
        used=data['used'],
        limited_edition=data['limited_edition'],
        popular=data['popular'],

        # media
        images=data['images'] if 'images' in data else None,
        videos=data['videos'] if 'videos' in data else None,

        # additional
        description=data['description'] if 'description' in data else None,
        quantity=data['quantity'] if 'quantity' in data else None,
        brand=data['brand'] if 'brand' in data else None,
        model=data['model'] if 'model' in data else None,
        year_of_manufacture=data['year_of_manufacture'] if 'year_of_manufacture' in data else None,
        color=data['color'] if 'color' in data else None,
        dimensions=data['dimensions'] if 'dimensions' in data else None,
        weight=data['weight'] if 'weight' in data else None,
        material=data['material'] if 'material' in data else None,
        battery_life=data['battery_life'] if 'battery_life' in data else None,
        storage_capacity=data['storage_capacity'] if 'storage_capacity' in data else None,
        additional_details=data['additional_details'] if 'additional_details' in data else None,
    )
    db.session.add(listing)
    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": listing.get_json_full()}), 201

"""
    Endpoint: Retrieve listings
    Route: 'api/listing/get/<int:id>/'
"""
@listing_api_bp.route('/get/<int:id>/', methods=['GET'])
# Endpoint parameter specification
@swag_from('../docs/listing_docs.yml', endpoint='get')
# API implementation
def get(id):
    data = request.get_json()
    schema = ListingGetSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if listing exists
    listing = db.session.get(Listing, id)
    if listing is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "Listing does not exist!"}), 404

    rsp = listing.get_json_min() if data['minimal'] else listing.get_json_full()
    return jsonify({"status": ErrorRsp.OK.value,
                    "data": rsp}), 200

"""
    Endpoint: Retrieve all listings
    Route: 'api/listing/all'
"""
@listing_api_bp.route('/all', methods=['GET'])
# Endpoint parameter specification
@swag_from('../docs/listing_docs.yml', endpoint='get_all')
# API implementation
def get_all():
    data = request.get_json()
    schema = ListingGetSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Get all listings
    listings = Listing.query.all()
    # Make listing JSON response
    rsp = []
    for listing in listings:
        json = listing.get_json_min() if data['minimal'] else listing.get_json_full()
        rsp.append(json)

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": rsp}), 200

"""
    Endpoint: Update a listing
    Route: 'api/listing/update/<int:id>/'
"""
@listing_api_bp.route('/update/<int:id>/', methods=['PUT'])
# Endpoint parameter specification
@swag_from('../docs/listing_docs.yml', endpoint='update')
# API implementation
def update(id):
    data = request.get_json()
    schema = ListingUpdate()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Invalid parameters",
                        "errors": err.messages}), 400

    # Check if listing exists
    listing = db.session.get(Listing, id)
    if listing is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "Listing does not exist!"}), 404

    # Backend
    # sold is always defaulted to False and is part of all requests
    if 'sold' in data and data['sold'] == True and 'buyer_email' not in data:
        # Need buyer_email to process the sold request
        return jsonify({"status": ErrorRsp.ERR_PARAM_EMAIL.value,
                        "data": "Buyer email is needed to mark listing as sold"}), 400

    if 'buyer_email' in data:
        if data['sold'] == False:
            # Do not allow marking listing as unsold if already sold
            if listing.sold == True:
                return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                                "data": "Cannot mark listing as unsold, it has been sold already"}), 400

            # Make sure sold is set to true in the request
            return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                            "data": "Request does not mark listing as sold, but provides buyer email"}), 400

        # Sanity check: Does listing already have a buyer
        if listing.buyer is not None:
            return jsonify({"status": ErrorRsp.ERR_NOT_ALLOWED.value,
                            "data": "Listing already has a buyer"}), 405

        # Check if buyer exists
        buyer = User.query.filter_by(email=data['buyer_email']).first()
        if buyer is None:
            return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                            "data": "Buyer does not exist!"}), 404

        # Owner cannot be buyer
        if data['buyer_email'] == listing.owner.email:
            return jsonify({"status": ErrorRsp.ERR_PARAM_EMAIL.value,
                            "data": "Listing owner cannot be buyer"}), 400

        # Update listing
        listing.buyer_id = buyer.id
        listing.sold = data['sold']

        # Update other user's interested lists
        all_interested = listing.interested_buyers
        for user in all_interested:
            try:
                user.listings_of_interest.remove(listing)
            except Exception as e:
                print(f"Error processing {user.email}: {e}")
        listing.interested_buyers.clear()

    # Essential
    if 'title'in data:
        listing.title = str(data['title'])
    if 'price'in data:
        listing.price = data['price']
    if 'pickup_location'in data:
        listing.pickup_location = data['pickup_location']
    if 'display_image'in data:
        listing.display_image = data['display_image']
    if 'price_negotiable'in data:
        listing.price_negotiable = data['price_negotiable']
    if 'like_new'in data:
        listing.like_new = data['like_new']
    if 'used'in data:
        listing.used = data['used']
    if 'limited_edition'in data:
        listing.limited_edition = data['limited_edition']
    if 'popular'in data:
        listing.popular = data['popular']

    # Media
    if 'images'in data:
        listing.images = data['images']
    if 'videos'in data:
        listing.videos = data['videos']

    # Additional
    if 'description'in data:
        listing.description = data['description']
    if 'quantity'in data:
        listing.quantity = data['quantity']
    if 'brand'in data:
        listing.brand = data['brand']
    if 'model'in data:
        listing.model = data['model']
    if 'year_of_manufacture'in data:
        listing.year_of_manufacture = data['year_of_manufacture']
    if 'color'in data:
        listing.color = data['color']
    if 'dimensions'in data:
        listing.dimensions = data['dimensions']
    if 'weight'in data:
        listing.weight = data['weight']
    if 'material'in data:
        listing.material = data['material']
    if 'battery_life'in data:
        listing.battery_life = data['battery_life']
    if 'storage_capacity'in data:
        listing.storage_capacity = data['storage_capacity']
    if 'additional_details'in data:
        listing.additional_details = data['additional_details']    

    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": listing.get_json_full()}), 200

"""
    Endpoint: Delete a listing
    Route: 'api/listing/delete/<int:id>/'
"""
@listing_api_bp.route('/delete/<int:id>/', methods=['DELETE'])
# Endpoint parameter specification
@swag_from('../docs/listing_docs.yml', endpoint='delete')
# API implementation
def delete(id):

    data = request.get_json()
    # Check if request includes the user's email
    if 'user_email' not in data:
        return jsonify({
            "status": ErrorRsp.ERR_PARAM.value,
            "data": "User email is required to delete a listing."
        }), 400
    
    # Check if listing exists
    listing = db.session.get(Listing, id)
    if listing is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "Listing does not exist!"}), 404
    
    # Check if the user trying to delete the listing is the owner
    if listing.owner.email != data['user_email']:
        return jsonify({
            "status": ErrorRsp.ERR_NOT_ALLOWED.value,
            "data": "You are not authorized to delete this listing."
        }), 403

    db.session.delete(listing)
    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "Listing deleted successfully"}), 200

"""
    Endpoint: Search listings
    Route: '/api/listing/search'
"""

@listing_api_bp.route('/search', methods=['GET'])
@swag_from('../docs/listing_docs.yml', endpoint='search')
def search():
    query = request.args.get('query', '').strip()
    filter_type = request.args.get('filter', 'price_low')
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))
    deep_search = request.args.get('deepSearch', 'true').lower() == 'true'  # New argument to control search type

    # Ensure that the query is not empty
    if not query:
        return jsonify({
            "status": ErrorRsp.ERR_PARAM.value,
            "data": "Query parameter is required"
        }), 400

    # Set sorting conditions (no rating included here, will handle it after fetching)
    sort_condition = {
        'price_high': Listing.price.desc(),
        'price_low': Listing.price.asc()
    }.get(filter_type, Listing.price.asc())  # Default sorting is price_low

    # Filter listings by query if provided, and ensure it's checked based on deepSearch
    listings_query = Listing.query
    if not deep_search:  # Only search by title if deepSearch is False
        listings_query = listings_query.filter(Listing.title.ilike(f"%{query}%"))
    else:  # Search both title and description if deepSearch is True
        listings_query = listings_query.filter(
            (Listing.title.ilike(f"%{query}%")) | 
            (Listing.description.ilike(f"%{query}%"))
        )

    # Apply sorting by price and pagination to fetch listings first
    listings = (listings_query
                .order_by(sort_condition)
                .offset((page - 1) * page_size)
                .limit(page_size)
                .all())

    # Total listings count for pagination
    total_listings = listings_query.count()
    total_pages = (total_listings + page_size - 1) // page_size

    # Now, sort listings based on the seller's rating (get_average_rating)
    listings = sorted(listings, key=lambda listing: listing.owner.get_average_rating(), reverse=True)

    # Build the response
    rsp = []
    for listing in listings:
        rsp.append(listing.get_json_min())

    return jsonify({
        "status": ErrorRsp.OK.value,
        "data": rsp,
        "total_listings": total_listings,
        "total_pages": total_pages,
        "current_page": page
    }), 200
