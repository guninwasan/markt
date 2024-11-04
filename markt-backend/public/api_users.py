import re
from flask import Blueprint, jsonify, request
from flasgger import Swagger, swag_from
from marshmallow import ValidationError

from database.db import db
from database.models import User
from utils.errors import ErrorRsp
from schemas.user_schema import UserRegistrationSchema, UserLoginSchema

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
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "User already exists!"}), 400

    # Store all validation errors
    validation_errors = []

    # Validate email
    if ("@mail.utoronto.ca" not in data['email']) and ("@utoronto.ca" not in data['email']):
        validation_errors.append("Email must be a valid UofT email!")

    # Validate phone number:
    #   - 123-456-7890, (123) 456-7890, or +1-123-456-7890
    PHONE_REGEX = re.compile(r"^\+?[1-9]\d{1,14}$")
    if not bool(PHONE_REGEX.match(str(data['phone']))):
        validation_errors.append("Phone number must be of valid format: 123-456-7890, (123) 456-7890, or +1-123-456-7890")

    # Validate password:
    #   - Minimum 8 characters
    #   - At least one lowercase letter
    #   - At least one uppercase letter
    #   - At least one digit
    #   - At least one special character
    password = data['password']
    if (len(password) < 8 or
        not re.search(r"[A-Z]", password) or
        not re.search(r"[a-z]", password) or
        not re.search(r"[0-9]", password) or
        not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)
    ):
        validation_errors.append("Password must contain at minimum 8 characters, 1 lowercase and uppercase letter, 1 digit, 1 special character")

    # Return validation errors if any
    if len(validation_errors):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": validation_errors}), 400

    user = User(
        utorid=data['utorid'],
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
    if not user.validate_password(data['password']):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Incorrect password!"}), 401

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "User logged in successfully!"}), 200
