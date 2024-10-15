from flask import Blueprint, jsonify, request

from src.db import db
from src.models import User
from .errors import ErrorRsp

user_api_bp = Blueprint('user_api', __name__)

@user_api_bp.route('/register_user', methods=['POST'])
def register():
    data = request.get_json()

    # Check if user already exists
    user = User.query.filter_by(username=data['username']).first()
    if user is not None:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "message": "User already exists!"}), 400
    
    # Validate email
    if ("@mail.utoronto.ca" not in data['email']) and ("@utoronto.ca" not in data['email']):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "message": "Email must be a valid UofT email!"}), 400

    # Check if role specified is Buyer or Seller
    if data['role'] not in [User.UserRole.BUYER.value, User.UserRole.SELLER.value]:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "message": "Role must be 'buyer' or 'seller'!"}), 400

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
                    "message": "User registered successfully!"}), 201

@user_api_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Check if user exists
    user = User.query.filter_by(username=data['username']).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "message": "User does not exist!"}), 404

    # Validate user's password
    if not user.validate_password(data['password']):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "message": "Incorrect password!"}), 401
    
    return jsonify({"status": ErrorRsp.OK.value,
                    "message": "User logged in successfully!"}), 200
