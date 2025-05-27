# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import mysql.connector
# import cloudinary
# import cloudinary.uploader
# import logging
# from werkzeug.security import generate_password_hash, check_password_hash

# app = Flask(__name__)
# CORS(app) # Enable CORS for all routes

# # Configure logging for Flask app
# app.logger.setLevel(logging.INFO) # Set desired logging level
# handler = logging.StreamHandler()
# formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# handler.setFormatter(formatter)
# app.logger.addHandler(handler)

# # MySQL DB connection
# try:
#     db = mysql.connector.connect(
#         host="localhost",
#         user="root",
#         password="1234", # Keep this secure in production (e.g., environment variables)
#         database="nitc_mp_db"
#     )
#     cursor = db.cursor(dictionary=True)
#     app.logger.info("Successfully connected to MySQL database.")
# except mysql.connector.Error as err:
#     app.logger.error(f"Error connecting to MySQL: {err}")
#     # Consider exiting or handling this more gracefully in a real application
#     exit(1)

# # Cloudinary configuration
# cloudinary.config(
#     cloud_name='dnihh3gox',
#     api_key='369298749656953',
#     api_secret='Ii-tTqA9hkgdr-cQGN1FLTOBue0',
#     secure=True
# )
# app.logger.info("Cloudinary configured.")


# # --------------------- Routes ---------------------

# # Signup route
# @app.route("/signup", methods=["POST"])
# def signup():
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")
#     name = data.get("name")
#     contact = data.get("contact_number")

#     if not email or not password:
#         app.logger.warning("Signup attempt with missing email or password.")
#         return jsonify({"message": "Email and password are required."}), 400

#     try:
#         cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
#         user = cursor.fetchone()

#         if not user:
#             # This implies a pre-approved list of emails in your DB.
#             # If any email can sign up, you'd change this logic to INSERT new user.
#             app.logger.warning(f"Signup attempt for unauthorized email: {email}")
#             return jsonify({"message": "Email not authorized for signup."}), 403

#         # Check if the user already has a password (meaning they've signed up)
#         if user.get("password"):
#             app.logger.warning(f"Signup attempt for already signed up user: {email}")
#             return jsonify({"message": "User already signed up."}), 409

#         # Hash the password before storing it
#         hashed_password = generate_password_hash(password)

#         cursor.execute(
#             "UPDATE users SET name=%s, contact_number=%s, password=%s WHERE email=%s",
#             (name, contact, hashed_password, email)
#         )
#         db.commit()
#         app.logger.info(f"User {email} signed up successfully.")
#         return jsonify({"message": "Signup successful!"})
#     except Exception as e:
#         db.rollback()
#         app.logger.error(f"Error during signup for {email}: {e}")
#         return jsonify({"message": "An internal server error occurred during signup."}), 500


# # Login route
# @app.route("/login", methods=["POST"])
# def login():
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")

#     if not email or not password:
#         app.logger.warning("Login attempt with missing email or password.")
#         return jsonify({"message": "Email and password are required."}), 400

#     try:
#         # Ensure the password column is not NULL and check if the email exists
#         cursor.execute("SELECT * FROM users WHERE email=%s AND password IS NOT NULL", (email,))
#         user = cursor.fetchone()

#         if not user:
#             app.logger.warning(f"Login failed for {email}: No such user or not signed up yet (password is NULL).")
#             return jsonify({"message": "No such user or not signed up yet."}), 401
        
#         # Verify the hashed password
#         if not check_password_hash(user["password"], password):
#             app.logger.warning(f"Login failed for {email}: Incorrect password provided.")
#             return jsonify({"message": "Incorrect password"}), 403

#         app.logger.info(f"User {email} logged in successfully. User ID: {user['user_id']}")
#         # Return only necessary user info
#         return jsonify({
#             "message": "Login successful!",
#             "user": {
#                 "user_id": user["user_id"],
#                 "email": user["email"],
#                 "name": user.get("name", "")
#             }
#         })
#     except Exception as e:
#         app.logger.error(f"Error during login for {email}: {e}")
#         return jsonify({"message": "An internal server error occurred during login."}), 500


# # Fetch items by category
# @app.route('/items', methods=['GET'])
# def get_items():
#     category_id_str = request.args.get('category')
    
#     if not category_id_str:
#         app.logger.warning("Get items failed: Category ID not provided.")
#         return jsonify({'message': 'Category ID required'}), 400
    
