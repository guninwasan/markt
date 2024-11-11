import bcrypt
import re
from .db import db
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import Date
from datetime import datetime

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

    total_ratings = db.Column(db.Float, default=0.0)
    number_of_ratings = db.Column(db.Integer, default=0)

    # Relationships
    listings_not_sold = db.relationship('Listing', back_populates='owner',
                                        primaryjoin="and_(User.id == Listing.owner_id, Listing.sold == False)",
                                        lazy='dynamic')
    listings_bought = db.relationship('Listing', back_populates='buyer', foreign_keys='Listing.buyer_id', lazy='dynamic')
    listings_sold = db.relationship('Listing', primaryjoin="and_(User.id == Listing.owner_id, Listing.sold == True)",
                                    lazy='dynamic', overlaps="listings_not_sold")
    listings_of_interest = db.relationship('Listing', secondary=user_listing_interest_table,
                                           back_populates='interested_buyers', lazy='dynamic')

    def __init__(self, full_name, password, email, phone):
        if not self.validate_email_format(email):
            raise ValueError("Email must be a valid UofT email")
        if not self.validate_phone_format(phone):
            raise ValueError("Phone number must not contain letters or special characters")
        if not self.validate_password_format(password):
            raise ValueError("Password must contain at minimum 8 characters, 1 lowercase and uppercase letter, 1 digit, 1 special character")

        self.full_name = full_name
        self.email = email
        self.phone = phone
        self.set_password(password)

    @classmethod
    def validate_password_format(self, password):
        if (len(password) < 8 or
            not re.search(r"[A-Z]", password) or
            not re.search(r"[a-z]", password) or
            not re.search(r"[0-9]", password) or
            not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)):
            return False
        return True

    def set_password(self, password):
        passwordHash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.password_encryp = passwordHash.decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_encryp.encode('utf-8'))

    @classmethod
    def validate_email_format(self, email):
        return ("@utoronto.ca" in email) or (".utoronto.ca" in email)

    @classmethod
    def validate_phone_format(self, phone):
        PHONE_REGEX = re.compile(r"^\+?[1-9]\d{1,14}$")
        return bool(PHONE_REGEX.match(str(phone)))

    def update_total_rating(self, new_rating):
        if 0 <= new_rating <= 5:
            self.total_ratings += new_rating
            self.number_of_ratings += 1
        else:
            raise ValueError("Rating must be between 0 and 5")

    def get_average_rating(self):
        return round(self.total_ratings / self.number_of_ratings, 2) if self.number_of_ratings else 0

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
    datetime_created = db.Column(Date, default=datetime.now(), nullable=False)

    # Essential Details
    title = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    display_image = db.Column(db.String, nullable=False)

    # Additional Specifications
    description = db.Column(db.Text, nullable=False)
    negotiable = db.Column(db.Boolean, default=False)
    condition = db.Column(db.String(50), nullable=True)
    flairs = db.Column(JSON, nullable=True)
    media = db.Column(JSON, nullable=True)
    brand = db.Column(db.String(50), nullable=True)
    model = db.Column(db.String(50), nullable=True)
    year_of_manufacture = db.Column(db.Integer, nullable=True)
    color = db.Column(db.String(25), nullable=True)
    dimensions = db.Column(db.String(50), nullable=True)
    weight = db.Column(db.String(10), nullable=True)
    material = db.Column(db.String(50), nullable=True)
    battery_life = db.Column(db.String(25), nullable=True)
    storage_capacity = db.Column(db.String(25), nullable=True)
    additional_features = db.Column(db.String(200), nullable=True)
    additional_details = db.Column(db.String(200), nullable=True)

    # Relationships
    owner = db.relationship('User', back_populates='listings_not_sold', foreign_keys=[owner_id], overlaps="listings_sold")
    buyer = db.relationship('User', back_populates='listings_bought', foreign_keys=[buyer_id])
    interested_buyers = db.relationship('User', secondary=user_listing_interest_table, back_populates='listings_of_interest')

    def get_json_full(self):
        return {
            "id": self.id,
            "title": self.title,
            "price": self.price,
            "display_image": self.display_image,
            "description": self.description,
            "negotiable": self.negotiable,
            "condition": self.condition,
            "flairs": self.flairs,
            "media": self.media,
            "brand": self.brand,
            "model": self.model,
            "year_of_manufacture": self.year_of_manufacture,
            "color": self.color,
            "dimensions": self.dimensions,
            "weight": self.weight,
            "material": self.material,
            "battery_life": self.battery_life,
            "storage_capacity": self.storage_capacity,
            "additional_features": self.additional_features,
            "additional_details": self.additional_details,
            "sold": self.sold,
            "datetime_created": self.datetime_created.strftime("%Y-%m-%d"),
            "owner": self.owner.get_json(),
            "buyer": None if not self.buyer else self.buyer.get_json(),
        }

    def get_json_min(self):
        return {
            "title": self.title,
            "price": self.price,
            "display_image": self.display_image,
            "owner_rating": self.owner.get_average_rating()
        }
