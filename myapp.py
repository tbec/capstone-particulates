#Do the Basic imports to get the application running

from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy

# Set up the configuration for the application
app = Flask(__name__)
app.config.from_pyfile('config.py')

# Pulls in bootstrap and sqlite DB
Bootstrap(app)
db = SQLAlchemy(app)





# Test whether this line is necessary 
from views import *
if __name__ == "__main__":
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, threaded=True,port=5000)
