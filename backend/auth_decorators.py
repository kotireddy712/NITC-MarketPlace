from functools import wraps
from flask import session, jsonify

def login_required(f):
    """
    A decorator that ensures a valid user session exists before accessing a route.
    If not logged in, returns a 401 Unauthorized response.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"message": "Unauthorized access. Please log in."}), 401
        return f(*args, **kwargs)
    return decorated_function
