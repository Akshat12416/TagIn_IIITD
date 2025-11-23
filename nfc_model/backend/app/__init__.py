from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from .config import Config

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mongo.init_app(app)

    # Enable CORS for all domains (can restrict in production)
    CORS(app)

    from .routes import main
    app.register_blueprint(main)

    return app
