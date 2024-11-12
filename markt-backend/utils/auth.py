from functools import wraps
from flask import request, jsonify
from database.models import ApiKey  # Import your ApiKey model

# API Key validation helper function
def validate_api_key(api_key, user_id):
    api_key_record = ApiKey.query.filter_by(key=api_key, user_id=user_id).first()
    return api_key_record is not None  # Return True if a matching record is found

# Decorator to protect routes with API key and user ID
def api_key_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('API-Key')      # Extract API key from headers
        user_id = request.headers.get('User-ID')      # Extract User-ID from headers
        
        # Check if both headers are present and valid
        if not api_key or not user_id or not validate_api_key(api_key, user_id):
            return jsonify({"status": "error", "message": "Unauthorized: Invalid API Key or User ID"}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function
