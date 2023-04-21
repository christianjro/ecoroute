from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """A user."""
    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    has_personal_vehicle = db.Column(db.Boolean, nullable=False)

    vehicle = db.relationship("Vehicle", uselist=False, back_populates="user")
    trips = db.relationship("Trip", back_populates="user")

    def to_dict(self, has_personal_vehicle):
        if has_personal_vehicle:
            return {
                "id": self.user_id,
                "name": self.name,
                "email": self.email,
                "password": self.password,
                "has_personal_vehicle": self.has_personal_vehicle,
                "vehicle": self.vehicle.to_dict()
            }
        else:
            return {
                "id": self.user_id,
                "name": self.name,
                "email": self.email,
                "password": self.password,
                "has_personal_vehicle": self.has_personal_vehicle,
            }
    
    def __repr__(self):
        return f"<User user_id={self.user_id} name={self.name} email={self.email} has_personal_vehicle={self.has_personal_vehicle}>"

    
class Vehicle(db.Model):
    """A vehicle."""
    __tablename__ = "vehicles"

    vehicle_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=True)
    make = db.Column(db.String, nullable=False)
    model = db.Column(db.String, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    avg_mpg = db.Column(db.Float, nullable=False)
    max_mpg = db.Column(db.Integer, nullable=False)
    min_mpg = db.Column(db.Integer, nullable=False)
    efficiency = db.Column(db.Numeric(precision=10, scale=10), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), unique = True, nullable=True)
    user = db.relationship("User", uselist=False, back_populates="vehicle")

    def to_dict(self):
        return {
            "id": self.vehicle_id,
            "name": self.name,
            "make": self.make,
            "model": self.model,
            "year": self.year,
            "avg_mpg": self.avg_mpg,
            "max_mpg": self.max_mpg,
            "min_mpg": self.min_mpg,
            "efficiency": self.efficiency,
        }

    def __repr__(self):
        return f"<Vehicle vehicle_id={self.vehicle_id} name={self.name} efficiency={self.efficiency} make={self.make}>"

class Trip(db.Model):
    """A trip."""
    __tablename__ = "trips"
    
    trip_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False)
    mode = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)
    origin = db.Column(db.String, nullable=False)
    destination = db.Column(db.String, nullable=False)
    distance = db.Column(db.Float, nullable=False)
    duration = db.Column(db.String, nullable=True)
    ghg_emissions = db.Column(db.Float, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    user = db.relationship("User", back_populates="trips")

    def to_dict(self):
        return {
            "id": self.trip_id,
            "name": self.name,
            "mode": self.mode,
            "date_created": self.date_created,
            "origin": self.origin,
            "destination": self.destination,
            "distance": self.distance,
            "duration": self.duration,
            "ghg_emissions": self.ghg_emissions,
        }
    
    def __repr__(self):
        return f"<Trip trip_id={self.trip_id} name={self.name} mode={self.mode} date_created={self.date_created} starting_point={self.origin} ending_point={self.destination} ghg_emissions={self.ghg_emissions}>"


def connect_to_db(app, db_name="final_project"):
    """Connect the database to our Flask app."""
    app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql:///{db_name}"
    app.config["SQLALCHEMY_ECHO"] = True
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = app
    db.init_app(app)

    print("Connected to DB.")


def create_tables():
    """Create tables in the database."""
    with app.app_context():
        db.create_all()


if __name__ == "__main__":
    from server import app

    connect_to_db(app)