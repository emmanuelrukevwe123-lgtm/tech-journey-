# 1. Start with a tiny, pre-made Linux environment that already has Python 3.12 installed.
FROM python:3.12-slim

# 2. Tell Docker that inside this mini-computer, we want to do our work in /app
WORKDIR /app

# 3. Copy ONLY our requirements.txt from our computer into the container first.
COPY requirements.txt .

# 4. Run pip inside the container to install the tools.
RUN pip install --no-cache-dir -r requirements.txt

# 5. Now, copy the rest of our application code (app folder, tests) into the container.
COPY . .

# 6. Tell Docker that our app talks on port 8000
EXPOSE 8000

# 7. Whenever someone starts this container, run our uvicorn server automatically.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
