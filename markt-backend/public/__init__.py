from flask import Flask
from .api_users import user_api_bp
from .api_listings import listing_api_bp
from src.db import init_db, db

def create_app_api():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///api.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    init_db(app)

    app.register_blueprint(user_api_bp, url_prefix='/api')
    app.register_blueprint(listing_api_bp, url_prefix='/api')

    return app
