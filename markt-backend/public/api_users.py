import random
import pytz
from flask import Blueprint, jsonify, request, render_template
from flasgger import Swagger, swag_from
from flask_mail import Message
from marshmallow import ValidationError
from datetime import datetime, timedelta
from database.db import db
from database.models import User, Listing, ApiKey
from utils.errors import ErrorRsp
from schemas.user_schema import (
    UserRegistrationSchema,
    UserVerifyEmailSchema,
    UserLoginSchema,
    UserUpdateSchema,
    AddInterestSchema,
    UserChangePasswordSchema,
    UserForgotPasswordSchema,
    GetListingsSchema,
    UserSendCodeSchema)

from . import mail

user_api_bp = Blueprint('user_api', __name__, template_folder='templates')
swagger = Swagger()

@user_api_bp.route('/register', methods=['POST'])
@swag_from('../docs/user_docs.yml', endpoint='register')
def register():
    data = request.get_json()
    schema = UserRegistrationSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({
            "status": ErrorRsp.ERR_PARAM.value,
            "data": "Missing parameters",
            "errors": err.messages
        }), 400

    # Check if user already exists
    user = User.query.filter_by(email=data['email']).first()
    if user is not None:
        return jsonify({
            "status": ErrorRsp.ERR_PARAM_DUP.value,
            "data": "User already exists!"
        }), 400

    # Store all validation errors
    validation_errors = []

    # Validate email
    if not User.validate_email_format(data["email"]):
        validation_errors.append("Email must be a valid UofT email!")

    # Validate phone number
    if not User.validate_phone_format(data["phone"]):
        validation_errors.append("Phone number must be of valid format.")

    # Validate password
    if not User.validate_password_format(data["password"]):
        validation_errors.append(
            "Password must contain at minimum 8 characters, 1 lowercase and uppercase letter, 1 digit, 1 special character"
        )

    # Return validation errors if any
    if validation_errors:
        return jsonify({
            "status": ErrorRsp.ERR_PARAM.value,
            "data": validation_errors
        }), 400

    # Create a new user
    user = User(
        full_name=data["full_name"],
        password=data['password'],
        email=data['email'],
        phone=data['phone']
    )

    # Get validation code
    # code = format(random.randint(0,999999), "06d")
    # expiration_time = datetime.now(pytz.timezone('America/Toronto')) + timedelta(minutes=10)
    # user.set_validation_code(code, expiration_time)

    db.session.add(user)
    db.session.commit()
     # Generate and assign API key for the user
    api_key = ApiKey(user_id=user.id)
    db.session.add(api_key)
    db.session.commit()

    # email_message = Message(
    #     'Email Verification Code',
    #     recipients=[user.email]
    # )
    # email_content = render_template('email.html',
    #                           user_name=user.full_name,
    #                           validation_code=code,
    #                           current_year=datetime.now().year)

    # email_message.html = email_content

    try:
        # mail.send(email_message)

        return jsonify({"status": ErrorRsp.OK.value,
                        "data": "User registered"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": ErrorRsp.ERR.value,
                        "data": "Error"}), 500


"""
    Endpoint: Send verification code to email
    Route: 'api/user/<string:email>/send_code'
"""
@user_api_bp.route('/<string:email>/send_code', methods=['POST'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='send_code')
# API implementation
def send_code(email):
    data = request.get_json()
    schema = UserSendCodeSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    # Check if user already verified
    if user.email_verified and not data['for_forget_pwd']:
        return jsonify({"status": ErrorRsp.OK.value,
                        "data": "User email is already verified!"}), 200
    
    # Get validation code
    code = format(random.randint(0,999999), "06d")
    expiration_time = datetime.now(pytz.timezone('America/Toronto')) + timedelta(minutes=10)
    user.set_validation_code(code, expiration_time)
    db.session.commit()

    email_message = Message(
        'Email Verification Code',
        recipients=[email]
    )
    email_content = render_template('email.html',
                              user_name=user.full_name,
                              validation_code=code,
                              current_year=datetime.now().year)

    email_message.html = email_content

    try:
        mail.send(email_message)

        if data['for_forget_pwd']:
            user.forget_pwd = User.ForgetPasswordState.CodeSent
            db.session.commit()

        return jsonify({"status": ErrorRsp.OK.value,
                        "data": "Verification code sent to user's email"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": ErrorRsp.ERR.value,
                        "data": "Error"}), 500

"""
    Endpoint: Verifying user email
    Route: 'api/user/<string:email>/verify_email'
"""
@user_api_bp.route('/<string:email>/verify_email', methods=['POST'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='verify_email')
# API implementation
def verify_email(email):
    data = request.get_json()
    schema = UserVerifyEmailSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    if (user.validation_code is None or
        (data['for_forget_pwd'] and user.forget_pwd != User.ForgetPasswordState.CodeSent)):
            return jsonify({"status": ErrorRsp.ERR.value,
                            "data": "Email verification code has not been sent"}), 400

    if int(user.validation_code) != int(data['code']):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Invalid validation code"}), 400

    if user.validation_code_expiration < datetime.now():
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Validation code has expired"}), 400

    # Mark user as verified
    user.email_verified = True
    if data['for_forget_pwd']:
        user.forget_pwd = User.ForgetPasswordState.CodeVerified
    user.validation_code = None
    user.validation_code_expiration = None
    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "User email verified successfully!"}), 200

