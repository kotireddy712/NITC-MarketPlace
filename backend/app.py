from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Replace with your own DB credentials
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="nitc_mp_db"
)
cursor = db.cursor(dictionary=True)

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
        return jsonify({"message": "Email not authorized for signup."}), 403

    if user["password"]:
        return jsonify({"message": "User already signed up."}), 409

    cursor.execute(
        "UPDATE users SET name=%s, contact_number=%s, password=%s WHERE email=%s",
        (name, contact, password, email)
    )
    db.commit()
    return jsonify({"message": "Signup successful!"})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    cursor.execute("SELECT * FROM users WHERE email=%s AND password IS NOT NULL", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "No such user or not signed up yet."}), 401
    if user["password"] != password:
        return jsonify({"message": "Incorrect password"}), 403

    return jsonify({"message": "Login successful!", "user": user})
@app.route('/items', methods=['GET'])
def get_items():
    category = request.args.get('category')
    if not category:
        return jsonify({'message': 'Category required'}), 400

    cursor.execute("SELECT * FROM items WHERE category = %s AND is_sold = FALSE", (category,))
    items = cursor.fetchall()
    return jsonify(items)
if __name__ == "__main__":
    app.run(debug=True)
