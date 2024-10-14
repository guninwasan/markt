from flask import Blueprint, jsonify, request

from src.db import db
from src.models import User
from .errors import ErrorRsp

user_api_bp = Blueprint('user_api', __name__)

@user_api_bp.route('/registerUser', methods=['POST'])
def register():
    data = request.json
    
    # Validate email
    if data['email'] not in ["@mail.utoronto.ca", "@utoronto.ca"]:
        return jsonify({"status": ErrorRsp.ERR_PARAM,
                        "message": "Email must be a valid UofT email!"}), 400

    # Check if role specified is Buyer or Seller
    if data['role'] not in [User.UserRole.BUYER.value, User.UserRole.SELLER.value]:
        return jsonify({"status": ErrorRsp.ERR_PARAM,
                        "message": "Role must be 'buyer' or 'seller'!"}), 400

    user = User(
        username=data['username'],
        password=data['password'],
        email=data['email'],
        role=data['role']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"status": ErrorRsp.OK,
                    "message": "User registered successfully!"}), 201

@user_api_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    # Check if user exists
    user = User.query.filter_by(username=data['username']).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND,
                        "message": "User does not exist"}), 404

    # Validate user's password
    if not user.validate_password(data['password']):
        return jsonify({"status": ErrorRsp.ERR_PARAM,
                        "message": "User does not exist"}), 401
    
    return jsonify({"status": ErrorRsp.OK,
                    "message": "User logged in successfully!"}), 201
