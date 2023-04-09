from model import db, User, Vehicle, Trip, connect_to_db

# Users
def create_user(name, email, password, has_personal_vehicle):
    """Create and return a new user."""

    user = User(name=name, email=email, password=password, has_personal_vehicle=has_personal_vehicle)
    return user

def get_all_users():
    """Return all users."""

    return User.query.all()

def get_user_by_email(email):
    """Return a user by email."""

    return User.query.filter(User.email == email).first()

# Vehicles
def create_vehicle(name, efficiency, make, model, year, user_id):
    """Create and return a new vehicle."""

    vehicle = Vehicle(name=name, efficiency=efficiency, make=make, model=model, year=year, user_id=user_id)
    return vehicle


# Trips
def create_trip(name, mode, date_created, starting_point, ending_point, ghg_emissions, user_id):
    """Create and return a new trip."""

    trip = Trip(name=name, mode=mode, date_created=date_created, starting_point=starting_point, ending_point=ending_point, ghg_emissions=ghg_emissions, user_id=user_id)
    return trip


if __name__ == "__main__":
    from server import app
    connect_to_db(app, "final-project")