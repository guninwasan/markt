import bcrypt
import re
from .db import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    password_encryp = db.Column(db.String(1000), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)

    # Relationships
    listings_for_selling = db.relationship('Listing', back_populates='owner', foreign_keys='Listing.owner_id', lazy='dynamic')
    listings_bought = db.relationship('Listing', back_populates='buyer', foreign_keys='Listing.buyer_id', lazy='dynamic')

    def __init__(self, full_name, password, email, phone):
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
        self.password_encryp = passwordHash.decode('utf-8') #prevent dublicate encoding from PSQL

    def check_password(self, password):
        # Convert the stored hash back to bytes
        return bcrypt.checkpw(password.encode('utf-8'), self.password_encryp.encode('utf-8'))

    """
    Email Helpers
    """
    @classmethod
    def validate_email_format(self, email):
        if ("@mail.utoronto.ca" not in email) and ("@utoronto.ca" not in email):
            return False
        return True

    """
    Phone Helpers
    """
    @classmethod
    def validate_phone_format(self, phone):
        PHONE_REGEX = re.compile(r"^\+?[1-9]\d{1,14}$")
        if not bool(PHONE_REGEX.match(str(phone))):
            return False
        return True

class Listing(db.Model):
    __tablename__ = 'listings'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    sold = db.Column(db.Boolean, default=False)
    condition = db.Column(db.String(50), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    # Relationships
    owner = db.relationship('User', back_populates='listings_for_selling', foreign_keys=[owner_id])
    buyer = db.relationship('User', back_populates='listings_bought', foreign_keys=[buyer_id])
