import bcrypt
from flask import Blueprint, jsonify, request

from src.db import db
from src.models import User
from .errors import ErrorRsp

user_api_bp = Blueprint('user_api', __name__)

VALID_EMAIL_DOMAINS = ["@mail.utoronto.ca", "@utoronto.ca"]

@user_api_bp.route('/registerUser', methods=['POST'])
def register():
    data = request.json

    # Encrypt password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data['password'], salt)
    
    # Validate email
    if data['email'] not in VALID_EMAIL_DOMAINS:
        return jsonify({"status": ErrorRsp.ERR_PARAM,
                        "message": "Email must be a valid UofT email'!"}), 400

    # Check if role specified is Buyer or Seller
    if data['role'] not in [User.UserRole.BUYER.value, User.UserRole.SELLER.value]:
        return jsonify({"status": ErrorRsp.ERR_PARAM,
                        "message": "Role must be 'buyer' or 'seller'!"}), 400

    user = User(
        username=data['username'],
        password=hashed_password,
        email=data['email'],
        role=data['role']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"status": ErrorRsp.OK,
                    "message": "User registered successfully!"}), 201
