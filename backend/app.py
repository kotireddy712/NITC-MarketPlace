from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import cloudinary
import cloudinary.uploader
import os
import bcrypt # Import the bcrypt library for password hashing

app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing for your frontend

# --- Database Connection Configuration ---
# IMPORTANT: Set autocommit=False to manage transactions manually.
# Ensure your MySQL server is running and database 'nitc_mp_db' exists.
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="nitc_mp_db",
    autocommit=False # Crucial for transaction management
)
# Create a cursor with dictionary=True to fetch rows as dictionaries
cursor = db.cursor(dictionary=True)

# --- Cloudinary Configuration ---
# It's highly recommended to use environment variables for sensitive API keys in production.
# For local testing, you can directly place them, but remove for deployment.
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'dnihh3gox'), # Replace with your Cloudinary cloud name
    api_key=os.getenv('CLOUDINARY_API_KEY', '369298749656953'),     # Replace with your Cloudinary API key
    api_secret=os.getenv('CLOUDINARY_API_SECRET', 'Ii-tTqA9hkgdr-cQGN1FLTOBue0') # Replace with your Cloudinary API Secret
)

# --- Routes ---

@app.route("/signup", methods=["POST"])
def signup():
    """Handles user registration, hashes password, and updates user details."""
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    contact = data.get("contact_number")

    if not all([email, password, name, contact]):
        return jsonify({"message": "Missing required fields."}), 400

    try:
        # Check if email is in the 'users' table (authorized NITC email)
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "Email not authorized for signup. Please use a registered NITC email."}), 403

        if user.get("password"): # Check if password column is not NULL/empty
            return jsonify({"message": "User already signed up."}), 409

        # Hash the password before storing it for security
        # bcrypt.gensalt() generates a random salt, bcrypt.hashpw expects bytes
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Update the existing user record with name, contact, and hashed password
        cursor.execute(
            "UPDATE users SET name=%s, contact_number=%s, password=%s WHERE email=%s",
            (name, contact, hashed_password, email)
        )
        db.commit() # Commit the transaction
        return jsonify({"message": "Signup successful!"})

    except mysql.connector.Error as err:
        db.rollback() # Rollback on database error
        app.logger.error(f"Database error during signup for {email}: {err}")
        return jsonify({"message": f"Database error during signup: {err}"}), 500
    except Exception as e:
        db.rollback() # Rollback for any other unexpected errors
        app.logger.error(f"Unexpected error during signup for {email}: {e}")
        return jsonify({"message": f"An unexpected error occurred during signup: {e}"}), 500