#     try:
#         category_id = int(category_id_str)
#     except ValueError:
#         app.logger.warning(f"Get items failed: Invalid category ID format '{category_id_str}'.")
#         return jsonify({'message': 'Invalid category ID format.'}), 400

#     try:
#         cursor.execute("SELECT * FROM items WHERE category_id = %s AND is_sold = FALSE", (category_id,))
#         items = cursor.fetchall()
#         return jsonify(items)
#     except Exception as e:
#         app.logger.error(f"Error fetching items by category {category_id}: {e}")
#         return jsonify({'error': 'An internal server error occurred while fetching items.'}), 500


# # Sell item (add item)
# @app.route('/items', methods=['POST'])
# def add_item():
#     user_id_str = request.headers.get('user_id')
    
#     if not user_id_str:
#         app.logger.warning("Add item failed: user_id header missing.")
#         return jsonify({'error': 'User not authenticated. user_id header missing.'}), 401

#     try:
#         user_id = int(user_id_str)
#     except (ValueError, TypeError): # Handle cases where user_id_str might be None or not convertible
#         app.logger.warning(f"Add item failed: Invalid user ID format in header: '{user_id_str}'")
#         return jsonify({'error': 'Invalid user ID format in header.'}), 400

#     # Validate if the user_id actually exists in the database
#     try:
#         cursor.execute("SELECT user_id FROM users WHERE user_id = %s", (user_id,))
#         existing_user = cursor.fetchone()
#         if not existing_user:
#             app.logger.warning(f"Add item failed: User with ID {user_id} not found or not authorized.")
#             return jsonify({'error': 'User not found or not authorized to list items.'}), 401
#     except Exception as e:
#         app.logger.error(f"Database error during user ID validation for add item (user_id: {user_id}): {e}")
#         return jsonify({'error': 'An internal server error occurred during user validation.'}), 500


#     title = request.form.get('title')
#     description = request.form.get('description')
#     price = request.form.get('price')
#     quantity = request.form.get('quantity', '1') # Default to string '1' for conversion
#     condition = request.form.get('condition', 'Used')
#     category_id = request.form.get('category_id')

#     # Basic input validation for presence
#     if not (title and price and category_id):
#         app.logger.warning("Add item failed: Missing required fields (title, price, category).")
#         return jsonify({'error': 'Missing required fields (title, price, category).'}), 400

#     try:
#         price = float(price)
#         quantity = int(quantity)
#         category_id = int(category_id)
#     except (ValueError, TypeError) as e:
#         app.logger.warning(f"Add item failed: Invalid data type conversion for price/quantity/category_id: {e}")
#         return jsonify({'error': 'Price, quantity, and category ID must be valid numbers.'}), 400

#     image_file = request.files.get('image')
#     image_url = None
#     if image_file:
#         try:
#             upload_result = cloudinary.uploader.upload(image_file)
#             image_url = upload_result.get('secure_url')
#             if not image_url:
#                 app.logger.error("Cloudinary upload did not return a secure URL for user {user_id}.")
#                 return jsonify({'error': 'Image upload failed: Could not get secure URL.'}), 500
#         except Exception as e:
#             app.logger.error(f"Cloudinary image upload failed for user {user_id}: {e}")
#             return jsonify({'error': 'Image upload failed. Please try again.'}), 500

#     try:
#         # Use a single transaction for atomicity
#         db.start_transaction() # Start a transaction
#         cursor.execute("""
#             INSERT INTO items (title, description, price, quantity, item_condition, image_url, user_id, category_id)
#             VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
#         """, (title, description, price, quantity, condition, image_url, user_id, category_id))
        
#         # Update category item count in the same transaction
#         cursor.execute("""
#             UPDATE categories SET total_items = total_items + 1 WHERE category_id = %s
#         """, (category_id,))
        
#         db.commit() # Commit both operations
#         app.logger.info(f"Item '{title}' added successfully by user {user_id}.")
#         return jsonify({'message': 'Item added successfully!'})

#     except Exception as e:
#         db.rollback() # Rollback if any error occurs
#         app.logger.error(f"Error adding item to DB for user {user_id}: {e}")
#         return jsonify({'error': 'An internal server error occurred while adding the item.'}), 500


