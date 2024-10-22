from flask import Blueprint, jsonify, request
from flasgger import Swagger, swag_from
from marshmallow import ValidationError

from database.db import db
from database.models import Listing, User
from utils.errors import ErrorRsp
from schemas.listing_schema import ListingInformationSchema

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
    user = db.session.get(User, data['seller_id'])
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
        seller_id=data['seller_id']
    )
    db.session.add(listing)
    db.session.commit()
    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "Listing created successfully!"}), 201

"""
    Endpoint: Retrieve listings
    Route: 'api/listing/get/<int:id>/'
"""
@listing_api_bp.route('/get/<int:id>/', methods=['GET'])
# Endpoint parameter specification
@swag_from('../docs/listing_docs.yml', endpoint='listing_by_id')
# API implementation
def get(id):
    # Check if listing exists
    listing = db.session.get(Listing, id)
    if listing is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "Listing does not exist!"}), 404

    # Make listing JSON response
    rsp = {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "price": listing.price,
        "quantity": listing.quantity,
        "sold": listing.sold,
        "condition": listing.condition,
        "seller": {
            "id": listing.owner.id,
            "username": listing.owner.username,
            "email": listing.owner.email
        }
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
        rsp.append({
            "id": listing.id,
            "title": listing.title,
            "description": listing.description,
            "price": listing.price,
            "quantity": listing.quantity,
            "condition": listing.condition,
            "sold": listing.sold,
            "seller": {
                "id": listing.owner.id,
                "username": listing.owner.username,
                "email": listing.owner.email
            }
        })

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": rsp}), 200

"""
    Endpoint: Update a listing
    Route: 'api/listing/update/<int:id>/'
"""
@listing_api_bp.route('/update/<int:id>/', methods=['PUT'])
# Endpoint parameter specification
@swag_from('../docs/listing_docs.yml', endpoint='listing_by_id')
# API implementation
def update(id):
    data = request.get_json()

    # Check if listing exists
    listing = db.session.get(Listing, id)
    if listing is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "Listing does not exist!"}), 404

    if 'title'in data:
        listing.title = data['title']
    if 'description'in data:
        listing.title = data['description']
    if 'price'in data:
        listing.title = data['price']
    if 'quantity'in data:
        listing.title = data['quantity']
    if 'condition'in data:
        listing.title = data['condition']
    if 'sold'in data:
        listing.title = data['sold']
    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "Listing updated successfully"}), 200

"""
    Endpoint: Delete a listing
    Route: 'api/listing/delete/<int:id>/'
"""
@listing_api_bp.route('/delete/<int:id>/', methods=['DELETE'])
# Endpoint parameter specification
@swag_from('../docs/listing_docs.yml', endpoint='listing_by_id')
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
