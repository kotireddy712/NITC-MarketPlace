from flask import Flask, request, jsonify, g
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
import cloudinary
import cloudinary.uploader
import os
import bcrypt
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- Database Connection Pool Configuration ---
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "1234",
    "database": "nitc_mp_db",
    "autocommit": False
}

try:
    db_pool = pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=5,
        **db_config
    )
    print("Database connection pool created successfully.")
except mysql.connector.Error as err:
    print(f"Error creating database connection pool: {err}")
    exit(1)

# --- Helper Functions for Database Connection Management ---
def get_db():
    if 'db' not in g:
        g.db = db_pool.get_connection()
        g.cursor = g.db.cursor(dictionary=True)
    return g.db

@app.teardown_appcontext
def close_db_connection(exception):
    db = g.pop('db', None)
    if db is not None and db.is_connected():
        g.cursor.close()
        db.close()

# --- Cloudinary Configuration ---
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'dnihh3gox'),
    api_key=os.getenv('CLOUDINARY_API_KEY', '369298749656953'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET', 'Ii-tTqA9hkgdr-cQGN1FLTOBue0')
)

# --- Existing Routes (Copy as is from your previous code) ---

@app.route("/signup", methods=["POST"])
def signup():
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
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
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
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
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
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
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
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
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
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

@app.route('/user/<int:user_id>/items', methods=['GET'])
def get_user_items(user_id):
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
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    data = request.json
    new_status = data.get('is_sold')
    requesting_user_id = data.get('user_id')
    if new_status is None or not isinstance(new_status, bool):
        return jsonify({"message": "Invalid 'is_sold' status provided. Must be true or false."}), 400
    if requesting_user_id is None:
        return jsonify({"message": "User ID is required to update status."}), 400
    try:
        cursor.execute("SELECT user_id FROM items WHERE item_id = %s", (item_id,))
        item = cursor.fetchone()
        if not item:
            return jsonify({"message": "Item not found."}), 404
        if item['user_id'] != requesting_user_id:
            return jsonify({"message": "Unauthorized. You can only update status for your own items."}), 403
        update_query = "UPDATE items SET is_sold = %s WHERE item_id = %s"
        cursor.execute(update_query, (new_status, item_id))
        db_conn.commit()
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
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    data = request.json
    requesting_user_id = data.get('user_id')
    if requesting_user_id is None:
        return jsonify({"message": "User ID is required for deletion."}), 400
    try:
        cursor.execute("SELECT user_id, category_id FROM items WHERE item_id = %s", (item_id,))
        item = cursor.fetchone()
        if not item:
            return jsonify({"message": "Item not found."}), 404
        if item['user_id'] != requesting_user_id:
            app.logger.warning(f"Unauthorized delete attempt for item {item_id} by user {requesting_user_id}. Owner is {item['user_id']}.")
            return jsonify({"message": "Unauthorized. You can only delete your own items."}), 403
        item_category_id = item['category_id']
        cursor.execute("DELETE FROM items WHERE item_id = %s", (item_id,))
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

@app.route('/api/user/<email>', methods=['GET'])
def get_user(email):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id, name, email, contact_number, photo_url FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if user:
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/api/user/<email>', methods=['PUT'])
def update_user(email):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    name = request.form.get('name')
    contact_number = request.form.get('contact_number')
    image_file = request.files.get('image')
    if not name or not contact_number:
        return jsonify({"message": "Missing name or contact number."}), 400
    photo_url = None
    if image_file:
        try:
            upload_result = cloudinary.uploader.upload(image_file)
            photo_url = upload_result.get('secure_url')
        except Exception as e:
            app.logger.error(f"Image upload failed for user {email}: {e}")
            return jsonify({"message": "Image upload failed."}), 500
    try:
        update_query = """
        UPDATE users
        SET name = %s,
            contact_number = %s
            {photo_clause}
        WHERE email = %s
        """
        photo_clause = ", photo_url = %s" if photo_url else ""
        final_query = update_query.format(photo_clause=photo_clause)
        params = (name, contact_number, photo_url, email) if photo_url else (name, contact_number, email)
        cursor.execute(final_query, params)
        conn.commit()
        return jsonify({
            "name": name,
            "email": email,
            "contact_number": contact_number,
            "photo_url": photo_url
        }), 200
    except Exception as e:
        conn.rollback()
        app.logger.error(f"Failed to update user {email}: {e}")
        return jsonify({"message": "Failed to update profile."}), 500

