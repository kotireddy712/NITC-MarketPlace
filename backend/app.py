# from flask import Flask, request, jsonify, g, session
# from flask_cors import CORS
# import mysql.connector
# from mysql.connector import pooling
# import cloudinary
# import cloudinary.uploader
# import os
# import bcrypt
# from datetime import datetime, timedelta
# from flask_mail import Mail, Message
# import secrets
# import string
# import logging
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# app = Flask(__name__)
# # Configure CORS to allow credentials and specify allowed origins
# CORS(app, supports_credentials=True, origins=[
#     "https://nitc-marketplace.netlify.app"  # Your deployed Netlify frontend URL
# ])

# # --- Configure Logging ---
# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
# app.logger.setLevel(logging.DEBUG) # Set app logger to DEBUG level

# # Add secret key for sessions
# # IMPORTANT: Change this to a strong, random string in production!
# # This key is vital for securely signing session cookies.
# # app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-super-secret-key-please-change-this-in-production-!!!!!!')
# # Add secret key for sessions (read from .env)
# app.config['SECRET_KEY'] = os.getenv(
#     'SECRET_KEY', 
#     'fallback-secret-key-if-env-not-set'
# )

# # Session cookie configuration
# # CRITICAL: For cross-origin frontend (Netlify HTTPS) and backend,
# # set SAMESITE to 'None' and SECURE to True.
# # Browsers will only send 'SameSite=None' cookies if 'Secure=True'.
# app.config['SESSION_COOKIE_SAMESITE'] = 'None'
# app.config['SESSION_COOKIE_SECURE'] = True # MUST BE TRUE FOR HTTPS DEPLOYMENT

# # --- Email Configuration (using environment variables) ---
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USE_SSL'] = False # TLS is used, so SSL should be False
# app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
# app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
# app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

# mail = Mail(app)

# # --- Database Connection Pool Configuration (using environment variables) ---
# db_config = {
#     "host": os.environ["DB_HOST"],
#     "port": int(os.environ["DB_PORT"]),
#     "user": os.environ["DB_USER"],
#     "password": os.environ["DB_PASSWORD"],
#     "database": os.environ["DB_NAME"],
#     "autocommit": False
# }

# try:
#     db_pool = pooling.MySQLConnectionPool(
#         pool_name="mypool",
#         pool_size=5, # Number of connections in the pool
#         **db_config
#     )
#     app.logger.info("Database connection pool created successfully.")
# except mysql.connector.Error as err:
#     app.logger.critical(f"Error creating database connection pool: {err}")
#     # Exit if database connection cannot be established at startup, as the app won't function
#     exit(1)

# # --- Helper Functions for Database Connection Management ---
# def get_db():
#     """
#     Provides a database connection from the pool.
#     Stores the connection and cursor in Flask's `g` object for request-scoped access.
#     """
#     if 'db' not in g:
#         g.db = db_pool.get_connection()
#         # Cursor returns rows as dictionaries for easier access by column name
#         g.cursor = g.db.cursor(dictionary=True)
#     return g.db

# @app.teardown_appcontext
# def close_db_connection(exception):
#     """
#     Closes the database connection at the end of each request.
#     Ensures resources are properly released.
#     """
#     db = g.pop('db', None)
#     if db is not None and db.is_connected():
#         app.logger.debug("Closing database connection.")
#         g.cursor.close()
#         db.close()

# # --- Cloudinary Configuration (Optional: for image uploads) ---
# cloudinary.config(
#     cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
#     api_key=os.getenv('CLOUDINARY_API_KEY'),
#     api_secret=os.getenv('CLOUDINARY_API_SECRET')
# )

# # --- OTP Helper Functions ---
# def generate_otp(length=6):
#     """Generates a secure random 6-digit OTP."""
#     return ''.join(secrets.choice(string.digits) for _ in range(length))

# def send_otp_email(email, otp, name=None):
#     """
#     Sends an OTP to the specified email address using Flask-Mail.
#     Includes both HTML and plain text versions of the email.
#     """
#     try:
#         subject = "NITC Marketplace - Email Verification OTP"
        
#         # HTML email template for a better user experience
#         html_body = f"""
#         <!DOCTYPE html>
#         <html>
#         <head>
#             <style>
#                 body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }}
#                 .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
#                 .header {{ text-align: center; color: #333; margin-bottom: 30px; }}
#                 .otp-code {{ font-size: 32px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0; letter-spacing: 3px; }}
#                 .info {{ color: #666; margin: 20px 0; }}
#                 .warning {{ color: #dc3545; font-size: 14px; margin-top: 20px; }}
#                 .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }}
#             </style>
#         </head>
#         <body>
#             <div class="container">
#                 <div class="header">
#                     <h1>🎓 NITC Marketplace</h1>
#                     <h2>Email Verification Required</h2>
#                 </div>
                
#                 <p>Hello{' ' + name if name else ''},</p>
                
#                 <p class="info">Welcome to NITC Marketplace! To complete your registration, please verify your email address using the OTP below:</p>
                
#                 <div class="otp-code">{otp}</div>
                
#                 <p class="info">This OTP is valid for <strong>10 minutes</strong> only. Please enter it in the verification form to proceed with your signup.</p>
                
#                 <div class="warning">
#                     <strong>Security Notice:</strong>
#                     <ul>
#                         <li>Never share this OTP with anyone</li>
#                         <li>NITC Marketplace staff will never ask for your OTP</li>
#                         <li>If you didn't request this, please ignore this email</li>
#                     </ul>
#                 </div>
                
#                 <div class="footer">
#                     <p>This email was sent from NITC Marketplace</p>
#                     <p>If you have any questions, please contact our support team</p>
#                 </div>
#             </div>
#         </body>
#         </html>
#         """
        
#         # Plain text version for email clients that prefer it or don't render HTML
#         text_body = f"""
#         NITC Marketplace - Email Verification OTP
        
#         Hello{' ' + name if name else ''},
        
#         Welcome to NITC Marketplace! To complete your registration, please verify your email address.
        
#         Your OTP is: {otp}
        
#         This OTP is valid for 10 minutes only. Please enter it in the verification form to proceed with your signup.
        
#         Security Notice:
#         - Never share this OTP with anyone
#         - NITC Marketplace staff will never ask for your OTP
#         - If you didn't request this, please ignore this email
        
#         Best regards,
#         NITC Marketplace Team
#         """
        
#         msg = Message(
#             subject=subject,
#             recipients=[email],
#             body=text_body,
#             html=html_body
#         )
        
#         mail.send(msg)
#         app.logger.info(f"OTP email sent successfully to {email}")
#         return True
        
#     except Exception as e:
#         app.logger.error(f"Error sending email to {email}: {e}", exc_info=True)
#         return False

# def store_otp(email, otp):
#     """
#     Stores the OTP in the database for the given email with a 10-minute expiration.
#     Deletes any existing OTP for the same email to ensure only one is active.
#     """
#     db_conn = get_db()
#     cursor = db_conn.cursor(dictionary=True)
    
#     try:
#         # Delete any existing, pending OTP for this email
#         cursor.execute("DELETE FROM email_otp WHERE email = %s", (email,))
#         app.logger.debug(f"Deleted existing OTP for {email}")
        
#         # Store the new OTP with a 10-minute expiration timestamp
#         expires_at = datetime.now() + timedelta(minutes=10)
#         cursor.execute(
#             "INSERT INTO email_otp (email, otp, expires_at) VALUES (%s, %s, %s)",
#             (email, otp, expires_at)
#         )
#         db_conn.commit() # Commit the transaction to save changes to the database
#         app.logger.info(f"OTP stored successfully for {email}")
#         return True
        
