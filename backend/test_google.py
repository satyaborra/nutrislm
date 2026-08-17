import requests
try:
    res = requests.post("http://localhost:8000/api/auth/google", json={
        "token": "valid_token", 
        "email": "test@google.com", 
        "name": "Google Test"
    })
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")
except Exception as e:
    print(f"Request failed: {e}")
