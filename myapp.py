# Do the Basic imports to get the application running

from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_pyfile('config.py')
Bootstrap(app)
db = SQLAlchemy(app)





# Test whether this line is necessary 
from views import *
if __name__ == "__main__":
    app.run(debug=True)
