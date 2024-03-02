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