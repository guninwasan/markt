import re
from flask import Blueprint, jsonify, request
from flasgger import Swagger, swag_from
from marshmallow import ValidationError

from database.db import db
from database.models import Listing, User
from utils.errors import ErrorRsp
from schemas.listing_schema import ListingInformationSchema, ListingUpdate

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
        title=data['title'],
        description=data['description'],
        price=data['price'],
        quantity=data['quantity'],
        sold=data['sold'],
        condition=data['condition'],
        owner_id=user.id
    )
    db.session.add(listing)
    db.session.commit()

    rsp = {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "price": listing.price,
        "quantity": listing.quantity,
        "sold": listing.sold,
        "condition": listing.condition,
        "owner": {
            "full_name": listing.owner.full_name,
            "email": listing.owner.email,
            "phone": listing.owner.phone
        }
    }

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": rsp}), 201

"""
    Endpoint: Retrieve listings
    Route: 'api/listing/get/<int:id>/'
"""
@listing_api_bp.route('/get/<int:id>/', methods=['GET'])
# Endpoint parameter specification
@swag_from('../docs/listing_docs.yml', endpoint='get')
# API implementation
def get(id):
    # Check if listing exists
    listing = db.session.get(Listing, id)
    if listing is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "Listing does not exist!"}), 404

    buyer_rsp = None
    if listing.buyer:
        buyer_rsp = {
            "full_name": listing.buyer.full_name,
            "email": listing.buyer.email,
            "phone": listing.buyer.phone
        }

    # Make listing JSON response
    rsp = {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "price": listing.price,
        "quantity": listing.quantity,
        "sold": listing.sold,
        "condition": listing.condition,
        "owner": {
            "full_name": listing.owner.full_name,
            "email": listing.owner.email,
            "phone": listing.owner.phone,
            "rating": listing.owner.get_average_rating()
        },
        "buyer": buyer_rsp
    }
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
    # Get all listings
    listings = Listing.query.all()
    # Make listing JSON response
    rsp = []
    for listing in listings:
        buyer_rsp = None
        if listing.buyer:
            buyer_rsp = {
                "full_name": listing.buyer.full_name,
                "email": listing.buyer.email,
                "phone": listing.buyer.phone
            }

        rsp.append({
            "id": listing.id,
            "title": listing.title,
            "description": listing.description,
            "price": listing.price,
            "quantity": listing.quantity,
            "condition": listing.condition,
            "sold": listing.sold,
            "owner": {
                "full_name": listing.owner.full_name,
                "email": listing.owner.email,
                "phone": listing.owner.phone,
                "rating": listing.owner.get_average_rating()
            },
            "buyer": buyer_rsp
        })

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

    buyer_rsp = None
    if 'title'in data:
        listing.title = str(data['title'])

    if 'description'in data:
        listing.description = data['description']

    if 'price'in data:
        listing.price = data['price']

    if 'quantity'in data:
        listing.quantity = data['quantity']

    if 'condition'in data:
        listing.condition = data['condition']

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

    db.session.commit()

    if listing.buyer:
        buyer_rsp = {
            "full_name": listing.buyer.full_name,
            "email": listing.buyer.email,
            "phone": listing.buyer.phone,
        }

    rsp = {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "price": listing.price,
        "quantity": listing.quantity,
        "condition": listing.condition,
        "sold": listing.sold,
        "buyer": buyer_rsp
    }

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": rsp}), 200

"""
    Endpoint: Delete a listing
    Route: 'api/listing/delete/<int:id>/'
"""
@listing_api_bp.route('/delete/<int:id>/', methods=['DELETE'])
# Endpoint parameter specification
@swag_from('../docs/listing_docs.yml', endpoint='delete')
# API implementation
def delete(id):
    # Check if listing exists
    listing = db.session.get(Listing, id)
    if listing is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "Listing does not exist!"}), 404

    db.session.delete(listing)
    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "Listing deleted successfully"}), 200

@listing_api_bp.route('/search', methods=['GET'])
@swag_from('../docs/listing_docs.yml', endpoint='search')
def search():
    query = request.args.get('query', '').strip()
    filter_type = request.args.get('filter', 'price_low')
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))

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

    # Filter listings by query if provided, and ensure it's checked only in title or description
    listings_query = Listing.query
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
        rsp.append({
            "id": listing.id,
            "title": listing.title,
            "description": listing.description,
            "price": listing.price,
            "quantity": listing.quantity,
            "condition": listing.condition,
            "sold": listing.sold,
            "seller": {
                "phone": listing.owner.phone,
                "email": listing.owner.email,
                "rating": listing.owner.get_average_rating()
            }
        })

    return jsonify({
        "status": ErrorRsp.OK.value,
        "data": rsp,
        "total_listings": total_listings,
        "total_pages": total_pages,
        "current_page": page
    }), 200
