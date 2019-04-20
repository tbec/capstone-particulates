# SQL ALCHEMY models
# Grabs the dB from my app to be used in the models inheritance
from myapp import db
from flask_login import UserMixin

# Creates a Model for a User
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(80))