#     except mysql.connector.Error as err:
#         db_conn.rollback() # Rollback the transaction on error
#         app.logger.error(f"Database error storing OTP for {email}: {err}", exc_info=True)
#         return False

# def verify_otp(email, otp):
#     """
#     Verifies the provided OTP against the one stored in the database for the given email.
#     Checks for expiration and correctness. Deletes the OTP after successful verification.
#     """
#     db_conn = get_db()
#     cursor = db_conn.cursor(dictionary=True)
    
#     try:
#         cursor.execute(
#             "SELECT otp, expires_at FROM email_otp WHERE email = %s",
#             (email,)
#         )
#         result = cursor.fetchone()
        
#         if not result:
#             app.logger.warning(f"No OTP found for {email} or already used/expired.")
#             return False # No OTP found for this email (perhaps already used or expired and cleaned up)
            
#         stored_otp = result['otp']
#         expires_at = result['expires_at']
        
#         # Check if the OTP has expired
#         if datetime.now() > expires_at:
#             app.logger.warning(f"OTP for {email} has expired. Expiration time: {expires_at}")
#             # Clean up expired OTP from the database
#             cursor.execute("DELETE FROM email_otp WHERE email = %s", (email,))
#             db_conn.commit()
#             return False
            
#         # Verify if the provided OTP matches the stored one
#         if stored_otp == otp:
#             app.logger.info(f"OTP verified successfully for {email}.")
#             # Clean up the used OTP immediately after successful verification
#             cursor.execute("DELETE FROM email_otp WHERE email = %s", (email,))
#             db_conn.commit()
#             return True
            
#         app.logger.warning(f"Invalid OTP provided for {email}. Stored: {stored_otp}, Provided: {otp}")
#         return False # Provided OTP does not match
        
#     except mysql.connector.Error as err:
#         app.logger.error(f"Database error verifying OTP for {email}: {err}", exc_info=True)
#         return False

# # --- OTP and Signup Flow Endpoints ---

# @app.route("/send-otp", methods=["POST"])
# def send_otp_route():
#     """
#     Endpoint to send an OTP to a user's email for registration or password reset (if applicable).
#     Handles logic for existing users vs. new preliminary users.
#     """
#     db_conn = get_db()
#     cursor = db_conn.cursor(dictionary=True)
#     data = request.json
#     email = data.get("email")

#     app.logger.debug(f"Received /send-otp request for email: {email}")

#     if not email:
#         return jsonify({"message": "Email is required."}), 400

#     # Enforce @nitc.ac.in domain for institutional accounts
#     if not email.endswith("@nitc.ac.in"):
#         app.logger.warning(f"Invalid email domain for OTP request: {email}")
#         return jsonify({"message": "Only @nitc.ac.in emails are allowed for signup."}), 400

#     try:
#         # Step 1: Check if the email exists in the `users` table.
#         cursor.execute("SELECT user_id, name, password, is_disabled FROM users WHERE email=%s", (email,))
#         user = cursor.fetchone()

#         if user:
#             # User exists
#             if user.get("is_disabled") == 1:
#                 app.logger.warning(f"OTP not sent: Account {email} is disabled.")
#                 return jsonify({"message": "Your account is disabled. Please contact support."}), 403

#             if user.get("password") is not None and user.get("password") != '':
#                 # User exists and has a non-null password - DO NOT SEND OTP for signup, suggest login
#                 app.logger.info(f"OTP not sent: User {email} already signed up.")
#                 return jsonify({"message": "User already signed up. Please use login instead."}), 409
#             else:
#                 # User exists but password is NULL - PROCEED to send OTP (implies incomplete signup)
#                 app.logger.info(f"User {email} found with NULL password. Proceeding to send OTP.")
#         else:
#             # User does NOT exist - CREATE a new preliminary user row and PROCEED to send OTP
#             app.logger.info(f"Email {email} not found. Creating preliminary user entry.")
#             try:
#                 # Insert a new row with default values for name, contact_number, photo_url, role, is_disabled
#                 # and NULL password, which will be updated during signup completion.
#                 cursor.execute("""
#                     INSERT INTO users (email, password, name, contact_number, photo_url, role, is_disabled)
#                     VALUES (%s, NULL, NULL, NULL, %s, %s, %s)
#                 """, (email, 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', 'user', False))
#                 db_conn.commit() # Commit the new user entry
#                 app.logger.info(f"Preliminary user row created for {email}.")
#             except mysql.connector.Error as err:
#                 db_conn.rollback() # Rollback if preliminary user creation fails
#                 # Handle cases where duplicate entry might occur (e.g., race condition)
#                 if err.errno == 1062: # MySQL error code for duplicate entry for unique key
#                     app.logger.warning(f"Attempted to create duplicate user for {email}. Re-fetching user to verify state.")
#                     # Re-fetch the user to confirm their state and proceed if they still have a NULL password
#                     cursor.execute("SELECT user_id, name, password, is_disabled FROM users WHERE email=%s", (email,))
#                     user = cursor.fetchone()
#                     if user and (user.get("password") is None or user.get("password") == '') and user.get("is_disabled") == 0:
#                         app.logger.info(f"Successfully recovered from duplicate entry for {email}. Proceeding with OTP for NULL password user.")
#                     else:
#                         app.logger.error(f"Duplicate entry error for {email} but user already has a password, is disabled, or other issue. Error: {err}", exc_info=True)
#                         return jsonify({"message": "User already registered or a system error occurred. Please try logging in."}), 409
#                 else:
#                     app.logger.error(f"Database error creating preliminary user for {email}: {err}", exc_info=True)
#                     return jsonify({"message": f"Database error: {err}"}), 500

#         # At this point, the email has passed the domain check, and either:
#         # 1. An existing user with NULL password was found (ready for signup completion).
#         # 2. A new preliminary user (with NULL password and defaults) was created.
#         # Now, proceed to generate and send OTP.
#         otp = generate_otp()
        
#         if store_otp(email, otp):
#             # Get the name from the existing user record if it exists, otherwise use None for email personalization
#             user_name = user.get('name') if user and 'name' in user else None 
#             if send_otp_email(email, otp, user_name):
#                 app.logger.info(f"OTP successfully sent and stored for {email}.")
#                 return jsonify({
#                     "message": "OTP sent successfully to your email. Please check your inbox.",
#                     "email": email 
#                 })
#             else:
#                 app.logger.error(f"Failed to send OTP email for {email}.")
#                 return jsonify({"message": "Failed to send OTP. Please try again."}), 500
#         else:
#             app.logger.error(f"Failed to store OTP for {email} in database.")
#             return jsonify({"message": "Failed to generate OTP. Please try again."}), 500

#     except mysql.connector.Error as err:
#         app.logger.error(f"Database error during OTP operation for {email}: {err}", exc_info=True)
#         return jsonify({"message": f"Database error: {err}"}), 500

#     except Exception as e:
#         app.logger.error(f"Unexpected error during OTP operation for {email}: {e}", exc_info=True)
#         return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

# @app.route("/verify-otp", methods=["POST"])
# def verify_otp_route():
#     """
#     Endpoint to verify the OTP entered by the user.
#     If successful, sets session variables to indicate OTP verification.
#     """
#     data = request.json
#     email = data.get("email")
#     otp = data.get("otp")

#     app.logger.debug(f"Received /verify-otp request for email: {email}, OTP: {otp}")
#     # Log session state before attempting verification
#     app.logger.debug(f"Session before verification: otp_verified={session.get('otp_verified')}, verified_email={session.get('verified_email')}")

