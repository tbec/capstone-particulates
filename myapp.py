from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
import pymysql
from config import *
# Import specifics for influxdb and pandas
from influxdb import InfluxDBClient

app = Flask(__name__)
app.config.from_pyfile('./config.py')
# app.config.from_pyfile('./development/config.py')

Bootstrap(app)
db = SQLAlchemy(app)

client = InfluxDBClient(host=INFLUX_HOST,
                         port=INFLUX_PORT,
                         username=INFLUX_USERNAME,
                         password=INFLUX_PASSWORD,
                         database=INFLUX_DATABASE,
                         ssl=INFLUX_SSL,
                         verify_ssl=INFLUX_VERIFY_SSL)


from main import *



if __name__ == "__main__":
    try:
        import googleclouddebugger
        googleclouddebugger.enable()
    except ImportError:
        pass
    print("Running the application...")
    app.jinja_env.auto_reload = True
    app.run(threaded=True, host="localhost", port=5001, debug=True)