# # Get all categories
# @app.route('/categories', methods=['GET'])
# def get_categories():
#     try:
#         cursor.execute("SELECT category_id, name FROM categories")
#         rows = cursor.fetchall()
#         app.logger.info("Categories fetched successfully.")
#         return jsonify(rows)
#     except Exception as e:
#         app.logger.error(f"Error fetching categories: {e}")
#         return jsonify({'error': 'An error occurred while fetching categories.'}), 500


# # --------------------- Run App ---------------------
# if __name__ == "__main__":
#     app.run(debug=True, port=5000) # Ensure Flask runs on port 5000
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
import cloudinary
import cloudinary.uploader
import logging
from werkzeug.security import generate_password_hash, check_password_hash
import os # Import os for secret key

app = Flask(__name__)

# --- Flask Session Configuration ---
# IMPORTANT: Set a strong, secret key for session management
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'your_super_secret_key_change_me_in_production')
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax' # Recommended for CSRF protection
app.config['SESSION_COOKIE_SECURE'] = False # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True # Prevent client-side JS access to session cookie

CORS(app, supports_credentials=True) # Enable CORS for all routes, crucial for cookies/sessions

# Configure logging for Flask app
app.logger.setLevel(logging.INFO) # Set desired logging level
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
app.logger.addHandler(handler)

# MySQL DB connection
try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234", # Keep this secure in production (e.g., environment variables)
        database="nitc_mp_db"
    )
    cursor = db.cursor(dictionary=True)
    app.logger.info("Successfully connected to MySQL database.")
except mysql.connector.Error as err:
    app.logger.error(f"Error connecting to MySQL: {err}")
    exit(1)

# Cloudinary configuration
cloudinary.config(
    cloud_name='dnihh3gox',
    api_key='369298749656953',
    api_secret='Ii-tTqA9hkgdr-cQGN1FLTOBue0',
    secure=True
)
app.logger.info("Cloudinary configured.")


# --------------------- Routes ---------------------

# Signup route
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    contact = data.get("contact_number")

    if not email or not password:
        app.logger.warning("Signup attempt with missing email or password.")
        return jsonify({"message": "Email and password are required."}), 400

    try:
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if not user:
            app.logger.warning(f"Signup attempt for unauthorized email: {email}")
            return jsonify({"message": "Email not authorized for signup."}), 403

        if user.get("password"):
            app.logger.warning(f"Signup attempt for already signed up user: {email}")
            return jsonify({"message": "User already signed up."}), 409

        hashed_password = generate_password_hash(password)

        cursor.execute(
            "UPDATE users SET name=%s, contact_number=%s, password=%s WHERE email=%s",
            (name, contact, hashed_password, email)
        )
        db.commit()
        app.logger.info(f"User {email} signed up successfully.")
        return jsonify({"message": "Signup successful!"})
    except Exception as e:
        db.rollback()
        app.logger.error(f"Error during signup for {email}: {e}")
        return jsonify({"message": "An internal server error occurred during signup."}), 500


# Login route
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        app.logger.warning("Login attempt with missing email or password.")
        return jsonify({"message": "Email and password are required."}), 400

    try:
        cursor.execute("SELECT * FROM users WHERE email=%s AND password IS NOT NULL", (email,))
        user = cursor.fetchone()

        if not user:
            app.logger.warning(f"Login failed for {email}: No such user or not signed up yet (password is NULL).")
            return jsonify({"message": "No such user or not signed up yet."}), 401
        
        if not check_password_hash(user["password"], password):
            app.logger.warning(f"Login failed for {email}: Incorrect password provided.")
            return jsonify({"message": "Incorrect password"}), 403

        # --- Store user_id in Flask session ---
        session['user_id'] = user['user_id']
        app.logger.info(f"User {email} logged in successfully. User ID stored in session: {session['user_id']}")
        
        return jsonify({
            "message": "Login successful!",
            "user": {
                "email": user["email"],
                "name": user.get("name", "")
            }
        })
    except Exception as e:
        app.logger.error(f"Error during login for {email}: {e}")
        return jsonify({"message": "An internal server error occurred during login."}), 500

# Logout route
@app.route("/logout", methods=["POST"])
def logout():
    session.pop('user_id', None) # Remove user_id from session
    app.logger.info("User logged out successfully.")
    return jsonify({"message": "Logged out successfully!"})