#     if not all([email, otp]):
#         return jsonify({"message": "Email and OTP are required."}), 400

#     try:
#         if verify_otp(email, otp):
#             # If OTP is valid, store verification status in session
#             session['verified_email'] = email
#             session['otp_verified'] = True
#             app.logger.info(f"OTP verified successfully for {email}. Session updated.")
#             # Log session state after successful verification
#             app.logger.debug(f"Session after verification: otp_verified={session.get('otp_verified')}, verified_email={session.get('verified_email')}")
#             return jsonify({
#                 "message": "OTP verified successfully! Please proceed to complete your signup details.",
#                 "verified": True,
#                 "email": email 
#             })
#         else:
#             app.logger.warning(f"OTP verification failed for {email}.")
#             return jsonify({
#                 "message": "Invalid or expired OTP. Please try again.",
#                 "verified": False
#             }), 400

#     except Exception as e:
#         app.logger.error(f"Error verifying OTP for {email}: {e}", exc_info=True)
#         return jsonify({"message": "An error occurred during OTP verification."}), 500

# @app.route("/signup", methods=["POST"])
# def signup():
#     """
#     Endpoint for a user to complete their signup after successful OTP verification.
#     Updates the preliminary user record with full details and a hashed password.
#     """
#     db_conn = get_db()
#     cursor = db_conn.cursor(dictionary=True)
#     data = request.json

#     email = data.get("email")
#     password = data.get("password")
#     name = data.get("name")
#     contact_number = data.get("phone")  # Frontend sends 'phone' for contact number

#     app.logger.debug(f"Received /signup request for email: {email}")
#     # Log current session state for debugging
#     app.logger.debug(f"Session state for signup: OTP Verified: {session.get('otp_verified')}, Verified Email: {session.get('verified_email')}")

#     if not all([email, password, name, contact_number]):
#         app.logger.warning("Missing fields for signup.")
#         return jsonify({"message": "All fields are required."}), 400

#     # Step 1: Crucial check to ensure OTP was verified for this email in the current session.
#     # This prevents users from skipping OTP verification and ensures the flow.
#     if 'otp_verified' not in session or not session.get('otp_verified') or session.get('verified_email') != email:
#         app.logger.warning(f"Signup attempt for {email} without proper OTP verification. "
#                             f"Session state: otp_verified={session.get('otp_verified')}, verified_email={session.get('verified_email')}")
#         return jsonify({"message": "OTP verification required before signup."}), 401

#     try:
#         # Before updating, ensure the user exists and is not already fully signed up or disabled
#         cursor.execute("SELECT password, is_disabled FROM users WHERE email = %s", (email,))
#         user_record = cursor.fetchone()

#         if not user_record:
#             app.logger.warning(f"Signup failed: Email {email} not found in users table for update, despite OTP verification. This is unexpected.")
#             return jsonify({"message": "User email not found or not authorized for signup completion. Please request OTP again."}), 404
        
#         if user_record.get("is_disabled") == 1:
#             app.logger.warning(f"Signup attempt for disabled account: {email}.")
#             return jsonify({"message": "Account is disabled. Please contact support."}), 403

#         if user_record.get("password") is not None and user_record.get("password") != '':
#             app.logger.warning(f"Signup attempt for {email} which already has a password set.")
#             return jsonify({"message": "Account already has a password. Please log in."}), 409

#         # Step 2: Hash the password using bcrypt for security.
#         hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

#         # Step 3: Update the `users` table with the new password, name, and contact number.
#         # This completes the user registration from the preliminary row created during /send-otp.
#         cursor.execute("""
#             UPDATE users
#             SET password = %s, name = %s, contact_number = %s
#             WHERE email = %s
#         """, (hashed_pw, name, contact_number, email))
        
#         # Check if any row was updated. If not, it indicates a logic error or race condition.
#         if cursor.rowcount == 0:
#             app.logger.error(f"Signup update failed: No rows updated for email {email}. This shouldn't happen after preliminary insert and session verification.")
#             db_conn.rollback() # Rollback on update failure
#             return jsonify({"message": "Failed to complete signup due to an internal error."}), 500

#         db_conn.commit() # Commit the changes to the database

#         # Step 4: Clear session variables after successful signup to prevent reuse
#         # and ensure the user must log in explicitly.
#         session.pop('otp_verified', None)
#         session.pop('verified_email', None)
#         app.logger.info(f"Signup successful for {email}. Session cleared.")

#         return jsonify({"message": "Signup successful. You can now log in."}), 200

#     except mysql.connector.Error as err:
#         db_conn.rollback() # Rollback on database error
#         app.logger.error(f"Database error during signup for {email}: {err}", exc_info=True)
#         return jsonify({"message": f"Database error during signup: {err}"}), 500

#     except Exception as e:
#         app.logger.error(f"Unexpected error during signup for {email}: {e}", exc_info=True)
#         return jsonify({"message": f"An unexpected error occurred during signup: {e}"}), 500

# # --- Basic Login Route (from your previous code) ---
# # --- Basic Login Route ---
# # @app.route("/login", methods=["POST"])
# # def login():
# #     """Handles user login."""
# #     db_conn = get_db()
# #     cursor = db_conn.cursor(dictionary=True)
# #     data = request.json
# #     email = data.get("email")
# #     password = data.get("password")

# #     if not all([email, password]):
# #         return jsonify({"message": "Missing required fields."}), 400

# #     try:
# #         # Fetch user including the hashed password and is_disabled status
# #         cursor.execute(
# #             "SELECT user_id, name, email, password, role, is_disabled FROM users WHERE email=%s",
# #             (email,)
# #         )
# #         user = cursor.fetchone()

# #         if not user:
# #             return jsonify({"message": "Invalid credentials or user not found."}), 401

# #         # Check if account is disabled
# #         if user.get("is_disabled") == 1:
# #             return jsonify({"message": "Account is disabled. Please contact support."}), 403

# #         # Check if password exists (i.e., user has completed signup)
# #         if user["password"] is None or user["password"] == '':
# #             return jsonify({"message": "Account not fully signed up. Please complete signup first."}), 403

# #         # Verify the password using bcrypt
# #         if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
# #             return jsonify({"message": "Incorrect password."}), 403

# #         # Password is correct, return user info (excluding password hash)
# #         return jsonify({
# #             "message": "Login successful!",
# #             "user_id": user["user_id"],
# #             "name": user["name"],
# #             "email": user["email"],
# #             "is_admin": user["role"] == "admin" # Provide a boolean for easy frontend check
# #         })

# #     except mysql.connector.Error as err:
# #         app.logger.error(f"Database error during login for {email}: {err}")
# #         return jsonify({"message": f"Database error during login: {err}"}), 500

# #     except Exception as e:
# #         app.logger.error(f"Unexpected error during login for {email}: {e}")
# #         return jsonify({"message": f"An unexpected error occurred during login: {e}"}), 500
# @app.route("/login", methods=["POST"])
# def login():
#     """Handles user login and sets session data upon successful authentication."""
#     db_conn = get_db()
#     cursor = db_conn.cursor(dictionary=True)
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")

#     if not all([email, password]):
#         return jsonify({"message": "Missing required fields."}), 400

#     try:
#         # Fetch user including the hashed password and is_disabled status
#         cursor.execute(
#             "SELECT user_id, name, email, password, role, is_disabled FROM users WHERE email=%s",
#             (email,)
#         )
#         user = cursor.fetchone()

#         if not user:
#             return jsonify({"message": "Invalid credentials or user not found."}), 401