@app.route('/api/user/change-password', methods=['PUT'])
def change_password():
    data = request.json
    email = data.get('email')
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')
    if not email or not old_password or not new_password:
        return jsonify({'message': 'Missing fields'}), 400
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='1234',
            database='nitc_mp_db'
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        stored_hash = user['password']
        if not bcrypt.checkpw(old_password.encode('utf-8'), stored_hash.encode('utf-8')):
            return jsonify({'message': 'Old password is incorrect'}), 400
        new_hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute("UPDATE users SET password = %s WHERE email = %s", (new_hashed, email))
        conn.commit()
        return jsonify({'message': 'Password updated successfully'}), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'message': 'Server error'}), 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

# --- Lost & Found API Endpoints ---
@app.route('/lost_found/items', methods=['POST'])
def add_lost_found_item():
    """Handles listing a new lost or found item, including image upload to Cloudinary and database updates."""
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    user_id = request.form.get('user_id')
    listing_type = request.form.get('listing_type') # 'Lost' or 'Found'
    item_name = request.form.get('item_name')
    description = request.form.get('description')
    location_details = request.form.get('location_details')
    date_time_lost_found_str = request.form.get('date_time_lost_found')
    image_file = request.files.get('image')
    if not all([user_id, listing_type, item_name, date_time_lost_found_str]):
        return jsonify({"message": "Missing required fields: user_id, listing_type, item_name, date_time_lost_found."}), 400
    try:
        user_id = int(user_id)
        date_time_lost_found = datetime.fromisoformat(date_time_lost_found_str)
    except ValueError as e:
        return jsonify({"message": f"Invalid data type or format: {e}"}), 400
    if listing_type not in ['Lost', 'Found']:
        return jsonify({"message": "Invalid listing_type. Must be 'Lost' or 'Found'."}), 400
    image_url = None
    if image_file:
        try:
            upload_result = cloudinary.uploader.upload(image_file)
            image_url = upload_result.get('secure_url')
        except Exception as e:
            app.logger.error(f"Cloudinary upload failed for lost/found item {item_name}: {e}")
            return jsonify({"message": f"Image upload failed: {e}"}), 500
    try:
        insert_lost_found_query = """
        INSERT INTO lost_found_items (user_id, listing_type, item_name, description,
                                     location_details, date_time_lost_found, image_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_lost_found_query, (
            user_id, listing_type, item_name, description,
            location_details, date_time_lost_found, image_url
        ))
        db_conn.commit()
        return jsonify({"message": "Lost/Found item listed successfully!", "image_url": image_url}), 201
    except mysql.connector.Error as err:
        db_conn.rollback()
        app.logger.error(f"Database error listing lost/found item {item_name}: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        db_conn.rollback()
        app.logger.error(f"An unexpected error occurred listing lost/found item {item_name}: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

@app.route('/lost_found/all', methods=['GET'])
def get_all_lost_found_items():
    """Fetches all active lost and found items, including details of the poster."""
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)

    try:
        query = """
        SELECT
            lfi.item_id,
            lfi.listing_type,
            lfi.item_name,
            lfi.description,
            lfi.location_details,
            lfi.date_time_lost_found,
            lfi.image_url,
            lfi.status,
            lfi.posted_at,
            u.name AS user_name,
            u.contact_number AS user_contact_number,
            u.email AS user_email
        FROM lost_found_items lfi
        JOIN users u ON lfi.user_id = u.user_id
        WHERE lfi.status = 'Active' -- Only show active listings by default
        ORDER BY lfi.posted_at DESC
        """
        cursor.execute(query)
        items = cursor.fetchall()

        # Format datetime objects for JSON serialization
        for item in items:
            if isinstance(item['date_time_lost_found'], datetime):
                item['date_time_lost_found'] = item['date_time_lost_found'].isoformat()
            if isinstance(item['posted_at'], datetime):
                item['posted_at'] = item['posted_at'].isoformat()

        return jsonify(items)

    except mysql.connector.Error as err:
        app.logger.error(f"Database error fetching all lost and found items: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        app.logger.error(f"An unexpected error occurred fetching all lost and found items: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

# ✅ NEW API ENDPOINT: Get user's own lost and found listings
@app.route('/lost_found/user/<int:user_id>', methods=['GET'])
def get_user_lost_found_items(user_id):
    """Fetches all lost and found items posted by a specific user."""
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)

    try:
        query = """
        SELECT
            lfi.item_id,
            lfi.listing_type,
            lfi.item_name,
            lfi.description,
            lfi.location_details,
            lfi.date_time_lost_found,
            lfi.image_url,
            lfi.status,
            lfi.posted_at
        FROM lost_found_items lfi
        WHERE lfi.user_id = %s
        ORDER BY lfi.posted_at DESC
        """
        cursor.execute(query, (user_id,))
        items = cursor.fetchall()

        # Format datetime objects for JSON serialization
        for item in items:
            if isinstance(item['date_time_lost_found'], datetime):
                item['date_time_lost_found'] = item['date_time_lost_found'].isoformat()
            if isinstance(item['posted_at'], datetime):
                item['posted_at'] = item['posted_at'].isoformat()

        return jsonify(items)

    except mysql.connector.Error as err:
        app.logger.error(f"Database error fetching lost and found items for user {user_id}: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        app.logger.error(f"An unexpected error occurred fetching lost and found items for user {user_id}: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

# ✅ NEW API ENDPOINT: Update status of a lost and found item
@app.route('/lost_found/items/<int:item_id>/status', methods=['PATCH'])
def update_lost_found_item_status(item_id):
    """Updates the status of a lost/found item (e.g., Active to Claimed/Returned)."""
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    data = request.json
    new_status = data.get('new_status')
    requesting_user_id = data.get('user_id') # User ID from frontend to verify ownership

    if not all([new_status, requesting_user_id]):
        return jsonify({"message": "Missing required fields: new_status or user_id."}), 400

    if new_status not in ['Active', 'Claimed', 'Returned', 'Archived']:
        return jsonify({"message": "Invalid status provided. Must be 'Active', 'Claimed', 'Returned', or 'Archived'."}), 400

    try:
        # First, verify ownership of the item
        cursor.execute("SELECT user_id FROM lost_found_items WHERE item_id = %s", (item_id,))
        item = cursor.fetchone()

        if not item:
            return jsonify({"message": "Lost/Found item not found."}), 404
        if item['user_id'] != int(requesting_user_id):
            app.logger.warning(f"Unauthorized status update attempt for lost/found item {item_id} by user {requesting_user_id}. Owner is {item['user_id']}.")
            return jsonify({"message": "Unauthorized. You can only update the status for your own listings."}), 403

        # Prepare for update
        update_query = "UPDATE lost_found_items SET status = %s"
        params = [new_status]

        # If status is changing to Claimed or Returned, set resolved_at
        if new_status in ['Claimed', 'Returned']:
            update_query += ", resolved_at = %s"
            params.append(datetime.now())
        elif new_status == 'Active': # If setting back to Active, clear resolved_at
            update_query += ", resolved_at = NULL"

        update_query += " WHERE item_id = %s"
        params.append(item_id)

        cursor.execute(update_query, tuple(params))
        db_conn.commit()

        return jsonify({"message": f"Item status updated to '{new_status}' successfully."})

    except mysql.connector.Error as err:
        db_conn.rollback()
        app.logger.error(f"Database error updating lost/found item status for item {item_id}: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        db_conn.rollback()
        app.logger.error(f"An unexpected error occurred updating lost/found item status for item {item_id}: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

# ✅ NEW API ENDPOINT: Delete a lost and found item
@app.route('/lost_found/items/<int:item_id>', methods=['DELETE'])
def delete_lost_found_item(item_id):
    """Deletes a lost/found item."""
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    data = request.json
    requesting_user_id = data.get('user_id') # User ID from frontend to verify ownership

    if requesting_user_id is None:
        return jsonify({"message": "User ID is required for deletion."}), 400

    try:
        # First, verify ownership of the item
        cursor.execute("SELECT user_id FROM lost_found_items WHERE item_id = %s", (item_id,))
        item = cursor.fetchone()

        if not item:
            return jsonify({"message": "Lost/Found item not found."}), 404
        if item['user_id'] != int(requesting_user_id):
            app.logger.warning(f"Unauthorized delete attempt for lost/found item {item_id} by user {requesting_user_id}. Owner is {item['user_id']}.")
            return jsonify({"message": "Unauthorized. You can only delete your own listings."}), 403

        # Proceed with deletion
        delete_query = "DELETE FROM lost_found_items WHERE item_id = %s"
        cursor.execute(delete_query, (item_id,))
        db_conn.commit()

        return jsonify({"message": "Lost/Found listing deleted successfully."})

    except mysql.connector.Error as err:
        db_conn.rollback()
        app.logger.error(f"Database error deleting lost/found item {item_id}: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        db_conn.rollback()
        app.logger.error(f"An unexpected error occurred deleting lost/found item {item_id}: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)