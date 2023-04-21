import os
from datetime import datetime

import crud
import model
import server

os.system("dropdb final_project")
os.system("createdb final_project")

model.connect_to_db(server.app, "final_project")
with server.app.app_context():
    model.db.create_all()


# Create users
user1 = crud.create_user("user1", "email1@email.com", "password1", True)
user2 = crud.create_user("user2", "email2@email.com",  "password2", False)
# with server.app.app_context():
#     model.db.session.add_all([user1, user2])
#     model.db.session.commit()

# Create vehicles
vehicle1 = crud.create_vehicle("vehicle1", "make1", "model1", 2001, 30, 35, 29, 1, user1.user_id)
# with server.app.app_context():
#     model.db.session.add_all([vehicle1])
#     model.db.session.commit()

# Create trips
trip1 = crud.create_trip("trip1", "mode1", datetime.now(), "starting_point1", "ending_point1", 10, "10min" , 11, user1.user_id)
trip2 = crud.create_trip("trip2", "mode2", datetime.now(), "starting_point2", "ending_point2", 40, "50min", 11, user1.user_id)
# with server.app.app_context():
#     model.db.session.add_all([trip1, trip2])
#     model.db.session.commit()

user1.trips.extend([trip1, trip2])

with server.app.app_context():
    model.db.session.add_all([user1, user2])
    model.db.session.commit()

with server.app.app_context():
    model.db.session.add_all([vehicle1,trip1, trip2])
    model.db.session.commit()