#         # Check if account is disabled
#         if user.get("is_disabled") == 1:
#             return jsonify({"message": "Account is disabled. Please contact support."}), 403

#         # Check if password exists (i.e., user has completed signup)
#         if user["password"] is None or user["password"] == '':
#             return jsonify({"message": "Account not fully signed up. Please complete signup first."}), 403

#         # Verify the password using bcrypt
#         if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
#             return jsonify({"message": "Incorrect password."}), 403

#         # Password is correct, set session variables
#         session['user_id'] = user["user_id"]
#         session['name'] = user["name"]
#         session['email'] = user["email"]
#         session['role'] = user["role"] # Store role for authorization checks later

#         # Password is correct, return user info (excluding password hash)
#         return jsonify({
#             "message": "Login successful!",
#             "user_id": user["user_id"], # Optionally return these if frontend still needs them immediately
#             "name": user["name"],
#             "email": user["email"],
#             "is_admin": user["role"] == "admin" # Provide a boolean for easy frontend check
#         })

#     except mysql.connector.Error as err:
#         app.logger.error(f"Database error during login for {email}: {err}")
#         return jsonify({"message": f"Database error during login: {err}"}), 500

#     except Exception as e:
#         app.logger.error(f"Unexpected error during login for {email}: {e}")
#         return jsonify({"message": f"An unexpected error occurred during login: {e}"}), 500
from flask import Flask, request, jsonify, g, session
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
import cloudinary
import cloudinary.uploader
import os
import bcrypt
from datetime import datetime, timedelta
from flask_mail import Mail, Message
import secrets
import string
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# --- CORS Configuration (FIXED) ---
# Configure CORS to allow credentials and specify allowed origins
CORS(app, supports_credentials=True, origins=[
    "https://nitc-marketplace.netlify.app",  # Your deployed Netlify frontend URL
    "http://localhost:3000",                 # Local development
    "http://127.0.0.1:3000",                # Local development alternative
    "http://localhost:5173",                 # Vite dev server
    "http://127.0.0.1:5173"                  # Vite dev server alternative
])

# --- Configure Logging ---
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
app.logger.setLevel(logging.DEBUG) # Set app logger to DEBUG level

# --- Session Configuration (FIXED) ---
# Add secret key for sessions (read from .env)
app.config['SECRET_KEY'] = os.getenv(
    'SECRET_KEY', 
    'fallback-secret-key-if-env-not-set'
)

# Enhanced session cookie configuration for cross-origin support
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = os.getenv('FLASK_ENV', 'development') == 'production'  # Only HTTPS in production
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Security: prevent XSS
app.config['SESSION_COOKIE_DOMAIN'] = None  # Let Flask handle domain automatically
app.config['SESSION_COOKIE_PATH'] = '/'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)  # Session expires in 7 days

# --- Email Configuration (using environment variables) ---
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False # TLS is used, so SSL should be False
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail = Mail(app)

# --- Database Connection Pool Configuration (using environment variables) ---
db_config = {
    "host": os.environ["DB_HOST"],
    "port": int(os.environ["DB_PORT"]),
    "user": os.environ["DB_USER"],
    "password": os.environ["DB_PASSWORD"],
    "database": os.environ["DB_NAME"],
    "autocommit": False
}

try:
    db_pool = pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=5, # Number of connections in the pool
        **db_config
    )
    app.logger.info("Database connection pool created successfully.")
except mysql.connector.Error as err:
    app.logger.critical(f"Error creating database connection pool: {err}")
    # Exit if database connection cannot be established at startup, as the app won't function
    exit(1)

# --- Helper Functions for Database Connection Management ---
def get_db():
    """
    Provides a database connection from the pool.
    Stores the connection and cursor in Flask's `g` object for request-scoped access.
    """
    if 'db' not in g:
        g.db = db_pool.get_connection()
        # Cursor returns rows as dictionaries for easier access by column name
        g.cursor = g.db.cursor(dictionary=True)
    return g.db

@app.teardown_appcontext
def close_db_connection(exception):
    """
    Closes the database connection at the end of each request.
    Ensures resources are properly released.
    """
    db = g.pop('db', None)
    if db is not None and db.is_connected():
        app.logger.debug("Closing database connection.")
        g.cursor.close()
        db.close()

# --- Cloudinary Configuration (Optional: for image uploads) ---
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# --- OTP Helper Functions ---
def generate_otp(length=6):
    """Generates a secure random 6-digit OTP."""
    return ''.join(secrets.choice(string.digits) for _ in range(length))

