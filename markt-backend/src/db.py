from pathlib import Path
from flask_sqlalchemy import SQLAlchemy
import os
from flask import Flask

db = SQLAlchemy()

def create_app_db():
    app = Flask(__name__)

    basedir = Path(__file__).resolve().parent
    DATABASE = "markt.db"
    url = os.getenv("DATABASE_URL", f"sqlite:///{Path(basedir).joinpath(DATABASE)}")

    app.config['SQLALCHEMY_DATABASE_URI'] = url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = app

    from .models import User, Listing

    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app

