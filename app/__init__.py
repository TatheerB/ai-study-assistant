from flask import Flask
from dotenv import load_dotenv
import os
from pymongo import MongoClient

load_dotenv()

# Don't crash if MongoDB URI is missing
mongodb_uri = os.getenv('MONGODB_URI')
if not mongodb_uri:
    print("WARNING: MONGODB_URI not set. Database features will be disabled.")

def create_app():
    app = Flask(__name__)
    
    # MongoDB connection
    mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    client = MongoClient(mongodb_uri)
    app.db = client.get_database('study_assistant')
    
    # Register routes
    from app.routes.main import main_bp
    app.register_blueprint(main_bp)
    
    return app