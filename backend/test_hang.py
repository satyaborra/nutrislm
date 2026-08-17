import requests
try:
    print("Sending request to root endpoint...")
    print(requests.get("http://127.0.0.1:8000/", timeout=15).json())
except Exception as e:
    print(e)
