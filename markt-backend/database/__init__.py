from pathlib import Path
import os
from flask import Flask
from .db import init_db, db, migrate

def create_app_db(testing):
    app = Flask(__name__)

    if testing:
        url = 'postgresql://postgres:welcome1234@localhost/MizzicaBackendTest'
    else:
        url = 'postgresql://mizzicabackend_user:OAfgf9d780rVKsp5rF4T9Rc2rzsWj3dP@dpg-csoj84pu0jms73984skg-a.oregon-postgres.render.com/mizzicabackend'

    app.config['SQLALCHEMY_DATABASE_URI'] = url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['TESTING'] = testing

    init_db(app)
    migrate.init_app(app, db)

    from .models import User, Listing

    with app.app_context():
        db.create_all()

    return app