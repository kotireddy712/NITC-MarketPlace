from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import cloudinary
import cloudinary.uploader
import os

app = Flask(__name__)
CORS(app)

# --- CRITICAL CHANGE HERE ---
# Disable autocommit when establishing the database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="nitc_mp_db",
    autocommit=False # <--- THIS IS THE KEY ADDITION
)
# Make sure the cursor is recreated if the connection drops, or use connection pooling.
# For simplicity, we'll keep it as is, but be aware for production.
cursor = db.cursor(dictionary=True)

# Cloudinary Configuration - Replace with your actual credentials
# It's highly recommended to use environment variables for sensitive info
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'dnihh3gox'),
    api_key=os.getenv('CLOUDINARY_API_KEY', '369298749656953'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET', 'Ii-tTqA9hkgdr-cQGN1FLTOBue0')
)

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data["email"]
    password = data["password"]
    name = data["name"]
    contact = data["contact_number"]

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if not user:
        # If the email doesn't exist, it means it's not an authorized user to signup
        return jsonify({"message": "Email not authorized for signup. Please use a registered NITC email."}), 403

    if user["password"]:
        return jsonify({"message": "User already signed up."}), 409

    try:
        cursor.execute(
            "UPDATE users SET name=%s, contact_number=%s, password=%s WHERE email=%s",
            (name, contact, password, email)
        )
        db.commit() # Commit transaction for signup
        return jsonify({"message": "Signup successful!"})
    except mysql.connector.Error as err:
        db.rollback() # Rollback on error
        return jsonify({"message": f"Database error during signup: {err}"}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    # For SELECT queries, if autocommit=False, they typically don't require explicit commit/rollback
    # unless you're reading uncommitted data from the same session.
    cursor.execute("SELECT * FROM users WHERE email=%s AND password IS NOT NULL", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "No such user or not signed up yet."}), 401
    if user["password"] != password: # In a real app, use hashed passwords and bcrypt.
        return jsonify({"message": "Incorrect password"}), 403

    # Return user_id upon successful login
    return jsonify({"message": "Login successful!", "user_id": user["user_id"], "name": user["name"], "email": user["email"]})

@app.route('/items', methods=['GET'])
def get_items():
    category_id = request.args.get('category_id') # Changed from 'category' to 'category_id' as per schema

    try:
        if not category_id:
            # Fetch all unsold items if no category is specified (optional, but useful)
            cursor.execute("SELECT i.*, c.name as category_name, u.name as seller_name FROM items i JOIN categories c ON i.category_id = c.category_id JOIN users u ON i.user_id = u.user_id WHERE i.is_sold = FALSE")
        else:
            cursor.execute("SELECT i.*, c.name as category_name, u.name as seller_name FROM items i JOIN categories c ON i.category_id = c.category_id JOIN users u ON i.user_id = u.user_id WHERE i.category_id = %s AND i.is_sold = FALSE", (category_id,))

        items = cursor.fetchall()
        # No db.commit() or db.rollback() typically needed for pure SELECTs,
        # but adding a rollback in the error handler is safe.
        return jsonify(items)
    except mysql.connector.Error as err:
        # db.rollback() # Not strictly necessary for SELECT, but harmless for safety
        return jsonify({"message": f"Database error fetching items: {err}"}), 500

@app.route('/categories', methods=['GET'])
def get_categories():
    """Fetches all categories from the database."""
    try:
        cursor.execute("SELECT category_id, name FROM categories ORDER BY name")
        categories = cursor.fetchall()
        return jsonify(categories)
    except mysql.connector.Error as err:
        # db.rollback() # Not strictly necessary for SELECT, but harmless for safety
        return jsonify({"message": f"Error fetching categories: {err}"}), 500

@app.route('/sell_item', methods=['POST'])
def sell_item():
    """Handles selling an item, including image upload and database updates."""
    # Data comes from FormData, so use request.form and request.files
    user_id = request.form.get('user_id')
    title = request.form.get('title')
    description = request.form.get('description')
    price = request.form.get('price')
    quantity = request.form.get('quantity')
    item_condition = request.form.get('item_condition')
    category_id = request.form.get('category_id')
    image_file = request.files.get('image')

    # Basic validation
    if not all([user_id, title, price, category_id, item_condition]):
        return jsonify({"message": "Missing required fields."}), 400

    try:
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
            return jsonify({"message": f"Image upload failed: {e}"}), 500

    # --- CRITICAL CHANGE HERE ---
    # db.start_transaction() is REMOVED!
    # Because autocommit=False is set at connection, all operations below are part of one transaction
    try:
        # 1. Insert the new item
        insert_item_query = """
        INSERT INTO items (title, description, price, quantity, image_url, item_condition, user_id, category_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_item_query, (
            title, description, price, quantity, image_url, item_condition, user_id, category_id
        ))

        # 2. Update the total_items count in the categories table
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
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        db.rollback() # Rollback for any other unexpected error
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)