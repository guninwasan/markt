import os
from flask_mail import Mail
from dotenv import load_dotenv
from database import create_app_db

from flask_cors import CORS

mail = Mail()

from .api_users import user_api_bp
from .api_listings import listing_api_bp

def create_app_api(testing):
    load_dotenv()
    app = create_app_db(testing)
    CORS(app)

    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
    app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

    mail.init_app(app)

    app.register_blueprint(user_api_bp, url_prefix='/api/user')
    app.register_blueprint(listing_api_bp, url_prefix='/api/listing')

    return app

app = create_app_api(testing=False)

@app.route('/')
def home():
    return "Welcome to Mizzica Backend!"

if __name__ == "__main__":
    create_app_api(testing=False).run()