# 1. Use a lightweight Python version
FROM python:3.11-slim

# 2. Set environment variables to prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Set work directory inside the server
WORKDIR /app

# 4. Install system dependencies (needed for Postgres)
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# 5. Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the entire project
COPY . .

# 7. Collect static files (CSS/Images) using Whitenoise
RUN python manage.py collectstatic --no-input

# 8. Expose the port (Cloud Run uses 8080 by default)
EXPOSE 8080

# 9. The command to start the server (Migrate DB then Start Gunicorn)
# Note: We bind to 0.0.0.0 and use the PORT environment variable
# CMD ["sh", "-c", "python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT"]

# NEW COMMAND (Skip migrate for now):
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8080"]