from pymongo import MongoClient

def get_database():
 
   CONNECTION_STRING = "mongodb+srv://athavanth5:B5kyEZwIsa5nKudY@nurocluster.nklr1tm.mongodb.net/?retryWrites=true&w=majority"
 
   client = MongoClient(CONNECTION_STRING)

   try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
   except Exception as e:
      print(e)
 
   return client['NURO']

print(get_database());