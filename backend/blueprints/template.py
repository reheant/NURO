import sys
from flask import Blueprint, jsonify, request
from flask_cors import CORS  # Import CORS
from mongo_utils.getDatabase import get_database
from pandas import DataFrame
from bson import ObjectId
import json

template_blueprint = Blueprint('template', __name__)

@template_blueprint.route('/', methods=['GET'])
def home():
    return "Flask App is running"

@template_blueprint.route('/items', methods=['GET'])
def get_all_items():
    db = get_database()
    collection = db['items']
    if (collection.find() is None):
        return jsonify({'data':[]})
    df = DataFrame(collection.find())
    df['_id'] = df['_id'].astype(str)
    result = df.to_dict()
    return jsonify({"data": result})

@template_blueprint.route('/items/<item_id>', methods=['GET'])
def get_item(item_id):
    db = get_database()
    if(len(item_id)!=24):
        return "Invalid Id : it must be a 12-byte input or a 24-character hex string"
    
    created_item = db["items"].find_one(
        {"_id": ObjectId(item_id)}
    )
    if created_item != None:
        created_item['_id']= str(created_item['_id'])
        return created_item, 201
    return 'Did not find item with id ' + str(item_id), 401

@template_blueprint.route('/items', methods=['POST'])
def add_item():

    db = get_database()
    print(request.json,file=sys.stderr)
    new_item = db["items"].insert_one({'itemName': request.json.get('name')})
    created_item = db["items"].find_one(
        {"_id": new_item.inserted_id}
    )
    created_item['_id']= str(created_item['_id'])

    return created_item, 201

@template_blueprint.route('/items/<item_id>', methods=['PUT'])
def update_item(item_id):
    db = get_database()

    if (
        db["items"].find_one({"_id": ObjectId(item_id)})
    ) is not None:
        update_result = db["items"].update_one(
            {"_id":  ObjectId(item_id)}, {"$set": {"itemName": request.json.get('name')}}
        )
        return update_result
    
    return 'Did not find item with id ' + str(item_id), 401

@template_blueprint.route('/patientInformation', methods=['POST'])
def add_patientInfo():
    db = get_database()
    print(request.json,file=sys.stderr)
    new_item = db["PatientInformation"].insert_one({'firstName': request.json.get('firstName'), 'lastName': request.json.get("lastName"), 'sexe': request.json.get("sexe"), 'ethnicity': request.json.get("ethnicity"), 'address': request.json.get("address")})
    created_item = db["PatientInformation"].find_one(
        {"_id": new_item.inserted_id}
    )
    created_item['_id']= str(created_item['_id'])

    return created_item, 201

@template_blueprint.route('/location',methods = ["POST"])
def add_location():
    db = get_database()
    print(request.json,file=sys.stderr)
    new_item = db["Location"].insert_one({'latitude': request.json.get('latitude'), 'longitude': request.json.get("longitude")})
    created_item = db["Location"].find_one(
        {"_id": new_item.inserted_id}
    )
    created_item['_id']= str(created_item['_id'])

    return created_item, 201


@template_blueprint.route('/reminders',methods = ["POST"])
def add_reminders():
    db = get_database()
    print(request.json,file=sys.stderr)
    new_item = db["Reminders"].insert_one({'type': request.json.get('type'), 'name': request.json.get("name"), 'description': request.json.get("description"),'date': request.json.get("date"),'time': request.json.get("time")})
    created_item = db["Reminders"].find_one(
        {"_id": new_item.inserted_id}
    )
    created_item['_id']= str(created_item['_id'])

    return created_item, 201


@template_blueprint.route('/location', methods = ["GET"] )
def get_location():
    db = get_database()
    collection = db['Location']
    document = collection.find_one({})
    if document:
        longitude = document.get("longitude")
        latitude = document.get("latitude")
        return jsonify({"longitude": longitude, "latitude": latitude})
    else:
        return jsonify({"Error": "Undefined"}), 404
    

@template_blueprint.route('/patientInformation', methods = ["GET"] )
def get_patientInfo():
    db = get_database()
    collection = db['PatientInformation']
    document = collection.find_one({})
    if document:
        firstname = document.get("firstName")
        lastname = document.get("lastName")
        sexe = document.get("sexe")
        ethnicity= document.get("ethnicity")
        address = document.get("address")
        return jsonify({"firstName": firstname, "lastName": lastname, "sexe": sexe, "ethnicity":ethnicity, "address":address})
    else:
        return jsonify({"Error": "Undefined"}), 404
    

@template_blueprint.route('/reminders/<int:month>/<int:day>/<int:year>', methods=["GET"])
def get_reminder(month,day,year):
    date = f"{month}/{day}/{year}"
    db = get_database()
    print(date)
    collection = db['Reminders']
    results = list(collection.find({"date": date}))

    for reminder in results:
        reminder['_id'] = str(reminder['_id'])
    
    return jsonify(results)

@template_blueprint.route('/reminders', methods=["GET"])
def get_all_reminders():
    db = get_database()
    reminders = list(db["Reminders"].find())  # Retrieve all reminders from the database

    # Convert ObjectId to string for JSON serialization
    for reminder in reminders:
        reminder['_id'] = str(reminder['_id'])

    return jsonify(reminders), 200

@template_blueprint.route('/forgot_count', methods=["GET"])
def get_forgot_count():
    db = get_database()
    # Find and update the only document in the ForgotCount collection
    updated_forgot_count = db["ForgotCount"].find_one_and_update({}, {"$inc": {"forgot": 1}}, return_document=True)

    if updated_forgot_count:
        # If document found and updated successfully, convert ObjectId to string for JSON serialization
        updated_forgot_count['_id'] = str(updated_forgot_count['_id'])
        return jsonify(updated_forgot_count), 200
    else:
        return jsonify({"error": "No document found or failed to update"}), 404
    
    











