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
    user = User.query.filter_by(username=data['username']).first()
    if user is not None:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "User already exists!"}), 400
    
    # Validate email
    if ("@mail.utoronto.ca" not in data['email']) and ("@utoronto.ca" not in data['email']):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Email must be a valid UofT email!"}), 400

    # Check if role specified is Buyer or Seller
    if data['role'] not in [User.UserRole.BUYER.value, User.UserRole.SELLER.value]:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Role must be 'buyer' or 'seller'!"}), 400

    user_role = User.UserRole.BUYER if data['role'] == 'buyer' else User.UserRole.SELLER
    user = User(
        username=data['username'],
        password=data['password'],
        email=data['email'],
        role=user_role
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
    user = User.query.filter_by(username=data['username']).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    # Validate user's password
    if not user.validate_password(data['password']):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Incorrect password!"}), 401
    
    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "User logged in successfully!"}), 200
