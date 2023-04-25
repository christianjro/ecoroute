from model import db, User, Vehicle, Trip, Friendship, FriendRequest, connect_to_db
from datetime import datetime

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

def get_user_by_id(id): 
    """Return user by id."""

    return User.query.filter(User.user_id == id).first()



# Vehicles
def create_vehicle(name, make, model, year, avg_mpg, max_mpg, min_mpg, efficiency, user_id):
    """Create and return a new vehicle."""

    # comment this block out when seeding the DB:
    user = get_user_by_id(user_id)
    if not user.has_personal_vehicle: 
        user.has_personal_vehicle = True

    vehicle = Vehicle(name=name, make=make, model=model, year=year, avg_mpg=avg_mpg, max_mpg=max_mpg, min_mpg=min_mpg, efficiency=efficiency, user_id=user_id)
    return vehicle

def update_vehicle(name, make, model, year, avg_mpg, max_mpg, min_mpg, efficiency, user_id):

    user = get_user_by_id(user_id)
    vehicle = user.vehicle
    vehicle.name = name
    vehicle.make = make
    vehicle.model = model
    vehicle.year = year
    vehicle.avg_mpg = avg_mpg
    vehicle.max_mpg = max_mpg
    vehicle.min_mpg = min_mpg
    vehicle.efficiency = efficiency
    

# Trips
def create_trip(name, mode, date_created, origin, destination, distance, duration, ghg_emissions, user_id):
    """Create and return a new trip."""
    
    date_created = datetime.now()
    trip = Trip(name=name, mode=mode, date_created=date_created, origin=origin, destination=destination, distance=distance, duration=duration, ghg_emissions=ghg_emissions, user_id=user_id)
    return trip

def get_trips_by_user_id(user_id):
    """Return all trips by user id."""

    return Trip.query.filter(Trip.user_id == user_id).all()


#Friend Requests
def create_friend_request(sender_id, recipient_id):
    """Create a friend request."""
    friend_request = FriendRequest(sender_id=sender_id, recipient_id=recipient_id)

    return friend_request

def get_received_friend_requests_by_user_id(user_id):
    """Return all friend requests received by user."""
    return FriendRequest.query.filter(FriendRequest.recipient_id == user_id).all()

def get_sent_friend_requests_by_user_id(user_id): 
    """Return all friend requests sent by user."""
    return FriendRequest.query.filter(FriendRequest.sender_id == user_id).all()

def get_friend_request_by_friend_request_id(friend_request_id):
    """Return a request that matches friend_request_id."""
    return FriendRequest.query.filter(FriendRequest.friend_request_id == friend_request_id).first()

def update_friend_request(decision, request_id):
    """Update friend request with decision."""

    friend_request = get_friend_request_by_friend_request_id(request_id)
    
    if decision == "decline": 
        friend_request.status = "declined"
    elif decision == "accept":
        friend_request.status = "accepted"


#Friendship
def create_friendship(can_view_data, user_id, friend_id):
    """Create a friendship between two users."""

    friendship = Friendship(can_view_data=can_view_data, user_id=user_id, friend_id=friend_id)
    return friendship

def get_user_friendships_by_user_id(user_id):
    """Return all of user's friends with user_id."""

    # need to join query so friendships are two way (if user initiated friendship or not.)
    part_one = Friendship.query.filter(Friendship.user_id == user_id).all()
    part_two = Friendship.query.filter(Friendship.friend_id == user_id).all()

    part_one = [d.to_dict(initiator=True) for d in part_one]
    part_two = [d.to_dict(initiator=False) for d in part_two]

    combo = part_one + part_two
    
    data = {
        "friends": combo
    }

    return data



if __name__ == "__main__":
    from server import app
    connect_to_db(app, "final-project")