from flask import Flask, render_template, request, flash, session, redirect, jsonify, make_response
from flask_cors import CORS
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# CORS(app, supports_credentials=True)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

@app.route("/message")
def homepage():
    """View homepage."""
    data = {"message": "Hello"}
    return jsonify(data)


@app.route("/users")
def list_users():
    """Return a list of users."""

    users = crud.get_all_users()

    data = {"users": [d.to_dict() for d in users]}

    return jsonify(data)


@app.route("/signup", methods=["POST"])
def signup():
    """Create a new user."""
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    password = data["password"]

    new_user = crud.create_user(name, email, password, False)

    db.session.add(new_user)
    db.session.commit()

    return {"message": "User created successfully"}


@app.route("/login", methods=["POST"])
def login():
    """Log in a user."""
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    user = crud.get_user_by_email(email)

    if user: 
        if user.password == password:
            session["user_id"] = user.user_id
            return {"token": session["user_id"]}
        else:
            return {"message": "Incorrect password."}, 401


@app.route("/logout", methods=["POST"])
def logout():
    """Log out a user."""
    del session["user_id"]

    response = make_response(jsonify({"message": "User logged out successfully."}), 200)
    response.set_cookie('user_id', '', expires=0)

    return response

@app.route("/trips")
def list_trips():
    """Return a list of trips."""
    trips = crud.get_trips_by_user_id(session["user_id"])

    data = {"trips": [d.to_dict() for d in trips]}

    return data

@app.route("/new_trip", methods=["POST"])
def create_trip():
    """Create a new trip."""
    data = request.get_json()
    name = data["name"]
    mode = data["mode"]
    date_created = data["date_created"]
    origin = data["origin"]
    destination = data["destination"]
    distance = data["distance"]
    duration = data["duration"]
    ghg_emissions = data["ghg_emissions"]

    user_id = session["user_id"]

    new_trip = crud.create_trip(name, mode, date_created, origin, destination, distance, duration, ghg_emissions, user_id)

    db.session.add(new_trip)
    db.session.commit()

    # return {"message": "Trip created successfully"}
    return jsonify(new_trip.to_dict())

@app.route("/user_info")
def get_user_info():
    """Return user's info."""

    user = crud.get_user_by_id(session["user_id"])

    # return user.to_dict()
    return user.to_dict(user.has_personal_vehicle)

@app.route("/new_vehicle", methods=["POST"])
def create_new_vehicle():
    """Create a new vehicle."""

    data = request.get_json()
    name = data["name"]
    make = data["make"]
    model = data["model"]
    year = data["year"]
    avg_mpg = data["avg_mpg"]
    max_mpg = data["max_mpg"]
    min_mpg = data["min_mpg"]
    efficiency = data["efficiency"]

    user_id = session["user_id"]
    new_vehicle = crud.create_vehicle(name, make, model, year, avg_mpg, max_mpg, min_mpg, efficiency, user_id)

    db.session.add(new_vehicle)
    db.session.commit()

    return {"message": "vehicle added"}

@app.route("/update_vehicle", methods=["POST"])
def update_vehicle():
    """Update a user's vehicle."""

    data = request.get_json()
    name = data["name"]
    make = data["make"]
    model = data["model"]
    year = data["year"]
    avg_mpg = data["avg_mpg"]
    max_mpg = data["max_mpg"]
    min_mpg = data["min_mpg"]
    efficiency = data["efficiency"]

    user_id = session["user_id"]

    crud.update_vehicle(name, make, model, year, avg_mpg, max_mpg, min_mpg, efficiency, user_id)
    db.session.commit()

    return {"message": "vehicle updated"}



@app.route("/friend_requests")
def list_friend_requests(): 
    """Return a list of user's friend requests."""

    user_id = session["user_id"]

    sent_friend_requests = crud.get_sent_friend_requests_by_user_id(user_id)
    received_friend_requests = crud.get_received_friend_requests_by_user_id(user_id)

    data = {
        "sent": [d.to_dict() for d in sent_friend_requests], 
        "received": [d.to_dict() for d in received_friend_requests]
    }

    return data


@app.route("/new_friend_request", methods=["POST"])
def send_friend_request():
    """Send a friend request."""

    # user = crud.get_user_by_id(session["user_id"])

    # the user needs to give us their email for the friend they want to add

    data = request.get_json()
    recipient_email = data["recipient_email"]
    print("*************************************************************************************************************")
    print(recipient_email)
    recipient = crud.get_user_by_email(recipient_email)
    recipient_id = recipient.user_id

    sender_id = session["user_id"]
    new_friend_request = crud.create_friend_request(sender_id, recipient_id)

    db.session.add(new_friend_request)
    db.session.commit()

    return {"message": "friend request sent successfully."}


@app.route("/respond_to_friend_request", methods=["POST"])
def respond_to_friend_request():
    """Respond to a friend request."""

    data = request.get_json()
    decision = data["decision"]
    request_id = data["request_id"]
    sender_id = data["sender_id"]
    user_id = session["user_id"]

    crud.update_friend_request(decision, request_id)

    if decision == "accept": 
        friendship = crud.create_friendship(True, user_id, sender_id)
        db.session.add(friendship)

    db.session.commit()

    return {"message": "friend request handled."}

@app.route("/friends")
def list_friends():
    """Return a list of user's friends."""
    user_id = session["user_id"]

    friends = crud.get_user_friendships_by_user_id(user_id)

    return friends

@app.route("/delete_friendship", methods=["POST"])
def delete_friend(): 
    """Delete a user's friendship."""
    user_id = session["user_id"]
    friend_id = request.get_json()["friend_id"]

    friendship = crud.delete_user_friendship(user_id, friend_id)

    if friendship: 
        db.session.delete(friendship)
        db.session.commit()
        return {"message": "User unfriended."}
    else:
        return {"message": "Friendship does not exist."}


@app.route("/feed")
def list_feed():
    """Return list of user's friends' trip data."""

    user_id = session["user_id"]
    feed = crud.get_user_friendships_data_by_user_id(user_id)

    return feed 


if __name__ == "__main__":
    connect_to_db(app, "final_project") 

    app.run(host="0.0.0.0", debug=True)