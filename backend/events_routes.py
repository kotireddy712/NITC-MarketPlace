from flask import Blueprint, request, jsonify, session
from auth_utils import admin_required, login_required
from db_connection import get_db

events_bp = Blueprint("events_bp", __name__)

# 🧩 Get all events (for both students & admins)
@events_bp.route("/events", methods=["GET"])
@login_required
def get_events():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM events ORDER BY start_date ASC")
    events = cursor.fetchall()
    cursor.close()
    return jsonify(events), 200

# 🧩 Add new event (Admin only)
@events_bp.route("/events", methods=["POST"])
@admin_required
def add_event():
    data = request.json
    title = data.get("title")
    description = data.get("description")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    if not title or not start_date:
        return jsonify({"message": "Title and start date are required"}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO events (title, description, start_date, end_date, created_by) VALUES (%s, %s, %s, %s, %s)",
        (title, description, start_date, end_date, session["user_id"])
    )
    db.commit()
    cursor.close()
    return jsonify({"message": "Event added successfully"}), 201

# 🧩 Edit event (Admin only)
@events_bp.route("/events/<int:event_id>", methods=["PUT"])
@admin_required
def edit_event(event_id):
    data = request.json
    title = data.get("title")
    description = data.get("description")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE events
        SET title=%s, description=%s, start_date=%s, end_date=%s
        WHERE event_id=%s
        """,
        (title, description, start_date, end_date, event_id)
    )
    db.commit()
    cursor.close()
    return jsonify({"message": "Event updated successfully"}), 200

# 🧩 Delete event (Admin only)
@events_bp.route("/events/<int:event_id>", methods=["DELETE"])
@admin_required
def delete_event(event_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM events WHERE event_id=%s", (event_id,))
    db.commit()
    cursor.close()
    return jsonify({"message": "Event deleted successfully"}), 200
