import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'nutrislm.db')
print(f"Migrating DB at: {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

columns = [
    "target_weight FLOAT",
    "healthGoal VARCHAR",
    "gender VARCHAR",
    "activityLevel VARCHAR",
    "healthCondition VARCHAR"
]

for col in columns:
    try:
        cursor.execute(f"ALTER TABLE users ADD COLUMN {col}")
        print(f"Added column {col}")
    except sqlite3.OperationalError as e:
        print(f"Skipped {col}: {e}")

conn.commit()
conn.close()
