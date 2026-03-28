"""
Simple script to run the FastAPI application.
Usage: python run.py
"""

import sys
import os
import subprocess

# Ensure we're in the backend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Check if requirements are installed
try:
    import fastapi
except ImportError:
    print("Dependencies not installed. Installing...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

# Run the application
print("=" * 80)
print("Starting Geopolitical Investment Engine Backend")
print("=" * 80)
print()
print("🚀 Application starting on http://0.0.0.0:8000")
print("📚 API Docs available at http://localhost:8000/docs")
print("📖 ReDoc available at http://localhost:8000/redoc")
print()
print("Press CTRL+C to stop the server")
print()

subprocess.run([
    sys.executable,
    "-m",
    "uvicorn",
    "app.main:app",
    "--reload",
    "--host", "0.0.0.0",
    "--port", "8000",
])
