import bcrypt
from .db import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    password_encryp = db.Column(db.String(1000), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)

    # Relationships
    sell_listings = db.relationship('Listing', back_populates='owner', foreign_keys='Listing.owner_id', lazy='dynamic')
    buy_listings = db.relationship('Listing', back_populates='buyer', foreign_keys='Listing.buyer_id', lazy='dynamic')

    def __init__(self, password, email, phone):
        self.email = email
        self.phone = phone
        
        # Encrypt password
        passwordHash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.password_encryp = passwordHash.decode('utf-8') #prevent dublicate encoding from PSQL

    def set_password(self, password):
        passwordHash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.password_encryp = passwordHash.decode('utf-8') #prevent dublicate encoding from PSQL

    def validate_password(self, password):
        # Convert the stored hash back to bytes
        return bcrypt.checkpw(password.encode('utf-8'), self.password_encryp.encode('utf-8'))

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
    owner = db.relationship('User', back_populates='sell_listings', foreign_keys=[owner_id])
    buyer = db.relationship('User', back_populates='buy_listings', foreign_keys=[buyer_id])
