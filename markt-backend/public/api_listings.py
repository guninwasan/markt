from flask import Blueprint, jsonify, request
from flasgger import Swagger, swag_from
from marshmallow import ValidationError

from database.db import db
from database.models import Listing, User
from utils.errors import ErrorRsp
from schemas.listing_schema import ListingInformationSchema, ListingUpdate, ListingGetSchema, ListingDeleteSchema

listing_api_bp = Blueprint('listing_api', __name__)
swagger = Swagger()

"""
    Endpoint: Creating listings
    Route: 'api/listing/create'
"""
@listing_api_bp.route('/create', methods=['POST'])
@swag_from('../docs/listing_docs.yml', endpoint='create')
def create():
    data = request.get_json()
    schema = ListingInformationSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing or invalid parameters",
                        "errors": err.messages}), 400

    # Check if user exists
    user = User.query.filter_by(email=data['owner_email']).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    # Create listing
    listing = Listing(
        # backend fields
        owner_id=user.id,
        sold=False,

        # essential fields
        title=data['title'],
        description=data['description'],
        price=data['price'],
        display_image=data['display_image'],

        # optional fields
        negotiable=data.get('negotiable', False),
        condition=data.get('condition', ""),
        flairs=data.get('flairs', []),
        media=data.get('media', []),
        brand=data.get('brand', ""),
        model=data.get('model', ""),
        year_of_manufacture=data.get('yearOfManufacture'),
        color=data.get('color', ""),
        dimensions=data.get('dimensions', ""),
        weight=data.get('weight', ""),
        material=data.get('material', ""),
        battery_life=data.get('batteryLife', ""),
        storage_capacity=data.get('storageCapacity', ""),
        additional_features=data.get('additionalFeatures', ""),
        additional_details=data.get('additionalDetails', "")
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
@swag_from('../docs/listing_docs.yml', endpoint='get')
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
@swag_from('../docs/listing_docs.yml', endpoint='get_all')
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
    rsp = [listing.get_json_min() if data['minimal'] else listing.get_json_full() for listing in listings]

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": rsp}), 200

"""
    Endpoint: Update a listing
    Route: 'api/listing/update/<int:id>/'
"""
@listing_api_bp.route('/update/<int:id>/', methods=['PUT'])
@swag_from('../docs/listing_docs.yml', endpoint='update')
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

    # Update fields
    for field in data:
        setattr(listing, field, data[field])

    db.session.commit()
    return jsonify({"status": ErrorRsp.OK.value,
                    "data": listing.get_json_full()}), 200

"""
    Endpoint: Delete a listing
    Route: 'api/listing/delete/<int:id>/'
"""
@listing_api_bp.route('/delete/<int:id>/', methods=['DELETE'])
@swag_from('../docs/listing_docs.yml', endpoint='delete')
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
    
    # Check authorization to delete
    if listing.owner.email != data['user_email']:
        return jsonify({
            "status": ErrorRsp.ERR_NOT_ALLOWED.value,
            "data": "You are not authorized to delete this listing."
        }), 403

    db.session.delete(listing)
    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "Listing deleted successfully"}), 200
