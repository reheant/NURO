from mongo_utils.getDatabase import get_database


def remove_patientInfo():
    db = get_database()
    collection = db["Events"]
    collection.delete_many({})
    print("DATABASE REMOVED")
    

remove_patientInfo()



