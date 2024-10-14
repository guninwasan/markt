from flask import Flask
from .api_users import user_api_bp
from .api_listings import listing_api_bp

def create_app_api():
    app = Flask(__name__)

    app.register_blueprint(user_api_bp, url_prefix='/api')
    app.register_blueprint(listing_api_bp, url_prefix='/api')

    return app
