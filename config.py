import os

SECRET_KEY = os.urandom(32)
DEBUG = True
# SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://gater:gater@127.0.0.1:3306/login'
# remove connnection below
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://gater:gater@localhost/login?unix_socket=/cloudsql/neat-environs-205720:us-central1:zion'
TEMPLATES_AUTO_RELOAD = True
SQLALCHEMY_TRACK_MODIFICATIONS = False
TEMPLATE_FOLDER = './application/templates/'



