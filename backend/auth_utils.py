from functools import wraps
from flask import session, jsonify

def login_required(f):
    """
    Ensures the user is logged in before accessing a route.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"message": "Unauthorized access. Please log in."}), 401
        return f(*args, **kwargs)
    return decorated_function


def admin_required(f):
    """
    Ensures the logged-in user is an admin.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"message": "Unauthorized access. Please log in."}), 401
        if session.get("role") != "admin":
            return jsonify({"message": "Access denied. Admins only."}), 403
        return f(*args, **kwargs)
    return decorated_function


def clear_session():
    """
    Clears the current user session.
    """
    session.clear()