@user_api_bp.route('/login', methods=['POST'])
@swag_from('../docs/user_docs.yml', endpoint='login')
def login():
    data = request.get_json()
    schema = UserLoginSchema()

    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({
            "status": ErrorRsp.ERR_PARAM.value,
            "data": "Missing parameters",
            "errors": err.messages
        }), 400

    # Check if user exists
    user = User.query.filter_by(email=data['email']).first()
    if user is None:
        return jsonify({
            "status": ErrorRsp.ERR_NOT_FOUND.value,
            "data": "User does not exist!"
        }), 404

    # Validate user's password
    if not user.check_password(data['password']):
        return jsonify({
            "status": ErrorRsp.ERR_PARAM.value,
            "data": "Incorrect password!"
        }), 401

    # Fetch the API key for the user (assuming one-to-one relationship)
    api_key = ApiKey.query.filter_by(user_id=user.id).first()
    if api_key is None:
        return jsonify({
            "status": ErrorRsp.ERR_NOT_FOUND.value,
            "data": "API key not found for user!"
        }), 404

    # Return successful login response with user info and API key
    return jsonify({
        "status": ErrorRsp.OK.value,
        "data": "User logged in successfully!",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "api_key": api_key.key  # API key associated with the user
        }
    }), 200

"""
    Endpoint: Updating user details
    Route: 'api/user/<string:email>/update'
"""
@user_api_bp.route('/<string:email>/update', methods=['POST'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='update')
# API implementation
def update(email):
    data = request.get_json()
    schema = UserUpdateSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    # Store all validation errors
    validation_errors = []

    if 'full_name'in data:
        user.full_name = data['full_name']

    if 'email'in data:
        # Validate email
        if not user.validate_email_format(data["email"]):
            validation_errors.append("Email must be a valid UofT email!")
        else:
            user.email = data['email']

    if 'phone'in data:
        # Validate phone number
        if not user.validate_phone_format(data["phone"]):
            validation_errors.append("Phone number must be of valid format: 123-456-7890, \
                                     (123) 456-7890, or +1-123-456-7890")
        else:
            user.phone = data['phone']

    if "rating" in data:
        # Validate rating
        if not user.validate_rating_range(data["rating"]):
            validation_errors.append("Rating must be between 0 and 5")
        else:
            user.update_total_rating(data["rating"])

    # Return validation errors if any
    if len(validation_errors):
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": validation_errors}), 400

    # If no errors, commit changes
    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": user.get_json()}), 200


"""
    Endpoint: Change User's password with current password for verification
    Route: 'api/user/<string:email>/change_password'
"""
@user_api_bp.route('/<string:email>/change_password', methods=['POST'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='change_password')
# API implementation
def change_password(email):
    data = request.get_json()
    schema = UserChangePasswordSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    # Store all validation errors
    validation_errors = []

    # Validate current password
    if not user.check_password(data["current_password"]):
        validation_errors.append("Current password is incorrect")

    # Validate new password format
    if not user.validate_password_format(data["new_password"]):
        validation_errors.append("New password must contain at minimum 8 characters, \
                                    1 lowercase and uppercase letter, 1 digit, 1 special character")

    # Return validation errors if any
    if len(validation_errors):
        return jsonify({"status": ErrorRsp.ERR_PARAM_PWD.value,
                        "data": validation_errors}), 400

    user.set_password(data["new_password"])
    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "Password changed successfully!"}), 200


"""
    Endpoint: Change User's password with email for verification
    Route: 'api/user/<string:email>/forgot_password'
"""
@user_api_bp.route('/<string:email>/forgot_password', methods=['POST'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='forgot_password')
# API implementation
def forgot_password(email):
    data = request.get_json()
    schema = UserForgotPasswordSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    # Make sure user is verified first
    if user.forget_pwd != User.ForgetPasswordState.CodeVerified:
        return jsonify({"status": ErrorRsp.ERR.value,
                        "data": "User email must be verified before resetting password"}), 400

    # Check new password format
    if not user.validate_password_format(data["new_password"]):
        return jsonify({"status": ErrorRsp.ERR_PARAM_PWD.value,
                        "data": "New password must contain at minimum 8 characters, \
                                1 lowercase and uppercase letter, 1 digit, 1 special character"}), 400

    user.set_password(data["new_password"])
    user.forget_pwd = User.ForgetPasswordState.Unset
    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "Password reset successfully!"}), 200


