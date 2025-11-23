# backend/app/models.py
from . import mongo

def get_reports_collection():
    return mongo.db.reports
