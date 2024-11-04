from pathlib import Path
import os
from flask import Flask
from .db import init_db, db

def create_app_db(db_name=None, testing=False):
    app = Flask(__name__)

    if testing:
        url = 'postgresql://postgres:root@localhost/MizzicaBackendTest'
    else:
        url = 'postgresql://postgres:root@localhost/MizzicaBackend'

    app.config['SQLALCHEMY_DATABASE_URI'] = url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['TESTING'] = testing

    init_db(app)

    from .models import User, Listing

    with app.app_context():
        db.create_all()

    return app