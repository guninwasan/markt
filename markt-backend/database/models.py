import bcrypt
from enum import Enum
from .db import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_encryp = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)

    class UserRole(Enum):
        BUYER = 'buyer'
        SELLER = 'seller'
    role = db.Column(db.Enum(UserRole), nullable=False)
    
    listings = db.relationship('Listing', backref='owner', lazy=True)

    def __init__(self, username, password, email, phone, role):
        self.username = username
        self.email = email
        self.phone = phone
        self.role = role

        # Encrypt password
        salt = bcrypt.gensalt()
        self.password_encryp = bcrypt.hashpw(password.encode('utf-8'), salt)

    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password_encryp = bcrypt.hashpw(password.encode('utf-8'), salt)

    def validate_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_encryp)

class Listing(db.Model):
    __tablename__ = 'listings'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    sold = db.Column(db.Boolean, default=False)
    condition = db.Column(db.String(50), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