# Fetch items by category
@app.route('/items', methods=['GET'])
def get_items():
    category_id_str = request.args.get('category')
    
    if not category_id_str:
        app.logger.warning("Get items failed: Category ID not provided.")
        return jsonify({'message': 'Category ID required'}), 400
    
    try:
        category_id = int(category_id_str)
    except ValueError:
        app.logger.warning(f"Get items failed: Invalid category ID format '{category_id_str}'.")
        return jsonify({'message': 'Invalid category ID format.'}), 400

    try:
        cursor.execute("SELECT * FROM items WHERE category_id = %s AND is_sold = FALSE", (category_id,))
        items = cursor.fetchall()
        return jsonify(items)
    except Exception as e:
        app.logger.error(f"Error fetching items by category {category_id}: {e}")
        return jsonify({'error': 'An internal server error occurred while fetching items.'}), 500


# Sell item (add item) - Now uses session for user_id
@app.route('/items', methods=['POST'])
def add_item():
    # --- Retrieve user_id from Flask session ---
    user_id = session.get('user_id') 
    
    if not user_id:
        app.logger.warning("Add item failed: User not logged in (session user_id missing).")
        return jsonify({'error': 'You are not logged in. Please log in to sell an item.'}), 401

    # Validate if the user_id actually exists in the database (good practice, though session implies it)
    try:
        cursor.execute("SELECT user_id FROM users WHERE user_id = %s", (user_id,))
        existing_user = cursor.fetchone()
        if not existing_user:
            app.logger.warning(f"Add item failed: User with ID {user_id} not found in DB.")
            session.pop('user_id', None) # Clear invalid session
            return jsonify({'error': 'User not found or session invalid. Please re-login.'}), 401
    except Exception as e:
        app.logger.error(f"Database error during user ID validation for add item (user_id: {user_id}): {e}")
        return jsonify({'error': 'An internal server error occurred during user validation.'}), 500

    title = request.form.get('title')
    description = request.form.get('description')
    price = request.form.get('price')
    quantity = request.form.get('quantity', '1')
    condition = request.form.get('condition', 'Used')
    category_id = request.form.get('category_id')

    if not (title and price and category_id):
        app.logger.warning("Add item failed: Missing required fields (title, price, category).")
        return jsonify({'error': 'Missing required fields (title, price, category).'}), 400

    try:
        price = float(price)
        quantity = int(quantity)
        category_id = int(category_id)
    except (ValueError, TypeError) as e:
        app.logger.warning(f"Add item failed: Invalid data type conversion for price/quantity/category_id: {e}")
        return jsonify({'error': 'Price, quantity, and category ID must be valid numbers.'}), 400

    image_file = request.files.get('image')
    image_url = None
    if image_file:
        try:
            upload_result = cloudinary.uploader.upload(image_file)
            image_url = upload_result.get('secure_url')
            if not image_url:
                app.logger.error(f"Cloudinary upload did not return a secure URL for user {user_id}.")
                return jsonify({'error': 'Image upload failed: Could not get secure URL.'}), 500
        except Exception as e:
            app.logger.error(f"Cloudinary image upload failed for user {user_id}: {e}")
            return jsonify({'error': 'Image upload failed. Please try again.'}), 500

    try:
        db.start_transaction()
        cursor.execute("""
            INSERT INTO items (title, description, price, quantity, item_condition, image_url, user_id, category_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (title, description, price, quantity, condition, image_url, user_id, category_id))
        
        cursor.execute("""
            UPDATE categories SET total_items = total_items + 1 WHERE category_id = %s
        """, (category_id,))
        
        db.commit()
        app.logger.info(f"Item '{title}' added successfully by user {user_id}.")
        return jsonify({'message': 'Item added successfully!'})

    except Exception as e:
        db.rollback()
        app.logger.error(f"Error adding item to DB for user {user_id}: {e}")
        return jsonify({'error': 'An internal server error occurred while adding the item.'}), 500


# Get all categories
@app.route('/categories', methods=['GET'])
def get_categories():
    try:
        cursor.execute("SELECT category_id, name FROM categories")
        rows = cursor.fetchall()
        app.logger.info("Categories fetched successfully.")
        return jsonify(rows)
    except Exception as e:
        app.logger.error(f"Error fetching categories: {e}")
        return jsonify({'error': 'An error occurred while fetching categories.'}), 500

# Route to check session status (optional, for frontend debugging)
@app.route('/check_session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'user_id': session['user_id']}), 200
    return jsonify({'logged_in': False}), 401


# --------------------- Run App ---------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)