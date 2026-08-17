# Stubs for real Google OAuth logic validation.
def verify_google_token(token: str):
    # In a real app, use google.oauth2.id_token.verify_oauth2_token
    # Since we are mocking frontend, we assume token is valid
    return True
