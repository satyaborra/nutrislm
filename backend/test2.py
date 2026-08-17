import requests
try:
    print("Sending request...")
    res = requests.post("http://127.0.0.1:8000/api/auth/google", json={
        "token": "valid_token", 
        "email": "test2@google.com", 
        "name": "Google Test 2"
    }, timeout=2)
    print(f"Status: {res.status_code}")
except Exception as e:
    print(f"Failed: {e}")
