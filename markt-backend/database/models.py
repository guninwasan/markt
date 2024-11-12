import bcrypt
import pytz
import re
from .db import db
from enum import Enum
from sqlalchemy.dialects.postgresql import JSON
from datetime import datetime

import uuid

def generate_api_key():
    return str(uuid.uuid4())

# Association table - manage buyers interested in listings
user_listing_interest_table = db.Table('user_listing_interest',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('listing_id', db.Integer, db.ForeignKey('listings.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    password_encryp = db.Column(db.String(1000), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    email_verified = db.Column(db.Boolean, nullable=True)

    # Email validation
    validation_code = db.Column(db.Integer, nullable=True)
    validation_code_expiration = db.Column(db.DateTime, nullable=True)
    email_verified = db.Column(db.Boolean, nullable=False, default=False)

    class ForgetPasswordState(Enum):
        Unset = 0,
        CodeSent = 1,
        CodeVerified = 2
    forget_pwd = db.Column(db.Enum(ForgetPasswordState), nullable=False, default=ForgetPasswordState.Unset)

    total_ratings = db.Column(db.Float, default=0.0)
    number_of_ratings = db.Column(db.Integer, default=0)

    # Relationships
    # User's active listings that have not been sold
    listings_not_sold = db.relationship('Listing', back_populates='owner',
                                        primaryjoin="and_(User.id == Listing.owner_id, Listing.sold == False)",
                                        lazy='dynamic')
    # Listings of products bought by User
    listings_bought = db.relationship('Listing', back_populates='buyer',
                                      foreign_keys='Listing.buyer_id', lazy='dynamic')
    # User's inactive listings that have already been sold
    listings_sold = db.relationship('Listing', primaryjoin="and_(User.id == Listing.owner_id, Listing.sold == True)",
                                    lazy='dynamic', overlaps="listings_not_sold")
    # Listings that the User is interested in
    listings_of_interest = db.relationship('Listing', secondary=user_listing_interest_table,
                                           back_populates='interested_buyers', lazy='dynamic')

    api_keys = db.relationship('ApiKey', back_populates='user', lazy='dynamic')

    def __init__(self, full_name, password, email, phone, email_verified=False):
        # Data Validation
        if not self.validate_email_format(email):
            raise ValueError("Email must be a valid UofT email")
        if not self.validate_phone_format(phone):
            raise ValueError("Phone number must not contain letters or special characters")
        if not self.validate_password_format(password):
            raise ValueError("Password must contain at minimum 8 characters, \
                             1 lowercase and uppercase letter, 1 digit, 1 special character")

        self.full_name = full_name
        self.email = email
        self.phone = phone
        self.set_password(password) # Encrypt password
        self.email_verified = email_verified

    """
    Password Helpers
    """
    @classmethod
    def validate_password_format(self, password):
        #   - Minimum 8 characters
        #   - At least one lowercase letter
        #   - At least one uppercase letter
        #   - At least one digit
        #   - At least one special character
        if (len(password) < 8 or
            not re.search(r"[A-Z]", password) or
            not re.search(r"[a-z]", password) or
            not re.search(r"[0-9]", password) or
            not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)
        ):
            return False
        return True

    def set_password(self, password):
        passwordHash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.password_encryp = passwordHash.decode('utf-8')

    def check_password(self, password):
        # Convert the stored hash back to bytes
        return bcrypt.checkpw(password.encode('utf-8'), self.password_encryp.encode('utf-8'))

    """
    Email Helpers
    """
    @classmethod
    def validate_email_format(self, email):
        if ("@utoronto.ca" not in email) and (".utoronto.ca" not in email):
            return False
        return True
    
    def set_validation_code(self, code, expiry):
        self.validation_code = code
        self.validation_code_expiration = expiry

    """
    Phone Helpers
    """
    @classmethod
    def validate_phone_format(self, phone):
        PHONE_REGEX = re.compile(r"^\+?[1-9]\d{1,14}$")
        if not bool(PHONE_REGEX.match(str(phone))):
            return False
        return True

    """
    Rating Helpers
    """
    @classmethod
    def validate_rating_range(self, rating):
        if 0 <= rating <= 5:
            return True
        return False

    def update_total_rating(self, new_rating):
        if self.validate_rating_range(new_rating):
            self.total_ratings += new_rating
            self.number_of_ratings += 1
        else:
            raise ValueError("Rating must be between 0 and 5")

    def get_average_rating(self):
        if self.number_of_ratings == 0:
            return 0
        return round(self.total_ratings / self.number_of_ratings, 2)

    """
    JSON helpers
    """
    def get_json(self):
        return {
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "rating": self.get_average_rating()
        }


class Listing(db.Model):
    __tablename__ = 'listings'

    # Backend Specifications
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    sold = db.Column(db.Boolean, default=False)
    datetime_created = db.Column(db.DateTime, default=((datetime.now(pytz.timezone('America/Toronto'))).strftime("%d/%m/%Y %H:%M:%S")), nullable=False)

    # Essential Details
    title = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    pickup_location = db.Column(db.String(100), nullable=False)
    display_image = db.Column(JSON, nullable=True)
    negotiable = db.Column(db.Boolean, default=False)
    condition = db.Column(db.String(50), nullable=True)
    flairs = db.Column(JSON, nullable=True)  # Store flairs as JSON array

    # Additional Media
    media = db.Column(JSON, nullable=True)  # Consolidates images and videos

    # Additional Specifications
    description = db.Column(db.Text, nullable=True)
    quantity = db.Column(db.Integer, nullable=True)
    brand = db.Column(db.String(50), nullable=True)
    model = db.Column(db.String(50), nullable=True)
    year_of_manufacture = db.Column(db.Integer, nullable=True)
    color = db.Column(db.String(25), nullable=True)
    dimensions = db.Column(db.String(50), nullable=True)
    weight = db.Column(db.String(10), nullable=True)
    material = db.Column(db.String(50), nullable=True)
    battery_life = db.Column(db.String(25), nullable=True)
    storage_capacity = db.Column(db.String(25), nullable=True)
    additional_details = db.Column(db.String(200), nullable=True)

    # Relationships
    owner = db.relationship('User', back_populates='listings_not_sold', foreign_keys=[owner_id], overlaps="listings_sold")
    buyer = db.relationship('User', back_populates='listings_bought', foreign_keys=[buyer_id])
    interested_buyers = db.relationship('User', secondary=user_listing_interest_table, back_populates='listings_of_interest')

    """
    JSON helpers
    """
    def get_json_full(self):
        return {
            "essential": self.get_json_min(),
            "database": {
                "id": self.id,
                "owner": self.owner.get_json(),
                "buyer": None if not self.buyer else self.buyer.get_json(),
                "sold": self.sold,
                "datetime_created": self.datetime_created,
            },
            "media": {
                "media_files": self.media if self.media else [],
            },
            "specifications": {
                "description": self.description,
                "quantity": self.quantity,
                "brand": self.brand,
                "model": self.model,
                "year_of_manufacture": self.year_of_manufacture,
                "color": self.color,
                "dimensions": self.dimensions,
                "weight": self.weight,
                "material": self.material,
                "battery_life": self.battery_life,
                "storage_capacity": self.storage_capacity,
                "additional_details": self.additional_details,
            },
        }

    def get_json_min(self):
        return {
            "id": self.id,
            "title": self.title,
            "price": self.price,
            "pickup_location": self.pickup_location,
            "display_image": self.display_image,
            "flairs": {
                "negotiable": self.negotiable,
                "condition": self.condition,
                "flairs": self.flairs,
            },
            "owner_rating": self.owner.get_average_rating()
        }

class ApiKey(db.Model):
    __tablename__ = 'api_keys'

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(64), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='api_keys')

    def __init__(self, user_id):
        self.user_id = user_id
        self.key = generate_api_key()  # Use the generate_api_key function to create a new key