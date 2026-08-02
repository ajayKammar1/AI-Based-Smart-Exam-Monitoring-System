from pymongo import MongoClient
from backend.config import MONGO_URI, DATABASE_NAME

client = None
db = None


def connect_db():
    global client, db

    if client is None:
        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]

        print("✅ MongoDB Connected")
        print(f"📂 Database : {DATABASE_NAME}")

    return db


def get_database():
    if db is None:
        return connect_db()

    return db


def close_db():
    global client

    if client:
        client.close()
        print("❌ MongoDB Connection Closed")