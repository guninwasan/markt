from pathlib import Path
import os
from flask import Flask
from .api_users import user_api_bp
from .api_listings import listing_api_bp
from database.db import init_db, db

def create_app_api():
    app = Flask(__name__)

    basedir = Path(__file__).resolve().parent
    DATABASE = "api.db"
    url = os.getenv("DATABASE_URL", f"sqlite:///{Path(basedir).joinpath(DATABASE)}")
    app.config['SQLALCHEMY_DATABASE_URI'] = url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    init_db(app)

    app.register_blueprint(user_api_bp, url_prefix='/api/user')
    app.register_blueprint(listing_api_bp, url_prefix='/api/listing')

    return app
