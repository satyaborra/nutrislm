from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

def test_register_and_login():
    # Because DB persists in test runtime, generate random email
    random_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    
    # Test Register
    reg_response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": random_email,
            "password": "testpassword123"
        }
    )
    assert reg_response.status_code == 200
    assert "id" in reg_response.json()
    
    # Test Login
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": random_email,
            "password": "testpassword123"
        }
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
