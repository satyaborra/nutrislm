import sqlite3
conn = sqlite3.connect('nutrislm.db')
schema = conn.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'").fetchone()[0]
print(schema)