def send_otp_email(email, otp, name=None):
    """
    Sends an OTP to the specified email address using Flask-Mail.
    Includes both HTML and plain text versions of the email.
    """
    try:
        subject = "NITC Marketplace - Email Verification OTP"
        
        # HTML email template for a better user experience
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ text-align: center; color: #333; margin-bottom: 30px; }}
                .otp-code {{ font-size: 32px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0; letter-spacing: 3px; }}
                .info {{ color: #666; margin: 20px 0; }}
                .warning {{ color: #dc3545; font-size: 14px; margin-top: 20px; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>NITC Marketplace</h1>
                    <h2>Email Verification Required</h2>
                </div>
                
                <p>Hello{' ' + name if name else ''},</p>
                
                <p class="info">Welcome to NITC Marketplace! To complete your registration, please verify your email address using the OTP below:</p>
                
                <div class="otp-code">{otp}</div>
                
                <p class="info">This OTP is valid for <strong>10 minutes</strong> only. Please enter it in the verification form to proceed with your signup.</p>
                
                <div class="warning">
                    <strong>Security Notice:</strong>
                    <ul>
                        <li>Never share this OTP with anyone</li>
                        <li>NITC Marketplace staff will never ask for your OTP</li>
                        <li>If you didn't request this, please ignore this email</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>This email was sent from NITC Marketplace</p>
                    <p>If you have any questions, please contact our support team</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version for email clients that prefer it or don't render HTML
        text_body = f"""
        NITC Marketplace - Email Verification OTP
        
        Hello{' ' + name if name else ''},
        
        Welcome to NITC Marketplace! To complete your registration, please verify your email address.
        
        Your OTP is: {otp}
        
        This OTP is valid for 10 minutes only. Please enter it in the verification form to proceed with your signup.
        
        Security Notice:
        - Never share this OTP with anyone
        - NITC Marketplace staff will never ask for your OTP
        - If you didn't request this, please ignore this email
        
        Best regards,
        NITC Marketplace Team
        """
        
        msg = Message(
            subject=subject,
            recipients=[email],
            body=text_body,
            html=html_body
        )
        
        mail.send(msg)
        app.logger.info(f"OTP email sent successfully to {email}")
        return True
        
    except Exception as e:
        app.logger.error(f"Error sending email to {email}: {e}", exc_info=True)
        return False

def store_otp(email, otp):
    """
    Stores the OTP in the database for the given email with a 10-minute expiration.
    Deletes any existing OTP for the same email to ensure only one is active.
    """
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    
    try:
        # Delete any existing, pending OTP for this email
        cursor.execute("DELETE FROM email_otp WHERE email = %s", (email,))
        app.logger.debug(f"Deleted existing OTP for {email}")
        
        # Store the new OTP with a 10-minute expiration timestamp
        expires_at = datetime.now() + timedelta(minutes=10)
        cursor.execute(
            "INSERT INTO email_otp (email, otp, expires_at) VALUES (%s, %s, %s)",
            (email, otp, expires_at)
        )
        db_conn.commit() # Commit the transaction to save changes to the database
        app.logger.info(f"OTP stored successfully for {email}")
        return True
        
    except mysql.connector.Error as err:
        db_conn.rollback() # Rollback the transaction on error
        app.logger.error(f"Database error storing OTP for {email}: {err}", exc_info=True)
        return False

def verify_otp(email, otp):
    """
    Verifies the provided OTP against the one stored in the database for the given email.
    Checks for expiration and correctness. Deletes the OTP after successful verification.
    """
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    
    try:
        cursor.execute(
            "SELECT otp, expires_at FROM email_otp WHERE email = %s",
            (email,)
        )
        result = cursor.fetchone()
        
        if not result:
            app.logger.warning(f"No OTP found for {email} or already used/expired.")
            return False # No OTP found for this email (perhaps already used or expired and cleaned up)
            
        stored_otp = result['otp']
        expires_at = result['expires_at']
        
        # Check if the OTP has expired
        if datetime.now() > expires_at:
            app.logger.warning(f"OTP for {email} has expired. Expiration time: {expires_at}")
            # Clean up expired OTP from the database
            cursor.execute("DELETE FROM email_otp WHERE email = %s", (email,))
            db_conn.commit()
            return False
            
        # Verify if the provided OTP matches the stored one
        if stored_otp == otp:
            app.logger.info(f"OTP verified successfully for {email}.")
            # Clean up the used OTP immediately after successful verification
            cursor.execute("DELETE FROM email_otp WHERE email = %s", (email,))
            db_conn.commit()
            return True
            
        app.logger.warning(f"Invalid OTP provided for {email}. Stored: {stored_otp}, Provided: {otp}")
        return False # Provided OTP does not match
        
    except mysql.connector.Error as err:
        app.logger.error(f"Database error verifying OTP for {email}: {err}", exc_info=True)
        return False

# --- OTP and Signup Flow Endpoints ---

@app.route("/send-otp", methods=["POST"])
def send_otp_route():
    """
    Endpoint to send an OTP to a user's email for registration or password reset (if applicable).
    Handles logic for existing users vs. new preliminary users.
    """
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    data = request.json
    email = data.get("email")

    app.logger.debug(f"Received /send-otp request for email: {email}")

    if not email:
        return jsonify({"message": "Email is required."}), 400

    # Enforce @nitc.ac.in domain for institutional accounts
    if not email.endswith("@nitc.ac.in"):
        app.logger.warning(f"Invalid email domain for OTP request: {email}")
        return jsonify({"message": "Only @nitc.ac.in emails are allowed for signup."}), 400

    try:
        # Step 1: Check if the email exists in the `users` table.
        cursor.execute("SELECT user_id, name, password, is_disabled FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if user:
            # User exists
            if user.get("is_disabled") == 1:
                app.logger.warning(f"OTP not sent: Account {email} is disabled.")
                return jsonify({"message": "Your account is disabled. Please contact support."}), 403

            if user.get("password") is not None and user.get("password") != '':
                # User exists and has a non-null password - DO NOT SEND OTP for signup, suggest login
                app.logger.info(f"OTP not sent: User {email} already signed up.")
                return jsonify({"message": "User already signed up. Please use login instead."}), 409
            else:
                # User exists but password is NULL - PROCEED to send OTP (implies incomplete signup)
                app.logger.info(f"User {email} found with NULL password. Proceeding to send OTP.")
        else:
            # User does NOT exist - CREATE a new preliminary user row and PROCEED to send OTP
            app.logger.info(f"Email {email} not found. Creating preliminary user entry.")
            try:
                # Insert a new row with default values for name, contact_number, photo_url, role, is_disabled
                # and NULL password, which will be updated during signup completion.
                cursor.execute("""
                    INSERT INTO users (email, password, name, contact_number, photo_url, role, is_disabled)
                    VALUES (%s, NULL, NULL, NULL, %s, %s, %s)
                """, (email, 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', 'user', False))
                db_conn.commit() # Commit the new user entry
                app.logger.info(f"Preliminary user row created for {email}.")
            except mysql.connector.Error as err:
                db_conn.rollback() # Rollback if preliminary user creation fails
                # Handle cases where duplicate entry might occur (e.g., race condition)
                if err.errno == 1062: # MySQL error code for duplicate entry for unique key
                    app.logger.warning(f"Attempted to create duplicate user for {email}. Re-fetching user to verify state.")
                    # Re-fetch the user to confirm their state and proceed if they still have a NULL password
                    cursor.execute("SELECT user_id, name, password, is_disabled FROM users WHERE email=%s", (email,))
                    user = cursor.fetchone()
                    if user and (user.get("password") is None or user.get("password") == '') and user.get("is_disabled") == 0:
                        app.logger.info(f"Successfully recovered from duplicate entry for {email}. Proceeding with OTP for NULL password user.")
                    else:
                        app.logger.error(f"Duplicate entry error for {email} but user already has a password, is disabled, or other issue. Error: {err}", exc_info=True)
                        return jsonify({"message": "User already registered or a system error occurred. Please try logging in."}), 409
                else:
                    app.logger.error(f"Database error creating preliminary user for {email}: {err}", exc_info=True)
                    return jsonify({"message": f"Database error: {err}"}), 500

        # At this point, the email has passed the domain check, and either:
        # 1. An existing user with NULL password was found (ready for signup completion).
        # 2. A new preliminary user (with NULL password and defaults) was created.
        # Now, proceed to generate and send OTP.
        otp = generate_otp()
        
        if store_otp(email, otp):
            # Get the name from the existing user record if it exists, otherwise use None for email personalization
            user_name = user.get('name') if user and 'name' in user else None 
            if send_otp_email(email, otp, user_name):
                app.logger.info(f"OTP successfully sent and stored for {email}.")
                return jsonify({
                    "message": "OTP sent successfully to your email. Please check your inbox.",
                    "email": email 
                })
            else:
                app.logger.error(f"Failed to send OTP email for {email}.")
                return jsonify({"message": "Failed to send OTP. Please try again."}), 500
        else:
            app.logger.error(f"Failed to store OTP for {email} in database.")
            return jsonify({"message": "Failed to generate OTP. Please try again."}), 500

    except mysql.connector.Error as err:
        app.logger.error(f"Database error during OTP operation for {email}: {err}", exc_info=True)
        return jsonify({"message": f"Database error: {err}"}), 500

    except Exception as e:
        app.logger.error(f"Unexpected error during OTP operation for {email}: {e}", exc_info=True)
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

@app.route("/verify-otp", methods=["POST"])
def verify_otp_route():
    """
    Endpoint to verify the OTP entered by the user.
    If successful, sets session variables to indicate OTP verification.
    """
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    app.logger.debug(f"Received /verify-otp request for email: {email}, OTP: {otp}")
    # Log session state before attempting verification
    app.logger.debug(f"Session before verification: otp_verified={session.get('otp_verified')}, verified_email={session.get('verified_email')}")

    if not all([email, otp]):
        return jsonify({"message": "Email and OTP are required."}), 400

    try:
        if verify_otp(email, otp):
            # If OTP is valid, store verification status in session
            session['verified_email'] = email
            session['otp_verified'] = True
            app.logger.info(f"OTP verified successfully for {email}. Session updated.")
            # Log session state after successful verification
            app.logger.debug(f"Session after verification: otp_verified={session.get('otp_verified')}, verified_email={session.get('verified_email')}")
            return jsonify({
                "message": "OTP verified successfully! Please proceed to complete your signup details.",
                "verified": True,
                "email": email 
            })
        else:
            app.logger.warning(f"OTP verification failed for {email}.")
            return jsonify({
                "message": "Invalid or expired OTP. Please try again.",
                "verified": False
            }), 400

    except Exception as e:
        app.logger.error(f"Error verifying OTP for {email}: {e}", exc_info=True)
        return jsonify({"message": "An error occurred during OTP verification."}), 500

@app.route("/signup", methods=["POST"])
def signup():
    """
    Endpoint for a user to complete their signup after successful OTP verification.
    Updates the preliminary user record with full details and a hashed password.
    """
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    data = request.json

    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    contact_number = data.get("phone")  # Frontend sends 'phone' for contact number

    app.logger.debug(f"Received /signup request for email: {email}")
    # Log current session state for debugging
    app.logger.debug(f"Session state for signup: OTP Verified: {session.get('otp_verified')}, Verified Email: {session.get('verified_email')}")

    if not all([email, password, name, contact_number]):
        app.logger.warning("Missing fields for signup.")
        return jsonify({"message": "All fields are required."}), 400

    # Step 1: Crucial check to ensure OTP was verified for this email in the current session.
    # This prevents users from skipping OTP verification and ensures the flow.
    if 'otp_verified' not in session or not session.get('otp_verified') or session.get('verified_email') != email:
        app.logger.warning(f"Signup attempt for {email} without proper OTP verification. "
                            f"Session state: otp_verified={session.get('otp_verified')}, verified_email={session.get('verified_email')}")
        return jsonify({"message": "OTP verification required before signup."}), 401

    try:
        # Before updating, ensure the user exists and is not already fully signed up or disabled
        cursor.execute("SELECT password, is_disabled FROM users WHERE email = %s", (email,))
        user_record = cursor.fetchone()

        if not user_record:
            app.logger.warning(f"Signup failed: Email {email} not found in users table for update, despite OTP verification. This is unexpected.")
            return jsonify({"message": "User email not found or not authorized for signup completion. Please request OTP again."}), 404
        
        if user_record.get("is_disabled") == 1:
            app.logger.warning(f"Signup attempt for disabled account: {email}.")
            return jsonify({"message": "Account is disabled. Please contact support."}), 403

        if user_record.get("password") is not None and user_record.get("password") != '':
            app.logger.warning(f"Signup attempt for {email} which already has a password set.")
            return jsonify({"message": "Account already has a password. Please log in."}), 409

        # Step 2: Hash the password using bcrypt for security.
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Step 3: Update the `users` table with the new password, name, and contact number.
        # This completes the user registration from the preliminary row created during /send-otp.
        cursor.execute("""
            UPDATE users
            SET password = %s, name = %s, contact_number = %s
            WHERE email = %s
        """, (hashed_pw, name, contact_number, email))
        
        # Check if any row was updated. If not, it indicates a logic error or race condition.
        if cursor.rowcount == 0:
            app.logger.error(f"Signup update failed: No rows updated for email {email}. This shouldn't happen after preliminary insert and session verification.")
            db_conn.rollback() # Rollback on update failure
            return jsonify({"message": "Failed to complete signup due to an internal error."}), 500

        db_conn.commit() # Commit the changes to the database

        # Step 4: Clear session variables after successful signup to prevent reuse
        # and ensure the user must log in explicitly.
        session.pop('otp_verified', None)
        session.pop('verified_email', None)
        app.logger.info(f"Signup successful for {email}. Session cleared.")

        return jsonify({"message": "Signup successful. You can now log in."}), 200

    except mysql.connector.Error as err:
        db_conn.rollback() # Rollback on database error
        app.logger.error(f"Database error during signup for {email}: {err}", exc_info=True)
        return jsonify({"message": f"Database error during signup: {err}"}), 500

    except Exception as e:
        app.logger.error(f"Unexpected error during signup for {email}: {e}", exc_info=True)
        return jsonify({"message": f"An unexpected error occurred during signup: {e}"}), 500

# --- Login Route (FIXED for Session/Cookie Issues) ---
@app.route("/login", methods=["POST"])
def login():
    """Handles user login and sets session data upon successful authentication."""
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    data = request.json
    email = data.get("email")
    password = data.get("password")

    app.logger.debug(f"Received login request for email: {email}")

    if not all([email, password]):
        return jsonify({"message": "Missing required fields."}), 400

    try:
        # Fetch user including the hashed password and is_disabled status
        cursor.execute(
            "SELECT user_id, name, email, password, role, is_disabled FROM users WHERE email=%s",
            (email,)
        )
        user = cursor.fetchone()

        if not user:
            app.logger.warning(f"Login attempt for non-existent user: {email}")
            return jsonify({"message": "Invalid credentials or user not found."}), 401

        # Check if account is disabled
        if user.get("is_disabled") == 1:
            app.logger.warning(f"Login attempt for disabled account: {email}")
            return jsonify({"message": "Account is disabled. Please contact support."}), 403

        # Check if password exists (i.e., user has completed signup)
        if user["password"] is None or user["password"] == '':
            app.logger.warning(f"Login attempt for incomplete account: {email}")
            return jsonify({"message": "Account not fully signed up. Please complete signup first."}), 403

        # Verify the password using bcrypt
        if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
            app.logger.warning(f"Invalid password attempt for user: {email}")
            return jsonify({"message": "Incorrect password."}), 403

        # Password is correct, set session variables (FIXED)
        session.permanent = True  # Make session permanent (respects PERMANENT_SESSION_LIFETIME)
        session['user_id'] = user["user_id"]
        session['name'] = user["name"]
        session['email'] = user["email"]
        session['role'] = user["role"]
        session['logged_in'] = True  # Additional flag for login status
        
        # Debug logging (ENHANCED)
        app.logger.info(f"Login successful for {email}. Session created with user_id: {user['user_id']}")
        app.logger.debug(f"Session data after login: {dict(session)}")
        app.logger.debug(f"Response headers will include Set-Cookie for session")

        # Return user info (excluding password hash) with proper headers
        response = jsonify({
            "message": "Login successful!",
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "is_admin": user["role"] == "admin"
        })
        
        # Ensure the response includes proper headers for cookie setting
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        
        return response, 200

    except mysql.connector.Error as err:
        app.logger.error(f"Database error during login for {email}: {err}")
        return jsonify({"message": f"Database error during login: {err}"}), 500

    except Exception as e:
        app.logger.error(f"Unexpected error during login for {email}: {e}")
        return jsonify({"message": f"An unexpected error occurred during login: {e}"}), 500

# --- NEW: Session Check Route ---
@app.route("/check-session", methods=["GET"])
def check_session():
    """Endpoint to check if user is logged in via session."""
    app.logger.debug(f"Session check request. Current session: {dict(session)}")
    
    if session.get('logged_in') and session.get('user_id'):
        return jsonify({
            "logged_in": True,
            "user_id": session.get('user_id'),
            "name": session.get('name'),
            "email": session.get('email'),
            "is_admin": session.get('role') == 'admin'
        }), 200
    else:
        return jsonify({"logged_in": False}), 200

# --- NEW: Logout Route ---
@app.route("/logout", methods=["POST"])
def logout():
    """Handles user logout by clearing session."""
    app.logger.debug(f"Logout request. Current session: {dict(session)}")
    
    # Clear all session data
    session.clear()
    
    app.logger.info("User logged out successfully. Session cleared.")
    return jsonify({"message": "Logged out successfully."}), 200



# You can add more routes for other functionalities (e.g., listing products, user profile, etc.) here

# ---------------------------------------------------------------------------------------------------

@app.route('/items', methods=['GET'])
def get_items():
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    category_id = request.args.get('category_id')
    try:
        base_query = """
        SELECT
            i.item_id, i.title, i.description, i.price, i.quantity, i.image_url,
            i.item_condition, i.is_sold, i.created_at, i.user_id,i.is_approved, i.category_id,
            c.name as category_name,
            u.name as seller_name,
            u.contact_number as seller_contact_number,
            u.email as seller_email
        FROM items i
        JOIN categories c ON i.category_id = c.category_id
        JOIN users u ON i.user_id = u.user_id
        """
        # Filter for only unsold and approved items
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

# @app.route('/api/user/<email>', methods=['GET'])
# def get_user(email):
#     conn = get_db()
#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT user_id, name, email, contact_number, photo_url FROM users WHERE email = %s", (email,))
#     user = cursor.fetchone()
#     if user:
#         return jsonify(user)
#     else:
#         return jsonify({"error": "User not found"}), 404

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
          host=os.environ["DB_HOST"],
           port=int(os.environ["DB_PORT"]),
           user=os.environ["DB_USER"],
           password=os.environ["DB_PASSWORD"],
          database=os.environ["DB_NAME"]
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
@app.route('/admin/category-counts', methods=['GET'])
def category_counts():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute('''
            SELECT c.category_id, c.name AS category, COUNT(i.item_id) AS total_items
            FROM categories c
            LEFT JOIN items i ON c.category_id = i.category_id AND i.is_approved = TRUE
            GROUP BY c.category_id, c.name
        ''')
        result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        print("Error fetching category counts:", e)
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()

@app.route('/admin/users', methods=['GET'])
def fetch_users():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        # Assuming 'role' column exists in your users table
        cursor.execute("SELECT user_id, name, email, contact_number, is_disabled FROM users WHERE role = 'user'")
        result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        print("Error fetching users:", e)
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()

# Route to disable a user
@app.route('/admin/disable-user', methods=['POST'])
def disable_user():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        # Optional: Add a check here to prevent disabling admin users
        cursor.execute("SELECT role FROM users WHERE user_id = %s", (user_id,))
        user_info = cursor.fetchone()
        if user_info and user_info[0] == 'admin': # user_info[0] is the role if not dictionary cursor
             return jsonify({'error': 'Cannot disable admin users'}), 403

        cursor.execute("UPDATE users SET is_disabled = TRUE WHERE user_id = %s", (user_id,))
        db.commit()
        return jsonify({'message': 'User disabled successfully'})
    except Exception as e:
        print("Error disabling user:", e)
        # Rollback in case of error
        if db.is_connected(): # Check if connection is still valid before rollback
            db.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()


# Route to enable a user
@app.route('/admin/enable-user', methods=['POST'])
def enable_user():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True) # Use dictionary=True for easier access to 'role'
    try:
        cursor.execute("SELECT role FROM users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()

        if user is None:
            return jsonify({'error': 'User not found'}), 404
        if user['role'] == 'admin':
            return jsonify({'error': 'Cannot enable admin users'}), 403

        cursor.execute("UPDATE users SET is_disabled = FALSE WHERE user_id = %s", (user_id,))
        db.commit()
        return jsonify({'message': 'User enabled successfully'})
    except Exception as e:
        print("Error enabling user:", e)
        if db.is_connected():
            db.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()


@app.route('/admin/pending-items', methods=['GET'])
def get_pending_items():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute('''
            SELECT i.item_id, i.title, i.description, i.price, u.name as seller, c.name as category
            FROM items i
            JOIN users u ON i.user_id = u.user_id
            JOIN categories c ON i.category_id = c.category_id
            WHERE i.is_approved = FALSE
        ''')
        result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        print("Error fetching pending items:", e)
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()

@app.route('/admin/approve-item', methods=['POST'])
def approve_item_post():
    data = request.get_json()
    item_id = data.get('item_id')

    if not item_id:
        return jsonify({'error': 'Item ID is required'}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("UPDATE items SET is_approved = TRUE WHERE item_id = %s", (item_id,))
        db.commit()
        return jsonify({'message': 'Item approved successfully'})
    except Exception as e:
        print("Error approving item:", e)
        if db.is_connected():
            db.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()

@app.route('/admin/disapprove-item', methods=['POST'])
def disapprove_item_post():
    data = request.get_json()
    item_id = data.get('item_id')

    if not item_id:
        return jsonify({'error': 'Item ID is required'}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM items WHERE item_id = %s", (item_id,))
        db.commit()
        return jsonify({'message': 'Item disapproved and deleted successfully'})
    except Exception as e:
        print("Error disapproving item:", e)
        if db.is_connected():
            db.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()



@app.route('/admin/approve-all-items', methods=['PATCH'])
def approve_all_items():
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("UPDATE items SET is_approved = TRUE WHERE is_approved = FALSE")
        db.commit()
        return jsonify({'message': 'All items approved successfully'})
    except Exception as e:
        print("Error approving all items:", e)
        if db.is_connected():
            db.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()

@app.route('/admin/disapprove-all-items', methods=['DELETE'])
def disapprove_all_items():
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM items WHERE is_approved = FALSE")
        db.commit()
        return jsonify({'message': 'All unapproved items disapproved and deleted successfully'})
    except Exception as e:
        print("Error disapproving all items:", e)
        if db.is_connected():
            db.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()
        
# NEW ROUTE: Get all items within a specific category for admin view
@app.route('/admin/items-in-category/<int:category_id>', methods=['GET'])
def get_admin_items_by_category(category_id):
    """
    Fetches all items (approved or not) belonging to a specific category for admin view.
    Includes details about the item and the user who posted it.
    """
    app.logger.debug(f"Received request for admin/items-in-category/{category_id}")
    db = None
    cursor = None
    try:
        db = get_db()
        cursor = g.cursor
        query = """
            SELECT
                i.item_id,
                i.title,
                i.description,
                i.price,
                i.quantity,
                i.image_url,
                i.item_condition,
                i.is_sold,
                i.is_approved,
                i.created_at,
                c.name as category_name,
                u.name as seller_name,
                u.email as seller_email,
                u.contact_number as seller_contact_number
            FROM items i
            JOIN categories c ON i.category_id = c.category_id
            JOIN users u ON i.user_id = u.user_id
            WHERE i.category_id = %s
            ORDER BY i.created_at DESC
        """
        cursor.execute(query, (category_id,))
        items = cursor.fetchall()

        # Format datetime objects for JSON serialization
        for item in items:
            if isinstance(item['created_at'], datetime):
                item['created_at'] = item['created_at'].isoformat()

        app.logger.info(f"Fetched {len(items)} items for category_id: {category_id}")
        return jsonify(items), 200

    except mysql.connector.Error as err:
        app.logger.error(f"Database error fetching items for category {category_id} for admin: {err}")
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        app.logger.error(f"An unexpected error occurred fetching items for category {category_id} for admin: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

@app.route('/admin/item-details/<int:item_id>', methods=['GET'])
def get_item_details(item_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            SELECT
                items.item_id,
                items.title,
                items.description,
                items.price,
                items.quantity,
                items.image_url,
                items.item_condition,
                items.created_at,
                users.name AS uploaded_by,
                categories.name AS category
            FROM items
            JOIN users ON items.user_id = users.user_id
            JOIN categories ON items.category_id = categories.category_id
            WHERE items.item_id = %s
        """
        cursor.execute(query, (item_id,))
        item = cursor.fetchone()

        if item:
            return jsonify(item)
        else:
            return jsonify({'error': 'Item not found'}), 404
    except Exception as e:
        print("Error fetching item details:", e)
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()
@app.route('/admin/delete-user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
        db.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        print("Error deleting user:", e)
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()
@app.route('/admin/delete-users', methods=['POST'])
def delete_users():
    db = get_db()
    cursor = db.cursor()
    try:
        data = request.get_json()
        user_ids = data.get('user_ids')

        if not user_ids or not isinstance(user_ids, list):
            return jsonify({'error': 'Invalid or missing user_ids'}), 400

        format_strings = ','.join(['%s'] * len(user_ids))
        cursor.execute(f"DELETE FROM users WHERE user_id IN ({format_strings})", tuple(user_ids))
        db.commit()

        return jsonify({'message': f'{cursor.rowcount} users deleted successfully'}), 200

    except Exception as e:
        print('Error deleting users:', e)
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        cursor.close()

# --- ADD this new route to your app.py ---
@app.route('/admin/feedbacks', methods=['GET'])
def get_feedbacks():
    """
    Fetches all feedback entries with pagination and search functionality for admin dashboard.
    """
    app.logger.debug("Received request to /admin/feedbacks")
    db = None
    cursor = None
    try:
        db = get_db()
        cursor = g.cursor

        # Pagination parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int) # Default limit for feedbacks
        search_query = request.args.get('search', '').strip()
        offset = (page - 1) * limit

        # Base SQL query for feedback data
        sql_base = """
            FROM feedback
            WHERE 1=1
        """
        params = []

        # Add search condition if query is provided
        if search_query:
            # Search across feedback_text, user_name, user_email, user_contact_number
            sql_base += """
                AND (
                    feedback_text LIKE %s OR
                    user_name LIKE %s OR
                    user_email LIKE %s OR
                    user_contact_number LIKE %s
                )
            """
            search_pattern = f"%{search_query}%"
            params.extend([search_pattern, search_pattern, search_pattern, search_pattern])

        # Count total feedbacks matching the search criteria
        sql_count = f"SELECT COUNT(*) AS total_count {sql_base}"
        cursor.execute(sql_count, params)
        total_feedbacks = cursor.fetchone()['total_count']

        # Fetch feedbacks with pagination and ordering
        sql_feedbacks = f"""
            SELECT feedback_id, user_id, user_name, user_email, user_contact_number, feedback_text, submission_timestamp
            {sql_base}
            ORDER BY submission_timestamp DESC
            LIMIT %s OFFSET %s
        """
        # Append limit and offset parameters
        params.extend([limit, offset])
        cursor.execute(sql_feedbacks, params)
        feedbacks = cursor.fetchall()

        # Format timestamps for better readability if desired (optional)
        for feedback in feedbacks:
            if feedback['submission_timestamp']:
                feedback['submission_timestamp'] = feedback['submission_timestamp'].strftime('%Y-%m-%d %H:%M:%S')

        app.logger.info(f"Fetched {len(feedbacks)} feedbacks (Total: {total_feedbacks}) for page {page}, limit {limit}.")
        return jsonify({
            "feedbacks": feedbacks,
            "total_feedbacks": total_feedbacks,
            "page": page,
            "limit": limit
        }), 200

    except mysql.connector.Error as err:
        app.logger.error(f"Database error fetching feedbacks: {err}")
        return jsonify({"msg": f"Database error: {err}"}), 500
    except Exception as e:
        app.logger.error(f"An unexpected error occurred fetching feedbacks: {e}")
        return jsonify({"msg": f"An unexpected error occurred: {e}"}), 500

# --- VERIFY/UPDATE this existing route in your app.py ---
@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    """
    Receives feedback from the frontend and stores it in the MySQL database,
    associating it with the user's name, email, and contact number from the users table.
    """
    app.logger.debug("Received request to /api/feedback")
    if not request.is_json:
        app.logger.warning("Feedback submission failed: Missing JSON in request")
        return jsonify({"msg": "Missing JSON in request"}), 400

    data = request.get_json()
    feedback_text = data.get('feedback', '').strip()
    user_email_from_frontend = data.get('user_email') # This is sent from frontend localStorage

    if not feedback_text:
        app.logger.warning("Feedback submission failed: Feedback text is empty")
        return jsonify({"msg": "Feedback cannot be empty"}), 400

    if not user_email_from_frontend:
        app.logger.warning("Feedback submission failed: User email is missing from frontend data")
        return jsonify({"msg": "User email is required to submit feedback"}), 400

    db = None
    cursor = None
    user_id = None # Initialize user_id
    user_name = "Anonymous User" # Default name if not found
    user_contact_number = None # Default contact number if not found

    try:
        db = get_db()
        cursor = g.cursor

        # 1. Fetch user's ID, name, and contact number from the 'users' table
        sql_fetch_user_details = "SELECT user_id, name, contact_number FROM users WHERE email = %s"
        cursor.execute(sql_fetch_user_details, (user_email_from_frontend,))
        user_record = cursor.fetchone()

        if user_record:
            user_id = user_record.get('user_id')
            user_name = user_record.get('name') or "Anonymous User" # Use default if name is empty
            user_contact_number = user_record.get('contact_number')
            app.logger.debug(f"Found user details: ID={user_id}, Name='{user_name}', Contact='{user_contact_number}' for email '{user_email_from_frontend}'")
        else:
            app.logger.warning(f"User details not found for email: {user_email_from_frontend}. Using default 'Anonymous User', no ID/contact.")

        # 2. Insert feedback into the 'feedback' table
        # Include user_id in the INSERT statement
        sql_insert_feedback = """
            INSERT INTO feedback (user_id, user_name, user_email, user_contact_number, feedback_text)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql_insert_feedback, (user_id, user_name, user_email_from_frontend, user_contact_number, feedback_text))
        db.commit() # Commit the transaction

        feedback_id = cursor.lastrowid
        app.logger.info(f"Feedback received and stored successfully. ID: {feedback_id}, User: {user_name} ({user_email_from_frontend}), Contact: {user_contact_number}")
        return jsonify({"msg": "Feedback received successfully!", "feedback_id": feedback_id}), 200

    except mysql.connector.Error as err:
        app.logger.error(f"Database error during feedback submission: {err}")
        if db:
            db.rollback() # Rollback on error
        return jsonify({"msg": f"Database error: {err}"}), 500
    except Exception as e:
        app.logger.error(f"An unexpected error occurred during feedback submission: {e}")
        if db:
            db.rollback() # Rollback on any other error
        return jsonify({"msg": f"An unexpected error occurred: {e}"}), 500

# --- VERIFY/UPDATE this existing route in your app.py ---
@app.route('/api/user/<email>', methods=['GET'])
def get_user_data(email):
    """
    Fetches user data (name, photo_url) from the database based on email.
    """
    db = None
    cursor = None
    try:
        db = get_db()
        cursor = g.cursor
        sql = "SELECT name, photo_url, contact_number FROM users WHERE email = %s" # Added contact_number for completeness
        cursor.execute(sql, (email,))
        user_data = cursor.fetchone()

        if user_data:
            return jsonify(user_data), 200
        else:
            app.logger.info(f"User data not found for email: {email}. Returning default.")
            return jsonify({"name": "Guest", "photo_url": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", "contact_number": None}), 200 # Include contact_number fallback

    except mysql.connector.Error as err:
        app.logger.error(f"Database error fetching user data: {err}")
        return jsonify({"msg": f"Database error: {err}"}), 500
    except Exception as e:
        app.logger.error(f"An unexpected error occurred fetching user data: {e}")
        return jsonify({"msg": f"An unexpected error occurred: {e}"}), 500
        
if __name__ == "__main__":
    app.run(debug=True, port=5000)
