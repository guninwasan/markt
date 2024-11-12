from flask import Blueprint, jsonify, request
from flasgger import Swagger, swag_from
from marshmallow import ValidationError

from database.db import db
from database.models import Listing, User
from utils.errors import ErrorRsp
from schemas.listing_schema import ListingInformationSchema, ListingUpdate, ListingGetSchema, ListingDeleteSchema
from utils.auth import api_key_required


listing_api_bp = Blueprint('listing_api', __name__)
swagger = Swagger()

"""
    Endpoint: Creating listings // add a security key authetication here 
    Route: 'api/listing/create'
"""
@listing_api_bp.route('/create', methods=['POST'])
@api_key_required
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

    # Check if user exists and email is verified
    user = User.query.filter_by(email=data['owner_email']).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404
    if not user.email_verified:
        return jsonify({"status": ErrorRsp.ERR.value,
                        "data": "User email has not been verified"}), 400

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
        negotiable=data.get('negotiable', False),
        condition=data.get('condition', None),
        flairs=data.get('flairs', []),

        # media
        media=data.get('media', []),

        # additional
        description=data.get('description', None),
        quantity=data.get('quantity', None),
        brand=data.get('brand', None),
        model=data.get('model', None),
        year_of_manufacture=data.get('year_of_manufacture', None),
        color=data.get('color', None),
        dimensions=data.get('dimensions', None),
        weight=data.get('weight', None),
        material=data.get('material', None),
        battery_life=data.get('battery_life', None),
        storage_capacity=data.get('storage_capacity', None),
        additional_details=data.get('additional_details', None),
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
        if data['sold'] == False and listing.sold == True:
            return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                            "data": "Cannot mark listing as unsold, it has been sold already"}), 400

        buyer = User.query.filter_by(email=data['buyer_email']).first()
        if buyer is None:
            return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                            "data": "Buyer does not exist!"}), 404

        # Sanity check: Does listing already have a buyer
        if listing.buyer is not None:
            return jsonify({"status": ErrorRsp.ERR_NOT_ALLOWED.value,
                            "data": "Listing already has a buyer"}), 405
        
        # Owner cannot be buyer
        if data['buyer_email'] == listing.owner.email:
            return jsonify({"status": ErrorRsp.ERR_PARAM_EMAIL.value,
                            "data": "Listing owner cannot be the buyer"}), 400

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
    if 'title' in data:
        listing.title = data.get('title', listing.title)
    if 'price' in data:
        listing.price = data.get('price', listing.price)
    if 'pickup_location' in data:
        listing.pickup_location = data.get('pickup_location', listing.pickup_location)
    if 'display_image' in data:
        listing.display_image = data.get('display_image', listing.display_image)
    if 'negotiable' in data:
        listing.negotiable = data.get('negotiable', listing.negotiable)
    if 'condition' in data:
        listing.condition = data.get('condition', listing.condition)
    if 'flairs' in data:
        listing.flairs = data.get('flairs', listing.flairs)

    # Media
    if 'media' in data:
        listing.media = data.get('media', listing.media)

    # Additional
    if 'description' in data:
        listing.description = data.get('description', listing.description)
    if 'quantity' in data:
        listing.quantity = data.get('quantity', listing.quantity)
    if 'brand' in data:
        listing.brand = data.get('brand', listing.brand)
    if 'model' in data:
        listing.model = data.get('model', listing.model)
    if 'year_of_manufacture' in data:
        listing.year_of_manufacture = data.get('year_of_manufacture', listing.year_of_manufacture)
    if 'color' in data:
        listing.color = data.get('color', listing.color)
    if 'dimensions' in data:
        listing.dimensions = data.get('dimensions', listing.dimensions)
    if 'weight' in data:
        listing.weight = data.get('weight', listing.weight)
    if 'material' in data:
        listing.material = data.get('material', listing.material)
    if 'battery_life' in data:
        listing.battery_life = data.get('battery_life', listing.battery_life)
    if 'storage_capacity' in data:
        listing.storage_capacity = data.get('storage_capacity', listing.storage_capacity)
    if 'additional_details' in data:
        listing.additional_details = data.get('additional_details', listing.additional_details)    

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
    schema = ListingDeleteSchema()

    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({
            "status": ErrorRsp.ERR_PARAM.value,
            "data": "Invalid parameters",
            "errors": err.messages
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

    # Set sorting conditions
    sort_condition = {
        'price_high': Listing.price.desc(),
        'price_low': Listing.price.asc()
    }.get(filter_type, Listing.price.asc())

    # Filter listings based on search criteria
    listings_query = Listing.query
    if not deep_search:
        listings_query = listings_query.filter(Listing.title.ilike(f"%{query}%"))
    else:
        listings_query = listings_query.filter(
            (Listing.title.ilike(f"%{query}%")) | 
            (Listing.description.ilike(f"%{query}%"))
        )

    # Apply sorting and pagination
    listings = (listings_query
                .order_by(sort_condition)
                .offset((page - 1) * page_size)
                .limit(page_size)
                .all())

    # Total listings count for pagination
    total_listings = listings_query.count()
    total_pages = (total_listings + page_size - 1) // page_size

    # Sorting by seller rating (if applicable)
    listings = sorted(listings, key=lambda listing: listing.owner.get_average_rating(), reverse=True)

    rsp = [listing.get_json_min() for listing in listings]

    return jsonify({
        "status": ErrorRsp.OK.value,
        "data": rsp,
        "total_listings": total_listings,
        "total_pages": total_pages,
        "current_page": page
    }), 200

