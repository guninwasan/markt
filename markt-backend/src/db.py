from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from pathlib import Path
import os

app = Flask(__name__)

basedir = Path(__file__).resolve().parent
DATABASE = "markt.db"
url = os.getenv("DATABASE_URL", f"sqlite:///{Path(basedir).joinpath(DATABASE)}")

SQLALCHEMY_DATABASE_URI = url
SQLALCHEMY_TRACK_MODIFICATIONS = False
app.config.from_object(__name__)

db = SQLAlchemy(app)
db.app = app

from .models import User, Listing

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
