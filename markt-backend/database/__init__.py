from pathlib import Path
import os
from flask import Flask
from .db import init_db, db
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)

    with app.app_context():
        print("Creating all tables...")
        db.create_all()
        print("All tables created successfully.")