from .api_users import user_api_bp
from .api_listings import listing_api_bp
from database import create_app_db

from flask_cors import CORS

def create_app_api(testing):
    app = create_app_db(testing)
    CORS(app, resources={r"/api/*": {"origins": "https://mizzica.netlify.app"}})

    app.register_blueprint(user_api_bp, url_prefix='/api/user')
    app.register_blueprint(listing_api_bp, url_prefix='/api/listing')

    return app

app = create_app_api(testing=False)

@app.route('/')
def home():
    return "Welcome to Mizzica Backend!"

if __name__ == "__main__":
    create_app_api(testing=False).run()