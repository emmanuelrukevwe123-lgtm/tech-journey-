from fastapi import FastAPI

# Here we create our FastAPI app instance.
# This 'app' variable is what uvicorn uses to run our web server.
app = FastAPI(title="DevOps Concept Tracker")

# We create an in-memory list (like a temporary database) 
# to hold the concepts we want to learn.
concepts_db = [
    {"id": 1, "name": "Version Control", "learned": True},
    {"id": 2, "name": "CI/CD", "learned": False},
    {"id": 3, "name": "Containerization", "learned": False}
]

# This is a 'route'. We tell FastAPI that whenever someone visits
# the root URL ("/") with a GET request, it should run this function.
@app.get("/")
def read_root():
    # It returns a simple dictionary. FastAPI automatically converts it to JSON.
    return {"message": "Welcome to the DevOps Learning Tracker! Go to /docs to see the API."}

# Another route! This one listens at "/concepts"
@app.get("/concepts")
def get_concepts():
    # This simply returns our list of concepts.
    return {"concepts": concepts_db}
