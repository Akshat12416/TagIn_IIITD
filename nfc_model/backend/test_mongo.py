# test_mongo.py
from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/nfc_hotspot_db"

mongo = PyMongo(app)

with app.app_context():
    mongo.db.test_collection.insert_one({"hello": "world"})
    doc = mongo.db.test_collection.find_one({"hello": "world"})
    print("Mongo connected:", doc)
