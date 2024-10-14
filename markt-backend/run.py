from src.db import create_app_db
from public import create_app_api
from flask import Flask

def create_app():
    app = Flask(__name__)

    # Initialize database
    db_app = create_app_db()

    # Register API endpoints
    api_app = create_app_api()

    # API used by frontend
    return api_app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
