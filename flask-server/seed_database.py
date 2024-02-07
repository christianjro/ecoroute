import os
from datetime import datetime

import crud
import model
import server

os.system("dropdb ecoroute_db")
os.system("createdb ecoroute_db")

model.connect_to_db(server.app, "ecoroute_db")
with server.app.app_context():
    model.db.create_all()

    # Create users
    user1 = crud.create_user("Christian", "christian@email.com", "password123", False)
    user2 = crud.create_user("Hector", "hector@email.com",  "password123", False)
    user3 = crud.create_user("Monse", "monse@email.com",  "password123", False)
    model.db.session.add_all([user1, user2, user3])
    model.db.session.commit()

    # Create vehicles
    vehicle1 = crud.create_vehicle("Car", "Hyundai", "Sonata", 2015, 28.4431, 28, 28, 0.0003147571, user1.user_id)
    vehicle2 = crud.create_vehicle("Car", "Ford", "Mustang", 2019, 18.8779, 19, 18, 0.0004742407, user2.user_id)
    model.db.session.add_all([vehicle1, vehicle2])
    model.db.session.commit()