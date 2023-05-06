from datetime import timedelta
from flask import Flask, make_response, request, jsonify
from bson.json_util import dumps
from bson.objectid import ObjectId
import json
from flask_cors import CORS, cross_origin
# Connect to MongoDB
from pymongo import MongoClient
import urllib.parse



app = Flask(__name__)

username = 'Nicholas'
password = 'gr@yGrape95'
connection_string = 'cluster0.pneqsaj.mongodb.net' 

# Escape the username and password using urllib.parse.quote_plus
escaped_username = urllib.parse.quote_plus(username)
escaped_password = urllib.parse.quote_plus(password)

# Update the MongoDB connection string with the escaped username and password
client = MongoClient(f'mongodb+srv://{escaped_username}:{escaped_password}@{connection_string}/?retryWrites=true&w=majority')
db = client['FDM'] 
listings_collection = db['listings']
login_credentials = db['loginCredentials'] # get db with all user credentials
user = ''
watchList_Nicholas = db['nicholas']
watchList_Shayan = db['shayan']
profile_Nicholas = db['nicholasProfile']
profile_Shayan = db['shayanProfile']

# Load data from JSON file
with open('listings.json', 'r') as file:
    listings_data = json.load(file)

# Insert data into MongoDB only during the initial setup
if listings_collection.count_documents({}) == 0:
    listings_collection.insert_many(listings_data)

# function called when user attempts to login
@app.route('/login', methods=['OPTIONS','GET'])
@cross_origin()
def login():
    global login_credentials
    if request.method =="OPTIONS":
        print("options is called")
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "GET":
        credentials_json = dumps(list(login_credentials.find({})))
        response = app.response_class(
            response = credentials_json,
            status = 200,
            mimetype = 'application/json'
        )
        return response


# function called when user attempts to logout
@app.route('/logout', methods=['OPTIONS','POST'])
@cross_origin()
def logout():
    global user
    if request.method =="OPTIONS":
        print("options is called")
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "POST":
        try:
            user = ''
            response = make_response(jsonify({"message" : "Session Closed"}), 200)
        except:
            response = make_response(jsonify({"message" : "Close failed"}), 500)
        return response

#sets the global username Variable so that the program knows who is signed in.
@app.route('/start_session', methods=['OPTIONS','POST'])
@cross_origin()
def start_session():
    global user
    if request.method =="OPTIONS":
        print("options is called")
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "POST":
        try:
            user = request.json['username']
            response = make_response(jsonify({"message" : "Session Started"}), 200)
        except:
            response = make_response(jsonify({"message" : "Session Failed"}), 500)
        return response


#gets username of who is signed in
@app.route('/get_user', methods=['OPTIONS','GET'])
@cross_origin()
def get_user():
    global user
    if request.method =="OPTIONS":
        print("options is called")
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "GET":
        try:
            response = make_response(jsonify({"user" : user}), 200)
        except:
            response = make_response(jsonify({"message" : "get failed"}), 500)
        return response


#creates profile, this is called if the user has never created a profile before
@app.route('/create_profile', methods=['OPTIONS','POST'])
@cross_origin()
def create_profile():
    if request.method == "OPTIONS":
        print("options is called")
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "POST":
        try:
            profile_data = request.json
            if user == 'shayan':
                profile_Shayan.insert_one(profile_data)
            elif user == 'nicholas':
                profile_Nicholas.insert_one(profile_data)
            response = make_response(jsonify({"message" : "profile creation successful"}), 200)
        except:
            response = make_response(jsonify({"message" : "profile creation failed"}), 500)


#gets the profile info from database
@app.route('/get_profile', methods=['OPTIONS','GET'])
@cross_origin()
def get_profile():
    if request.method =="OPTIONS":
        print("options is called")
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "GET":
        # Retrieve data from MongoDB
        profile = {}
        if user == 'nicholas':
            profile = dumps(list(profile_Nicholas.find({})))
        elif user == 'shayan':
            profile = dumps(list(profile_Shayan.find({})))
        # Convert ObjectId values to strings
        response = app.response_class(
            response = profile,
            status = 200,
            mimetype = 'application/json'
        )
        return response


#this is called when the user choses to edit there profile.
@app.route('/edit_profile', methods=['OPTIONS','POST'])
@cross_origin()
def edit_profile():
    if request.method =="OPTIONS":
        print("options is called")
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "POST":
        # Retrieve data from MongoDB
        profile = {}
        profile_data = request.json

        if user == 'nicholas':
            profile_Nicholas.delete_many({}) #deletes all entries
            profile_Nicholas.insert_one(profile_data)           #adds the new entry
            profile = dumps(list(profile_Nicholas.find({})))       #returns entry

        elif user == 'shayan':
            profile_Shayan.delete_many({})
            profile_Shayan.insert_one(profile_data)
            profile = dumps(list(profile_Shayan.find({})))
        # Convert ObjectId values to strings
        response = app.response_class(
            response = profile,
            status = 200,
            mimetype = 'application/json'
        )
        return response


