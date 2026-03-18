from fastapi.testclient import TestClient
from app.main import app

# We create a "fake" browser/client that can talk to our app without 
# having to actually start the server with uvicorn!
client = TestClient(app)

# This is our automated test. Test functions must start with 'test_'
def test_read_root():
    # 1. We tell our fake client to visit the "/" URL
    response = client.get("/")
    
    # 2. We assert (check) that the website responded with a 200 OK status code
    assert response.status_code == 200
    
    # 3. We assert that the JSON it returned is exactly what we expect
    assert response.json() == {"message": "Welcome to the DevOps Learning Tracker! Go to /docs to see the API."}
