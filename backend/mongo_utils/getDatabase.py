from pymongo import MongoClient

def get_database():
 
   CONNECTION_STRING = "mongodb://mongo:27017/mydatabase"
 
   client = MongoClient(CONNECTION_STRING)
 
   return client['template_database']