"""
    Endpoint: Add listings user is interested in
    Route: 'api/user/<string:email>/add_interest/'
"""
@user_api_bp.route('/<string:email>/add_interest/', methods=['POST'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='add_interest')
# API implementation
def interested_listings(email):
    data = request.get_json()
    schema = AddInterestSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    if not len(data['listing_ids']):
        return jsonify({"status": ErrorRsp.OK.value,
                        "data": "No listings provided, nothing changed."}), 200

    # Validate email
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    # Check if user email is verified
    if not user.email_verified:
        return jsonify({"status": ErrorRsp.ERR.value,
                        "data": "User email not verified yet"}), 400

    # Get all listings associated with the IDs in the request
    listings = Listing.query.filter(Listing.id.in_(data['listing_ids'])).all()

    for listing in listings:
        if listing.owner.email == email:
            return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                            "data": f"Cannot add listing to owner's interested list, id={listing.id}"}), 400

        # Add the listing to User's interested list if it is not sold and not already present
        if not listing.sold and not user.listings_of_interest.filter_by(id=listing.id).first():
            user.listings_of_interest.append(listing)

    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "Listings added successfully!"}), 200


"""
    Endpoint: Get user information
    Route: 'api/user/<string:email>/get_info'
"""
@user_api_bp.route('/<string:email>/get_info', methods=['GET'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='get_info')
# API implementation
def get_info(email):
    # Validate email
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": user.get_json()}), 200


"""
    Endpoint: Get user's saved listings
    Route: 'api/user/<string:email>/get_listings'
"""
@user_api_bp.route('/<string:email>/get_listings', methods=['GET'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='get_listings')
# API implementation
def get_listings(email):
    data = request.get_json()
    schema = GetListingsSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return jsonify({"status": ErrorRsp.ERR_PARAM.value,
                        "data": "Missing parameters",
                        "errors": err.messages}), 400

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404

    rsp = { "unsold_listings": [], "sold_listings": [],
            "interested_listings": [], "bought_listings": []}

    # Get minimum listing information for all
    if data["get_unsold"]:
        for listing in user.listings_not_sold.all():
            json = listing.get_json_min() if data["minimal"] else listing.get_json_full()
            rsp["unsold_listings"].append(json)

    if data["get_sold"]:
        for listing in user.listings_sold.all():
            json = listing.get_json_min() if data["minimal"] else listing.get_json_full()
            rsp["sold_listings"].append(json)

    if data["get_interested"]:
        for listing in user.listings_of_interest.all():
            json = listing.get_json_min() if data["minimal"] else listing.get_json_full()
            rsp["interested_listings"].append(json)

    if data["get_bought"]:
        for listing in user.listings_bought.all():
            json = listing.get_json_min() if data["minimal"] else listing.get_json_full()
            rsp["bought_listings"].append(json)

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": rsp}), 200


"""
    Endpoint: Delete a user
    Route: 'api/user/<string:email>/delete'
"""
@user_api_bp.route('/<string:email>/delete', methods=['DELETE'])
# Endpoint parameter specification
@swag_from('../docs/user_docs.yml', endpoint='delete')
# API implementation
def delete_user(email):
    # Validate email
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"status": ErrorRsp.ERR_NOT_FOUND.value,
                        "data": "User does not exist!"}), 404
    
    # Delete from the database
    db.session.delete(user)
    db.session.commit()

    return jsonify({"status": ErrorRsp.OK.value,
                    "data": "Deleted user successfully!"}), 200

@user_api_bp.route('/rate', methods=['POST'])
def rate_user():
    data = request.get_json()
    
    # Extract email and rating from the JSON request
    email = data.get('email')
    rating = data.get('rating')

    # Validate input
    if not email or not rating:
        return jsonify({"error": "Email and rating are required"}), 400
    if not isinstance(rating, (int, float)) or rating < 0 or rating > 5:
        return jsonify({"error": "Rating must be a number between 1 and 5"}), 400

    # Find the user by email
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update the user's total rating and count
    try:
        user.update_total_rating(rating)
        db.session.commit()
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # Return only a success status code without any JSON response
    return jsonify({
        "status": "success",
        "message": "Rating updated successfully",
        "status_code": 200
    }), 200