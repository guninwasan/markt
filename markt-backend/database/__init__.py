from pathlib import Path
import os
from flask import Flask
from .db import init_db, db

def create_app_db(testing):
    app = Flask(__name__)

    if testing:
        url = 'postgresql://postgres:welcome1234@localhost/MizzicaBackendTest'
    else:
        url = 'postgresql://mizzicabackend_zr7j_user:iXXxqgBGlWaXLyzvLH1fOCMxL99aPax9@dpg-cspi3n2j1k6c73atl5lg-a.oregon-postgres.render.com/mizzicabackend_zr7j'

    app.config['SQLALCHEMY_DATABASE_URI'] = url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['TESTING'] = testing

    init_db(app)

    from .models import User, Listing

    with app.app_context():
        db.create_all()

    return app