from flask import Flask, render_template, request, flash, session, redirect, jsonify, make_response
from flask_cors import CORS
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
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
            return {"message": "User logged in successfully."}
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

if __name__ == "__main__":
    connect_to_db(app, "final_project")

    app.run(host="0.0.0.0", debug=True)