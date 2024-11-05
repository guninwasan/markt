import re
from flask import Blueprint, jsonify, request
from flasgger import Swagger, swag_from
from marshmallow import ValidationError

from database.db import db
from database.models import User
from utils.errors import ErrorRsp
from schemas.user_schema import UserRegistrationSchema, UserLoginSchema, UserUpdateSchema

user_api_bp = Blueprint('user_api', __name__)
swagger = Swagger()

"""
    Endpoint: Registering users
    Route: 'api/user/register'
"""
@user_api_bp.route('/register', methods=['POST'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='register')
# API implementation
def register():
    data = request.get_json()
    schema = UserRegistrationSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if user already exists
    user = User.query.filter_by(email=data['email']).first()
    if user is not None:
        return jsonify({"status": ErrorRsp.ERR_PARAM_DUP.value,
                        "data": "User already exists!"}), 400

    # Store all validation errors
    validation_errors = []

    # Validate email
    if not User.validate_email_format(data["email"]):
        validation_errors.append("Email must be a valid UofT email!")

    # Validate phone number
    if not User.validate_phone_format(data["phone"]):
        validation_errors.append("Phone number must be of valid format: 123-456-7890, (123) 456-7890, or +1-123-456-7890")

    # Validate password
    if not User.validate_password_format(data["password"]):
        validation_errors.append("Password must contain at minimum 8 characters, 1 lowercase and uppercase letter, 1 digit, 1 special character")

    # Return validation errors if any
    if len(validation_errors):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": validation_errors}), 400

    user = User(
        full_name=data["full_name"],
        password=data['password'],
        email=data['email'],
        phone=data['phone'],
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "User registered successfully!"}), 201


"""
    Endpoint: Logging in users
    Route: 'api/user/login'
"""
@user_api_bp.route('/login', methods=['POST'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='login')
# API implementation
def login():
    data = request.get_json()
    schema = UserLoginSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if user exists
    user = User.query.filter_by(email=data['email']).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    # Validate user's password
    if not user.check_password(data['password']):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Incorrect password!"}), 401

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "User logged in successfully!"}), 200


"""
    Endpoint: Updating user details
    Route: 'api/user/update'
"""
@user_api_bp.route('/update', methods=['POST'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='update')
# API implementation
def update():
    data = request.get_json()
    schema = UserUpdateSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if user exists
    user = User.query.filter_by(email=data['verification_email']).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    # Store all validation errors
    validation_errors = []

    # If password is changed, set the API rsp
    rsp_password = "Not updated"

    if 'new_full_name'in data:
        user.full_name = data['new_full_name']

    if 'new_email'in data:
        # Validate email
        if not user.validate_email_format(data["new_email"]):
            validation_errors.append("Email must be a valid UofT email!")
        else:
            user.email = data['new_email']

    if 'new_phone'in data:
        # Validate phone number
        if not user.validate_phone_format(data["new_phone"]):
            validation_errors.append("Phone number must be of valid format: 123-456-7890, \
                                     (123) 456-7890, or +1-123-456-7890")
        else:
            user.phone = data['new_phone']

    if 'new_password' in data:
        # Validate password
        if not user.validate_password_format(data["new_password"]):
            validation_errors.append("Password must contain at minimum 8 characters, \
                                     1 lowercase and uppercase letter, 1 digit, 1 special character")
        else:
            user.set_password(data['new_password'])
            rsp_password = "Updated"

    if "new_rating" in data:
        # Validate rating
        if not user.validate_rating_range(data["new_rating"]):
            validation_errors.append("Rating must be between 0 and 5")
        else:
            user.update_total_rating(data["new_rating"])

    # Return validation errors if any
    if len(validation_errors):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": validation_errors}), 400

    # Sanity check for password since it is not secure to send the updated password
    # in the API rsp
    if 'new_password' in data and not user.check_password(data['new_password']):
        return jsonify({"status": ErrorRsp.ERR.value,
                        "data": "User data not updated"}), 400

    # If no errors, commit changes
    db.session.commit()

    rsp = {
        "full_name": user.full_name,
        "password": rsp_password, # string indicating whether or not password was updated
        "email": user.email,
        "phone": user.phone,
        "rating": user.get_average_rating()
    }

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": rsp}), 200
