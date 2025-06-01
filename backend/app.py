from flask import Flask, request, jsonify, g # Import 'g' for per-request storage
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling # Import pooling
import cloudinary
import cloudinary.uploader
import os
import bcrypt

app = Flask(__name__)
CORS(app)

# --- Database Connection Pool Configuration ---
# Define your DB credentials in a dictionary
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "1234",
    "database": "nitc_mp_db",
    "autocommit": False # Essential for manual transaction management
}

# Create a connection pool
# pool_size: number of connections to keep open in the pool
# pool_name: identifier for the pool
try:
    db_pool = pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=5,  # Adjust pool size based on expected load (e.g., 5-10)
        **db_config
    )
    print("Database connection pool created successfully.")
except mysql.connector.Error as err:
    print(f"Error creating database connection pool: {err}")
    # You might want to exit or log a critical error here if DB connection is vital
    exit(1) # Exit if DB pool cannot be established

# --- Helper Functions for Database Connection Management ---

def get_db():
    """
    Returns a database connection from the pool.
    Stores it on Flask's 'g' object for reuse within the same request.
    """
    if 'db' not in g:
        g.db = db_pool.get_connection()
        g.cursor = g.db.cursor(dictionary=True)
    return g.db

@app.teardown_appcontext
def close_db_connection(exception):
    """
    Closes the database connection at the end of each request
    and returns it to the pool.
    """
    db = g.pop('db', None)
    if db is not None and db.is_connected():
        g.cursor.close() # Close cursor first
        db.close() # Return connection to pool

# --- Cloudinary Configuration ---
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'dnihh3gox'),
    api_key=os.getenv('CLOUDINARY_API_KEY', '369298749656953'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET', 'Ii-tTqA9hkgdr-cQGN1FLTOBue0')
)

# --- Routes ---

@app.route("/signup", methods=["POST"])
def signup():
    """Handles user registration, hashes password, and updates user details."""
    db_conn = get_db() # Get connection from pool
    cursor = db_conn.cursor(dictionary=True) # Get cursor from this connection

    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    contact = data.get("contact_number")

    if not all([email, password, name, contact]):
        return jsonify({"message": "Missing required fields."}), 400

    try:
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "Email not authorized for signup. Please use a registered NITC email."}), 403

        if user.get("password"):
            return jsonify({"message": "User already signed up."}), 409

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        cursor.execute(
            "UPDATE users SET name=%s, contact_number=%s, password=%s WHERE email=%s",
            (name, contact, hashed_password, email)
        )
        db_conn.commit()
        return jsonify({"message": "Signup successful!"})

    except mysql.connector.Error as err:
        db_conn.rollback()
        app.logger.error(f"Database error during signup for {email}: {err}")
        return jsonify({"message": f"Database error during signup: {err}"}), 500
    except Exception as e:
        db_conn.rollback()
        app.logger.error(f"Unexpected error during signup for {email}: {e}")
        return jsonify({"message": f"An unexpected error occurred during signup: {e}"}), 500


