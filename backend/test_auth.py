import requests
try:
    res = requests.post('http://localhost:8000/api/auth/google', json={"token": "test_token_123", "email": "test@google.com", "name": "Test User"})
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text}")
except Exception as e:
    print(f"Error: {e}")
