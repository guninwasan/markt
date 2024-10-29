from pathlib import Path
import os
from flask import Flask
from .db import init_db, db

def create_app_db(db_name=None, testing=False):
    app = Flask(__name__)

    basedir = Path(__file__).resolve().parent
    DATABASE = "backend.db" if db_name is None else str(db_name)
    url = os.getenv("DATABASE_URL", f"sqlite:///{Path(basedir).joinpath(DATABASE)}")

    app.config['SQLALCHEMY_DATABASE_URI'] = url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['TESTING'] = testing

    init_db(app)

    from .models import User, Listing

    with app.app_context():
        db.create_all()

    return app