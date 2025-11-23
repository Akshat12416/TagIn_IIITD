# backend/app/config.py
import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "supersecret")
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/nfc_hotspot_db")
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "uploads")