@app.route("/login", methods=["POST"])
def login():
    """Handles user login by verifying email and hashed password."""
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"message": "Missing required fields."}), 400

    try:
        # Fetch user details where password is not NULL (i.e., user has signed up)
        cursor.execute("SELECT user_id, name, email, password FROM users WHERE email=%s AND password IS NOT NULL", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "No such user or not signed up yet."}), 401 # User not found or not registered

        # Verify the provided password against the stored hash
        # bcrypt.checkpw expects bytes for both arguments
        if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
            return jsonify({"message": "Incorrect password"}), 403 # Password mismatch

        # Login successful, return user details (excluding hashed password)
        return jsonify({
            "message": "Login successful!",
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"]
        })

    except mysql.connector.Error as err:
        app.logger.error(f"Database error during login for {email}: {err}")
        return jsonify({"message": f"Database error during login: {err}"}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error during login for {email}: {e}")
        return jsonify({"message": f"An unexpected error occurred during login: {e}"}), 500


@app.route('/items', methods=['GET'])
def get_items():
    """Fetches all unsold items or items filtered by category, including seller details."""
    category_id = request.args.get('category_id')

    try:
        # Base query to select item details, category name, seller name, contact, and email
        base_query = """
        SELECT
            i.item_id, i.title, i.description, i.price, i.quantity, i.image_url,
            i.item_condition, i.is_sold, i.created_at, i.user_id, i.category_id,
            c.name as category_name,
            u.name as seller_name,
            u.contact_number as seller_contact_number,
            u.email as seller_email
        FROM items i
        JOIN categories c ON i.category_id = c.category_id
        JOIN users u ON i.user_id = u.user_id
        """
        # We only want to show unsold items on the general browse page
        where_clause = " WHERE i.is_sold = FALSE"

        if category_id:
            # If a category is specified, add it to the WHERE clause
            cursor.execute(f"{base_query}{where_clause} AND i.category_id = %s", (category_id,))
        else:
            # If no category is specified, fetch all unsold items
            cursor.execute(f"{base_query}{where_clause}")

        items = cursor.fetchall()
        return jsonify(items)

    except mysql.connector.Error as err:
        app.logger.error(f"Database error fetching items: {err}")
        return jsonify({"message": f"Database error fetching items: {err}"}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error fetching items: {e}")
        return jsonify({"message": f"An unexpected error occurred fetching items: {e}"}), 500


@app.route('/categories', methods=['GET'])
def get_categories():
    """Fetches all item categories from the database."""
    try:
        cursor.execute("SELECT category_id, name FROM categories ORDER BY name")
        categories = cursor.fetchall()
        return jsonify(categories)
    except mysql.connector.Error as err:
        app.logger.error(f"Database error fetching categories: {err}")
        return jsonify({"message": f"Error fetching categories: {err}"}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error fetching categories: {e}")
        return jsonify({"message": f"An unexpected error occurred fetching categories: {e}"}), 500

@app.route('/sell_item', methods=['POST'])
def sell_item():
    """Handles listing a new item, including image upload to Cloudinary and database updates."""
    # Data comes from FormData (multipart/form-data), so use request.form and request.files
    user_id = request.form.get('user_id')
    title = request.form.get('title')
    description = request.form.get('description')
    price = request.form.get('price')
    quantity = request.form.get('quantity')
    item_condition = request.form.get('item_condition')
    category_id = request.form.get('category_id')
    image_file = request.files.get('image')

    # Basic validation for required fields
    if not all([user_id, title, price, category_id, item_condition]):
        return jsonify({"message": "Missing required fields."}), 400

    try:
        # Convert string inputs to correct data types
        user_id = int(user_id)
        price = float(price)
        quantity = int(quantity)
        category_id = int(category_id)
    except ValueError:
        return jsonify({"message": "Invalid data types for user_id, price, quantity, or category_id."}), 400

    image_url = None
    if image_file:
        try:
            # Upload image to Cloudinary
            upload_result = cloudinary.uploader.upload(image_file)
            image_url = upload_result.get('secure_url')
        except Exception as e:
            app.logger.error(f"Cloudinary upload failed for item {title}: {e}")
            return jsonify({"message": f"Image upload failed: {e}"}), 500

    try:
        # --- Transaction Block ---
        # Since autocommit=False is set at connection, these operations form one transaction
        # 1. Insert the new item into the 'items' table
        insert_item_query = """
        INSERT INTO items (title, description, price, quantity, image_url, item_condition, user_id, category_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_item_query, (
            title, description, price, quantity, image_url, item_condition, user_id, category_id
        ))

        # 2. Update the total_items count in the 'categories' table
        update_category_count_query = """
        UPDATE categories
        SET total_items = total_items + 1
        WHERE category_id = %s
        """
        cursor.execute(update_category_count_query, (category_id,))

        db.commit() # Commit the transaction if all operations succeed
        return jsonify({"message": "Item listed successfully!", "image_url": image_url}), 201

    except mysql.connector.Error as err:
        db.rollback() # Rollback the transaction on database error
        app.logger.error(f"Database error listing item {title}: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        db.rollback() # Rollback for any other unexpected error
        app.logger.error(f"An unexpected error occurred listing item {title}: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500


if __name__ == "__main__":
    # When running locally, Flask's debug mode provides auto-reloading and error tracing.
    # For production, set debug=False and handle environment variables securely.
    app.run(debug=True, port=5000)