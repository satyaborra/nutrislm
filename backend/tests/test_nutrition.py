from auth.dependencies import get_current_user
from models.user import User

# Simplistic mock for protected route tests
def mock_get_current_user():
    return User(id=1, name="Test User", email="test@example.com")
