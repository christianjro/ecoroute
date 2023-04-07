from flask import Flask, render_template, request, flash, session, redirect, jsonify
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


if __name__ == "__main__":
    connect_to_db(app, "final_project")

    app.run(host="0.0.0.0", debug=True)