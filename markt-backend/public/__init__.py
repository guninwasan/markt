from pathlib import Path
import os
from flask import Flask
from .api_users import user_api_bp
from .api_listings import listing_api_bp
from database.db import init_db, db

from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})

def create_app_api():
    basedir = Path(__file__).resolve().parent
    DATABASE = "api.db"

    app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:root@localhost/MizzicaBackend'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    init_db(app)

    with app.app_context():
        print("Creating all tables...")
        db.create_all()
        print("All tables created successfully.")

    app.register_blueprint(user_api_bp, url_prefix='/api/user')
    app.register_blueprint(listing_api_bp, url_prefix='/api/listing')

    @app.route('/')
    def home():
        return "Welcome to Mizzica Backend!"

    return app

create_app_api()

if __name__ == "__main__":
    create_app_api().run()