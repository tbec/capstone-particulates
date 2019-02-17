# SQL ALCHEMY models
# Grabs the dB from my app to be used in the models inheritance
from run import db
from flask_login import UserMixin

# Creates a Model for a User
class User(UserMixin, db.Model):
    __tablename__ = "User"
    id = db.Column(db.Integer, primary_key=True)
    Username = db.Column(db.String(20), unique=True, nullable=False)
    FirstName = db.Column(db.String(20), nullable=False)
    LastName = db.Column(db.String(20), nullable=False)
    Email = db.Column(db.String(50), unique=True, nullable=False)
    Password = db.Column(db.String(80), nullable=False)

class Devices(UserMixin, db.Model):
    __tablename__ = "Devices"
    Username = db.Column(db.String(20), unique=True, nullable=False, primary_key=True)
    DeviceId = db.Column(db.String(12), unique=True, nullable=False, primary_key=True)
    DeviceName = db.Column(db.String(15), unique=True, nullable=False, primary_key=True)


class DeviceLoc(UserMixin, db.Model):
    __tablename__ = "DeviceLoc"
    DeviceId = db.Column(db.String(12), unique=True, nullable=False, primary_key=True)
    Longitude = db.Column(db.Float(6), nullable=False)
    Latitude = db.Column(db.Float(6), nullable=False)