@app.route("/login", methods=["POST"])
def login():
    """Handles user login by verifying email and hashed password."""
    db_conn = get_db() # Get connection from pool
    cursor = db_conn.cursor(dictionary=True) # Get cursor from this connection

    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"message": "Missing required fields."}), 400

    try:
        cursor.execute("SELECT user_id, name, email, password FROM users WHERE email=%s AND password IS NOT NULL", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "No such user or not signed up yet."}), 401

        if user["password"] is None or not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
            return jsonify({"message": "Incorrect password"}), 403

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
    db_conn = get_db() # Get connection from pool
    cursor = db_conn.cursor(dictionary=True) # Get cursor from this connection

    category_id = request.args.get('category_id')

    try:
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
        where_clause = " WHERE i.is_sold = FALSE"

        if category_id:
            cursor.execute(f"{base_query}{where_clause} AND i.category_id = %s", (category_id,))
        else:
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
    db_conn = get_db() # Get connection from pool
    cursor = db_conn.cursor(dictionary=True) # Get cursor from this connection

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
    db_conn = get_db() # Get connection from pool
    cursor = db_conn.cursor(dictionary=True) # Get cursor from this connection

    user_id = request.form.get('user_id')
    title = request.form.get('title')
    description = request.form.get('description')
    price = request.form.get('price')
    quantity = request.form.get('quantity')
    item_condition = request.form.get('item_condition')
    category_id = request.form.get('category_id')
    image_file = request.files.get('image')

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
            upload_result = cloudinary.uploader.upload(image_file)
            image_url = upload_result.get('secure_url')
        except Exception as e:
            app.logger.error(f"Cloudinary upload failed for item {title}: {e}")
            return jsonify({"message": f"Image upload failed: {e}"}), 500

    try:
        insert_item_query = """
        INSERT INTO items (title, description, price, quantity, image_url, item_condition, user_id, category_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_item_query, (
            title, description, price, quantity, image_url, item_condition, user_id, category_id
        ))

        update_category_count_query = """
        UPDATE categories
        SET total_items = total_items + 1
        WHERE category_id = %s
        """
        cursor.execute(update_category_count_query, (category_id,))

        db_conn.commit()
        return jsonify({"message": "Item listed successfully!", "image_url": image_url}), 201

    except mysql.connector.Error as err:
        db_conn.rollback()
        app.logger.error(f"Database error listing item {title}: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        db_conn.rollback()
        app.logger.error(f"An unexpected error occurred listing item {title}: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500
    
    # // **
    
# Add these imports if not already present at the top
# from flask import Flask, request, jsonify, g
# (Keep your existing imports)

# ... (Keep your existing Flask app setup, db_pool, get_db, close_db_connection, Cloudinary config, and existing routes) ...

@app.route('/user/<int:user_id>/items', methods=['GET'])
def get_user_items(user_id):
    """Fetches all items listed by a specific user."""
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)

    try:
        query = """
        SELECT
            i.item_id, i.title, i.description, i.price, i.quantity, i.image_url,
            i.item_condition, i.is_sold, i.created_at, i.user_id, i.category_id,
            c.name as category_name
        FROM items i
        JOIN categories c ON i.category_id = c.category_id
        WHERE i.user_id = %s
        ORDER BY i.created_at DESC
        """
        cursor.execute(query, (user_id,))
        items = cursor.fetchall()
        return jsonify(items)

    except mysql.connector.Error as err:
        app.logger.error(f"Database error fetching items for user {user_id}: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error fetching items for user {user_id}: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

@app.route('/items/<int:item_id>/status', methods=['PATCH'])
def update_item_status(item_id):
    """Updates the 'is_sold' status of an item."""
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)

    data = request.json
    new_status = data.get('is_sold') # Expecting: {"is_sold": true} or {"is_sold": false}
    requesting_user_id = data.get('user_id') # The user ID making the request

    if new_status is None or not isinstance(new_status, bool):
        return jsonify({"message": "Invalid 'is_sold' status provided. Must be true or false."}), 400
    if requesting_user_id is None:
        return jsonify({"message": "User ID is required to update status."}), 400

    try:
        # First, verify ownership
        cursor.execute("SELECT user_id FROM items WHERE item_id = %s", (item_id,))
        item = cursor.fetchone()

        if not item:
            return jsonify({"message": "Item not found."}), 404
        
        if item['user_id'] != requesting_user_id:
            return jsonify({"message": "Unauthorized. You can only update status for your own items."}), 403

        # Update the item status
        update_query = "UPDATE items SET is_sold = %s WHERE item_id = %s"
        cursor.execute(update_query, (new_status, item_id))
        db_conn.commit()
        
        # Optionally, refetch the item to return its updated state
        cursor.execute("""
            SELECT i.item_id, i.title, i.is_sold 
            FROM items i WHERE i.item_id = %s
        """, (item_id,))
        updated_item = cursor.fetchone()

        return jsonify({"message": "Item status updated successfully.", "item": updated_item})

    except mysql.connector.Error as err:
        db_conn.rollback()
        app.logger.error(f"Database error updating status for item {item_id}: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        db_conn.rollback()
        app.logger.error(f"Unexpected error updating status for item {item_id}: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """Deletes an item listed by a user."""
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)

    # In a real app with token auth, user_id would come from the token.
    # For now, we expect it in the request body or headers for verification.
    # Let's assume it's sent in the JSON body for this example.
    data = request.json
    requesting_user_id = data.get('user_id')

    if requesting_user_id is None:
        return jsonify({"message": "User ID is required for deletion."}), 400

    try:
        # Verify ownership and get category_id for updating count
        cursor.execute("SELECT user_id, category_id FROM items WHERE item_id = %s", (item_id,))
        item = cursor.fetchone()

        if not item:
            return jsonify({"message": "Item not found."}), 404

        if item['user_id'] != requesting_user_id:
            app.logger.warning(f"Unauthorized delete attempt for item {item_id} by user {requesting_user_id}. Owner is {item['user_id']}.")
            return jsonify({"message": "Unauthorized. You can only delete your own items."}), 403

        item_category_id = item['category_id']

        # Delete the item
        cursor.execute("DELETE FROM items WHERE item_id = %s", (item_id,))

        # Decrement the total_items count in the categories table
        # Ensure total_items does not go below zero
        update_category_count_query = """
        UPDATE categories
        SET total_items = GREATEST(0, total_items - 1) 
        WHERE category_id = %s
        """
        cursor.execute(update_category_count_query, (item_category_id,))

        db_conn.commit()
        return jsonify({"message": "Item deleted successfully."})

    except mysql.connector.Error as err:
        db_conn.rollback()
        app.logger.error(f"Database error deleting item {item_id}: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        db_conn.rollback()
        app.logger.error(f"Unexpected error deleting item {item_id}: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

# ... (Keep your if __name__ == "__main__": block) ...


if __name__ == "__main__":
    app.run(debug=True, port=5000)