#gets all the listings from database
@app.route('/listings', methods=['OPTIONS','GET'])
@cross_origin()
def get_listings():
    print("Get request")
    global listings_collection 
    if request.method =="OPTIONS":
        print("options is called")
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "GET":
        # Retrieve data from MongoDB
        listings = list(listings_collection.find({}))
        # Convert ObjectId values to strings
        listings_json = dumps(listings)
        response = app.response_class(
            response = listings_json,
            status = 200,
            mimetype = 'application/json'
        )
        return response


#submits a listing to the database
@app.route('/submitListings', methods=['OPTIONS','POST'])
@cross_origin()
def add_listing():
    global listings_collection
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "POST":
        try:
            # Get the form data from the request
            form_data = request.json
            # Insert the form data into MongoDB
            listings_collection.insert_one(form_data)
            # Return success response
            response = make_response(jsonify({"message": "Listing added successfully"}), 200)
        except Exception as e:
            print("Error: ", e)
            # Return error response
            response = make_response(jsonify({"error": "Failed to add listing"}), 500)
        return response
    

#saves to watchlist
@app.route('/saveToWatchList', methods=['OPTIONS','POST'])
@cross_origin()
def save_To_Watchlist():
    global listings_collection
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "POST":
        try:
            # Get the form data from the request
            listing = request.json
            # Insert the form data into MongoDB
            if user == 'nicholas':
                watchList_Nicholas.insert_one(listing)
            elif user == 'shayan':
                watchList_Shayan.insert_one(listing)
            # Return success response
            response = make_response(jsonify({"message": "Listing added successfully"}), 200)
        except Exception as e:
            print("Error: ", e)
            # Return error response
            response = make_response(jsonify({"error": "Failed to add listing"}), 500)
        return response
    

#retrieves users watchlist.
@app.route('/getWatchList', methods=['OPTIONS','GET'])
@cross_origin()
def get_WatchList():
    print("Get request")
    global listings_collection 
    if request.method =="OPTIONS":
        print("options is called")
        response = make_response()
        response.headers["Access-Control_Allow_Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "GET":

        # Retrieve data from MongoDB
        if (user == 'nicholas'):
            listings = list(watchList_Nicholas.find({}))
        elif (user == 'shayan'):
            listings = list(watchList_Shayan.find({}))
        # Convert ObjectId values to strings
        listings_json = dumps(listings)
        response = app.response_class(
            response = listings_json,
            status = 200,
            mimetype = 'application/json'
        )
        return response
    

#removes from users watchlist
@app.route('/removeFromWatchList', methods=['OPTIONS', 'POST'])
@cross_origin()
def remove_from_watchlist():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control-Allow-Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == "POST":
        try:
            # Get the listing ID from the request
            listing_id = request.json["_id"]["$oid"]
            # Convert the listing_id back to an ObjectId
            listing_object_id = ObjectId(listing_id)
            # Remove the listing from the user's watchlist collection in the MongoDB database
            watchList_Nicholas.delete_one({"_id": listing_object_id})
            # Return success response
            response = make_response(jsonify({"message": "Listing removed successfully"}), 200)
        except Exception as e:
            print("Error: ", e)
            # Return error response
            response = make_response(jsonify({"error": "Failed to remove listing"}), 500)
        return response



#filters all the listings
@app.route('/FilterListings', methods=['OPTIONS', 'GET'])
@cross_origin()
def FilterListings():
    global listings_collection 
    if request.method =="OPTIONS":
        print("options is called")
        response = make_response()
        response.headers["Access-Control-Allow-Headers"] = ["Accept, Content-Type"]
        response.headers["Access-Control-Allow-Credentials"] = True
        response.headers["Access-Control-Allow-Methods"] = ["GET, POST"]
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    elif request.method == 'GET':
        # Get search parameters from request query parameters
        max_price = request.args.get('max_price')
        max_bedrooms = request.args.get('max_bedrooms')

        # Convert the parameters to integers if they are not None
        if max_price is not None:
            max_price = int(max_price)
        if max_bedrooms is not None:
            max_bedrooms = int(max_bedrooms)

        # Construct the query to filter the listings based on the search parameters
        query = {}

        # Convert the 'price' field to integers for comparison
        if max_price is not None:
            query['price'] = {'$lte': max_price}

        if max_bedrooms is not None:
            query['noRooms'] = {'$lte': max_bedrooms}

        # Execute the query to get the filtered listings
        filtered_listings = list(listings_collection.find(query))

        # Convert ObjectId values to strings
        listings_json = dumps(filtered_listings)
        response = app.response_class(
            response=listings_json,
            status=200,
            mimetype='application/json'
        )
        return response





if __name__ == "__main__":
    app.run(debug=True)
