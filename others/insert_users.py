import csv
import mysql.connector

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",        # Replace with your MySQL username
    password="1234",    # Replace with your MySQL password
    database="nitc_mp_db"
)

cursor = conn.cursor()

# Open the CSV file
with open('nitc_users_with_user_ids.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Handle possible NULL values
        created_at = row['created_at'] if row['created_at'].strip() else None
        name = row['name'] if row['name'].strip() else None
        password = row['password'] if row['password'].strip() else None
        contact_number = row['contact_number'] if row['contact_number'].strip() else None

        cursor.execute("""
            INSERT INTO users (user_id, name, email, password, contact_number, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            int(row['user_id']),
            name,
            row['email'],
            password,
            contact_number,
            created_at
        ))

conn.commit()
cursor.close()
conn.close()
print("Data inserted successfully.")
