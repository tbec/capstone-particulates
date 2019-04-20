import os

#Configurations that will be imported for the application

SECRET_KEY = os.urandom(32)
#DEBUG = True
SQLALCHEMY_DATABASE_URI = "sqlite:///./test.db"

