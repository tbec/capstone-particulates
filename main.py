import io
# Grab app and database from the start file
from run import app, db, client

#import db model for a User to login
from models import User, Devices, DeviceLoc, DeviceInfo
# Import forms used in the app
from forms import *

# imports query options for sqlalchemy
from sqlalchemy import and_, or_

# Imports for flask, login management, and security
from flask import Flask, redirect, render_template, url_for, request, flash, abort, jsonify, json, send_file, make_response, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required,logout_user, current_user
from datetime import datetime



# Instantiate login manager
loginManager = LoginManager()
loginManager.init_app(app)
loginManager.login_view = "index"


################ App Routes  ################

@app.route("/contact")
def contact():
    active = False
    if current_user.is_active:
        active = True
    return render_template("contact.html", active=active)

@app.route("/welcome")
def welcome():
    active = False
    if current_user.is_active:
        active = True
    return render_template("welcome.html", active=active)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory("./",
                               'favicon.ico', mimetype='ximage/vnd.microsoft.icon')
@app.route('/')
def index():
    if current_user.is_active:
        return render_template('index.html',username=current_user.Username,logged_in= True)
    return redirect(url_for('welcome'))
    
@app.route("/tutorial")
def tutorial():
    return render_template("tutorial.html")

@app.route("/devices",methods=["GET"])
@login_required
def devices():
    form = AddDevice()
    try:
        devices = Devices.query.filter_by(Username=current_user.Username).all()
    except:
            flash("It appears there was an error.", category='alert alert-danger _login')
    return render_template("devices.html", form = form, devices = devices)

# TODO give users ability to update their devices
@app.route('/devices/add', methods=["POST"])
@login_required
def addDevice():
    form = AddDevice()

    # If the form doesn't validate it will give it's own error message upon returning form
    if form.validate_on_submit():
        # If the form validates but the username doesn't match the logged in user flash error
        if form.username.data != current_user.Username:
            flash('Enter your username correctly.', category='alert alert-danger _login')
        else:
            try:
                db.session.add(Devices(Username=form.username.data, DeviceId=form.deviceid.data, DeviceName=form.devicename.data))
                db.session.commit()
                flash('Device Added', category='success alert-success _login')
            except Exception as e:
                flash("Error adding device. Id and Name must be unique from previous devices.", category='alert alert-danger _login')
                db.session.rollback()
    else:
        flash(form.errors['deviceid'][0], category='alert alert-danger _login')

    try:
        devices = Devices.query.filter_by(Username=current_user.Username).all()
    except:
        flash("It appears there was an error.", category='alert alert-danger _login')
    return render_template("devices.html", form = form, devices = devices)
        
# Deletes a given device from the DB. Excepts the caller to use Try Except
def deleteDeviceFromDb(device):
    db.session.delete(device)
    db.session.commit()

@app.route("/graphs", methods=["GET"])
def graphs():
    return render_template("graph.html")

@app.route('/devices/edit/<string:deviceId>', methods=["GET"])
@login_required
def editDevice(deviceId):
    form = ChangeDeviceName()

    current_device = None

    # If there's an error accessing the DB, flash it and return to previous page
    try:
        current_device = Devices.query.filter(and_(Devices.Username == current_user.Username, Devices.DeviceId ==deviceId)).first()
    except Exception as e:
        flash("It appears there was an error.", category='alert alert-danger _login')
        return redirect(url_for("devices"))

    # If the device was not found, flash it and return to previous page
    if current_device is None:
        flash("No device found with device Id: " + deviceId, category='alert alert-danger _login')
        return redirect(url_for("devices"))

    return render_template("editdevice.html", device=current_device, form=form)

@app.route("/devices/edit/<string:deviceId>", methods=["POST"])
@login_required
def editDeviceProperty(deviceId):
        form = ChangeDeviceName()

        current_device = None

        # Error handle a db access
        try:
            current_device = Devices.query.filter(and_(Devices.Username == current_user.Username, Devices.DeviceId ==deviceId)).first()
        except Exception as e:
            flash("It appears there was an error.", category='alert alert-danger _login')
            return redirect(url_for("devices"))

        # Checks whether the edit form validated            
        if form.validate_on_submit():
            
            if current_device is None:
                flash("No device found with device Id: " + deviceId, category='alert alert-danger _login')
                return redirect(url_for("devices", deviceId=deviceId))
            else:
                current_device.DeviceName = form.devicename.data
                db.session.commit()
                flash('Device name successfully updated!', category='alert alert-success _login')
                return redirect(url_for("devices"))
        else:
            flash("Field must be between 1 and 15 characters long.", category='alert alert-danger _login')
            return render_template("editdevice.html", device=current_device, form=form)

@app.route("/devices/remove/<string:deviceId>")
@login_required
def removeDevice(deviceId):
    current_device = Devices.query.filter(and_(Devices.Username == current_user.Username, Devices.DeviceId ==deviceId)).first()
    
    if current_device:
        try:
            deleteDeviceFromDb(current_device)
            flash('Device successfully removed!', category='alert alert-success _login')

        except Exception as e:
            flash("It appears there was an error.", category='alert alert-danger _login')
    else:
        flash("Device not found.", category='alert alert-danger _login')
    return redirect(url_for("devices"))


@app.route("/account/edit/<string:value>", methods=["GET", "POST"])
@login_required
def editAccount(value):
    # Grab the right form
    form = getForm(value)
    if not form:
        return redirect(url_for('account'))

    # If its a get request render template with that form
    if request.method == "GET":
        return render_template("editaccount.html", form=form, user=current_user, value=value)
    elif request.method == "POST":
        # If the form validated attempt to write it to the db, return them to account if there was a success
        if form.validate_on_submit():
            try:
                updateValue(form, value)
                flash(getField(value)+ " updated!", category='alert alert-success')   
                return redirect(url_for('account'))
            except Exception as e:
                db.session.rollback()
                flash("The input is not valid please reconsider.", category='alert alert-danger')
                return render_template("editaccount.html", form=form, user=current_user, value=value)
        else:
            # The form did not validate so flash appropriate message
            if value == "firstName":
                flash(form.errors['firstname'][0], category='alert alert-danger')
            elif value == "lastName":
                flash(form.errors['lastname'][0], category='alert alert-danger')
            elif value == "username":
                flash(form.errors['username'][0], category='alert alert-danger')
            elif value == "email":
                flash(form.errors['email'][0], category='alert alert-danger')
            elif value == "password":
                flash(form.errors['password'][0], category='alert alert-danger')
            return render_template("editaccount.html", form=form, user=current_user, value=value)


@app.route('/account')
@login_required
def account():
    return render_template('account.html', user=current_user)

@app.route('/analytics',methods=["GET"])
@login_required
def analytics():
    return render_template('analytics.html')

@app.route('/analytics', methods=["POST"])
@login_required
def getData():
    params = request.form.to_dict()
    flashMessage = ""
    validParameter, errorMessage = validateQueryParameters(params)
    values = []
    devicesDataFrames = []
    # devices = validateDeviceNames(params["ids"].split(","))
    devices = params["ids"].split(",")
    
    if len(devices) == 0 or devices[0] == "":
        if (params["ids"] is None or params["ids"] == ""):
            validParameter = False
            errorMessage = "No devices were selected."
        else:
            devices = []
            devices.append(params["ids"])
    if not validParameter:
        flash(errorMessage, category='alert alert-danger')
    else:
        queryTemplateString = createSqlQueryFromParameters(params)
        queries = subDeviceIntoQuery(queryTemplateString, devices)
        devicesDataFrames, errorMessages = queryForEachDevice(queries)
        if len(errorMessages) > 0:
            flash(constructDeviceErrors(errorMessages), category='alert alert-danger')
        else:
            flash("Query Success!", category='alert alert-success')
    return render_template('analytics.html', queryData=devicesDataFrames, params=params)

@app.route('/map')
@login_required
def map():
    nodes = DeviceInfo.query.all()
    return render_template('map.html', user = current_user, nodes=convertListToDictionary(nodes))

# TODO Remove the cart
@app.route('/logout')
@login_required
def logout():
    # Reset the MAC ID for devices, log the user out
    logout_user()
    return redirect(url_for('welcome'))

#TODO dont make it a file but data itself
@app.route('/download')
def download():
    return send_file('static/pollution.csv', mimetype="text/csv", attachment_filename="pollution.csv", as_attachment=True)

# TODO make other error pages
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/login', methods=['GET','POST'])
def login():
    # Create the two forms for login or create
    form = LoginForm(prefix='log')
    reg_form = RegisterForm()

    #If it was a post request check which form was being validated
    if request.method == 'POST':
        # Checks whether the login for was submitted, refreshes the signup and validates the user
        if request.form['form_type'] == 'login':
            return validateLogin(form)
        elif request.form['form_type'] == 'register':
            return validateRegistration(reg_form)
    return render_template('login.html', form=form,reg=reg_form, active="login")


#TODO Create a cron job that updates the flag coordinates
@app.route("/UpdateFlags", methods=["POST"])
def chronUpdateFlags():
    print("start:")
    print(datetime.now())
    ret = {}
    try:
        data = {}

        idList = []
        # Loops through and grabs all the UNIQUE ID's from air db
        for id in client.query('show tag values from "airQuality" with key = "ID"').get_points():
            idList.append(id)

        # runs the list, grabbing average long lat and other pollution details
        for id in idList:
            query = 'select "Longitude", "Latitude" from "airQuality" where "ID" = \'' + id["value"] + '\' and "Longitude" != 0 order by time desc limit 5'
            coords = AverageCords(client.query(query).get_points())
            pollutants = client.query('SELECT * FROM "airQuality" where "ID" = \'' + id["value"] + '\' order by time desc limit 1').get_points()
            data[id["value"]] = ConstructValuesFromDataPoints(coords, pollutants)

        # Updates the queried data to db
        updateFlagDetailsAirU(data)
        ## UNCOMMENT THE CODE BELOW TO ADD PURPLE AIR SENSORS
        # print("REgulars:")
        # print(datetime.now())
        # # Switches to the other database to get the ID and Values for the other DB. REPEAT
        # switchClientDB("defaultdb")
        # idList = []
        # # Loops through and grabs all the UNIQUE ID's from air db
        # for id in client.query('show tag values from "airQuality" with key = "ID"').get_points():
        #     idList.append(id)

        # data = {}
        # # runs the list, grabbing average long lat and other pollution details
        # for id in idList:
        #     query = 'select "Longitude", "Latitude", /pm1./ from "airQuality" where "ID" = \'' + id["value"] + '\' and "Longitude" != 0 order by time desc limit 5'
        #     coords = AverageCords(client.query(query).get_points())
        #     pollutants = client.query('SELECT * FROM "airQuality" where "ID" = \'' + id["value"] + '\' order by time desc limit 1').get_points()
        #     data[id["value"]] = ConstructValuesFromDataPointsDefaultDb(coords, pollutants)
        # updateFlagDetailsDefaultDb(data)
        # # Switches Back 'default'
        # switchClientDB("airU")
        ret["sucess"] = "True"
        print("Done:")  
        print(datetime.now())
    except Exception as e:
        ret["sucess"] = "False"
    return jsonify(json.dumps(ret))



# Goes through and updates the latest reading for everydevice to be used for Map layers
def updateFlagDetailsDefaultDb(data):
    options = ["CO (ppm)","Humidity (%)","NOx (ppm)","Temp (*C)","pm1.0 (ug/m^3)","pm10.0 (ug/m^3)","pm2.5 (ug/m^3)"]
    # loops through each object and extracts its data to be put into the DB
    for id in data:
        deviceId = id
        longitude = data[id]["longitude"]
        latitude = data[id]["latitude"]
        co = data[id]["CO (ppm)"]
        no = data[id]["NOx (ppm)"]
        pm1 = data[id]["pm1.0 (ug/m^3)"]
        pm25 = data[id]["pm2.5 (ug/m^3)"]
        pm10 = data[id]["pm10.0 (ug/m^3)"]
        humidity = data[id]["Humidity (%)"]
        temperature = data[id]["Temp (*C)"]
        try:
            currentDevice = DeviceInfo.query.filter_by(DeviceId=deviceId).first()
            if currentDevice is None:
                new_device = DeviceInfo(DeviceId = deviceId, Longitude=longitude, Latitude=latitude, CO=co, NO=no, Humidity=humidity, PM1 = pm1, PM25=pm25, PM10=pm10, Temperature=temperature)
                db.session.add(new_device)
            else:
                currentDevice.DeviceId = deviceId
                currentDevice.Longitude = longitude
                currentDevice.Latitude = latitude
                currentDevice.CO = co
                currentDevice.NO = no
                currentDevice.PM1 = pm1
                currentDevice.PM25 = pm25
                currentDevice.PM10 = pm10
                currentDevice.Humidity = humidity
                currentDevice.Temperature = temperature
            db.session.commit()
        except Exception as e:
            db.session.rollback()

# Goes through and updates the latest reading for everydevice to be used for Map layers
def updateFlagDetailsAirU(data):
    # loops through each object and extracts its data to be put into the DB
    for id in data:
        deviceId = id
        longitude = data[id]["longitude"]
        latitude = data[id]["latitude"]
        co = data[id]["CO"]
        no = data[id]["NO"]
        pm1 = data[id]["PM1"]
        pm25 = data[id]["PM2.5"]
        pm10 = data[id]["PM10"]
        humidity = data[id]["Humidity"]
        temperature = data[id]["Temperature"]
        try:
            currentDevice = DeviceInfo.query.filter_by(DeviceId=deviceId).first()
            if currentDevice is None:
                new_device = DeviceInfo(DeviceId = deviceId, Longitude=longitude, Latitude=latitude, CO=co, NO=no, Humidity=humidity, PM1 = pm1, PM25=pm25, PM10=pm10, Temperature=temperature)
                db.session.add(new_device)
            else:
                currentDevice.DeviceId = deviceId
                currentDevice.Longitude = longitude
                currentDevice.Latitude = latitude
                currentDevice.CO = co
                currentDevice.NO = no
                currentDevice.PM1 = pm1
                currentDevice.PM25 = pm25
                currentDevice.PM10 = pm10
                currentDevice.Humidity = humidity
                currentDevice.Temperature = temperature
            db.session.commit()
        except Exception as e:
            db.session.rollback()

# Takes in Coordinates and pollution query from the DEFAULT DB, extract the data to dict
def ConstructValuesFromDataPointsDefaultDb(coords, pollutants):
    ret = {}
    options = ["CO (ppm)","Humidity (%)","NOx (ppm)","Temp (*C)","pm1.0 (ug/m^3)","pm10.0 (ug/m^3)","pm2.5 (ug/m^3)"]
    # Grabs the Longitude and Latitude
    for key in coords:
        ret[key] = coords[key]

    # Grabs the pollution row for the generator
    pollutions = None

    for pollutant in pollutants: 
        pollutions = pollutant

    for option in options:
        try:
            if pollutions[option] is None:
                ret[option] = 0
            else:
                ret[option] = pollutions[option]
        except Exception as e:
            ret[option] = 0
    return ret
# Takes in Coordinates and pollution query airU DB, extract the data to dict
def ConstructValuesFromDataPoints(coords, pollutants):
    ret = {}
    options = ["CO","NO","Humidity","PM1","PM2.5","PM10","Temperature"]
    # Grabs the Longitude and Latitude
    for key in coords:
        ret[key] = coords[key]

    pollutions = None

    for pollutant in pollutants: 
        pollutions = pollutant

    for option in options:
        try:
            if pollutions[option] is None:
                ret[option] = 0
            else:
                ret[option] = pollutions[option]
        except Exception as e:
            ret[option] = 0

    # if pollutions["CO"] is None:
    #     ret["CO"] = "0"
    # else:
    #     ret["CO"] = pollutions["CO"] 

    # if pollutions["NO"] is None:
    #     ret["NO"] = "0"
    # else:
    #     ret["NO"] = pollutions["NO"] 

    # #Extracts the readings from the pollution
    # ret["Humidity"] = pollutions["Humidity"] 
    # ret["PM1"] = pollutions["PM1"] 
    # ret["PM2.5"] = pollutions["PM2.5"] 
    # ret["PM10"] = pollutions["PM10"] 
    # ret["Temperature"] = pollutions["Temperature"] 

    return ret

# Takes coordinates. Adds them up and averages them over their count
def AverageCords(coords):
    x =2
    count = 0
    lng = 0
    lat = 0
    ret = {}
    for cord in coords:
        lng += float(cord["Longitude"])
        lat += float(cord["Latitude"])
        count += 1
    if count != 0:
        ret["longitude"] = lng / count
        ret["latitude"] = lat / count
    else:
        ret["longitude"] = 0
        ret["latitude"] = 0
    return ret


# Grabs the last row from the Chron Job Data base
@app.route("/mydevice/info", methods=["POST","GET"])
def getMyDeviceInfo():
    params = request.json
    
    ret = {}
    ret["value"] = {}
    try:
        deviceInfo = DeviceInfo.query.filter_by(DeviceId=params["id"]).first()
        ret["value"]["id"] = params["id"]
        ret["value"]["long"] = deviceInfo.Longitude 
        ret["value"]["lat"] = deviceInfo.Latitude 
        ret["success"] = "true"
    except Exception as e:
        ret["success"] = "false"
    return jsonify(json.dumps(ret))
################                         ################
################                         ################
################ DB QUERY HELPER METHODS ################
################                         ################
################                         ################

# Updates the client to be using the passes db
def switchClientDB(db):
    client.switch_database(db)
# Goes through each device that had an error and constructs a error string
def constructDeviceErrors(devices):
    value = ""
    for i in range(0, len(devices)):
        if (i == len(devices)-1):
            value += devices[i] + " had an error."
        else:
            value += devices[i] + ", "
    return value

# Goes through each device and grabs the query set for a device
def queryForEachDevice(devicesWithQueries):
    deviceDataFrames = {}
    errorMessages = []
    for deviceId in devicesWithQueries:
        deviceDataFrames[deviceId] = []
        try:
            df = client.query(devicesWithQueries[deviceId], chunked=True)
            for rows in df:
                for row in rows:
                    deviceDataFrames[deviceId].append(row)
        except Exception as e:
            errorMessages.append(deviceId)
    return deviceDataFrames,errorMessages


# Returns a dictionary KEY = DeviceID Value = query
def subDeviceIntoQuery(template, devices):
    subQueries = []
    queries = {}
    for device in devices:
        queries[device] = template.replace("VALUE", device)
    return queries

# Validates that a newly added device passes the DB constraints
def validateDeviceNames(devices):
    validDevices = []
    for device in devices:

        #create a data object the form can map from
        currentDevice = {}
        currentDevice['deviceid'] = device
        
        # Create the form to validate the name of the device id
        deviceForm = ValidateDeviceIdAPI(meta={'csrf': False})
        deviceForm.process(data=currentDevice)

        # If it's vaild add it to devices
        if deviceForm.validate():
            validDevices.append(device)

    return validDevices

# Returns a list of pollutants the query is to be executed on.
def getPollutantTypes(params):
    pollutants = ["pm1","pm2.5","pm10","no","Temperature", "co", "Humidity"]
    requsetedPollutants = []
    for pollutant in pollutants:
        if pollutant in params.keys():
            requsetedPollutants.append(pollutant)
    return requsetedPollutants


# If the user chose MEAN, add the constraint that -1 readings are considered bad
def addMeanConstraint(pollutants):
    noCapital = ["Temperature", "Humidity"]
    query = "and"
    for pollutant in pollutants:
        if pollutant not in noCapital:
            query+= (' "'+ pollutant.upper() + '" != -1 and')
        else:
            query+= (' "' + pollutant + '" != -1 and')
    return query
# Dynamically creates the Query strings based off user Queries
def createSqlQueryFromParameters(params):
    query = "SELECT"

    # Grab a list of pollutants requested
    pollutants = getPollutantTypes(params)
    query += getQueryOperation(params['operation'], pollutants)

    query += ' FROM "airQuality"'

    if(params['operation'] == "mean"):
        query += ' WHERE "ID" = \'VALUE\' ' + addMeanConstraint(pollutants)
    else:
        query += ' WHERE "ID" = \'VALUE\' AND'  

    query += addTimeBounds(params['from-date'] + " " + params['from-time'],">=")
    query += " AND"
    query += addTimeBounds(params['to-date'] + " " + params['to-time'],"<=")
    query += ' order by time desc' 
    # Adds a query limit if it was passed in. For preview tool 60 is default 
    query += addLimitValue(params)
    return query


def addLimitValue(params):
    limitQuery = " limit "
    # If a limit was passed in then add that to the string
    if ("limit" in params.keys()):
        if(params["limit"] is None):
            limitQuery = ""
        else:
            limitQuery += str(params["limit"])
    else:
        limitQuery += str(60)
    return limitQuery

# Helper function to add time bounds to a query
def addTimeBounds(dateTime, operator):
    return  ' "time" '  + operator + " \'" + dateTime + "\'" 


# Constructs the 'Select' clause for the Queries
def getQueryOperation(operation, pollutants):
    selectionStatement = ""
    keyword = ''
    if operation == "max":
        keyword = "MAX"
    elif operation == "min":
        keyword = "MIN"

    elif operation == "mean":
        keyword = "MEAN"
    else:
        # Default statement with particulate matter comma seperated.
        for i in range(0, len(pollutants)):
            if i == len(pollutants) - 1:
                selectionStatement += defaultQuerySelect(pollutants[i],"")
            else:
                selectionStatement += defaultQuerySelect(pollutants[i],",")
        return selectionStatement

    # Special MIN,MAX query construction
    for i in range(0, len(pollutants)):
        if i == len(pollutants) - 1:
            selectionStatement += (constructSelectStatement(keyword, pollutants[i],""))
        else:
            selectionStatement += (constructSelectStatement(keyword, pollutants[i],","))
    return selectionStatement

# Returns Default select statement listing out the pollutants
def defaultQuerySelect(pollutant, seperator):
    noCapital = ["Temperature", "Humidity"]
    if pollutant in noCapital:
        return ' "' + pollutant +'"' + seperator
    return ' "' + pollutant.upper() +'"' + seperator

# Creates a statement such as MAX(pm1) as pm1. convention is to have " " at beginning
def constructSelectStatement(modifier, particulateType, seperator):
    noCapital = ["Temperature", "Humidity"]
    if particulateType in noCapital:
            statement = ' ' + modifier + '("' + particulateType+ '") as "' + particulateType+'"' + seperator
    else:
        # For pm1, pm2.5, pm10, co, no all need to be capitalized
        statement = ' ' + modifier + '("' + particulateType.upper() + '") as "' + particulateType.upper() +'"' + seperator
    return statement

# Returns True if all parameters are validated, else False with description
def validateQueryParameters(params):
    keys = params.keys()
    # validates a particulate type was chosen
    if 'pm1' not in keys and 'pm2.5' not in keys and 'pm10' not in keys and 'no' not in keys and "co" not in keys and "humidity" not in keys and "temperature" not in keys:
        return False, "No pollutant was selected."

    validOperations = ["default","mean","min","max"]
    # validates that a 'math expression' was chosen
    if 'operation' not in keys or params["operation"] not in validOperations:
        return False, "Invalid operation requested."
    

    # Checks that from date is there
    if 'from-date' not in keys and not paramDateValidation(params['from-date']):
        return False, "Invalid 'From Date'."
    if 'to-date' not in keys and not paramDateValidation(params['to-date']):
        return False, "Invalid 'To Date'."

    try:
        if validateDateOrTime(params["from-time"],"%H:%M"):
            params["from-time"] = datetime.strptime(params["from-time"],"%H:%M").strftime("%H:%M:%S")
        else:
            params["from-time"] = datetime.strptime(params["from-time"],"%H:%M:%S").strftime("%H:%M:%S")
    except ValueError:
        return False, "Invalidate 'From Time' format"
    #Checks and validates the time input
    if 'from-time' not in keys:#and not paramTimeValidation(params['from-time'])
        return False, "Invalid 'From Time' value"

    try:
        if validateDateOrTime(params["to-time"],"%H:%M"):
            params["to-time"] = datetime.strptime(params["to-time"],"%H:%M").strftime("%H:%M:%S")
        else:
            params["to-time"] = datetime.strptime(params["to-time"],"%H:%M:%S").strftime("%H:%M:%S")
    except ValueError:
        return False, "Invalidate 'To Time' Format."

    if 'to-time' not in keys and not paramTimeValidation(params['to-time']):
        return False, "Invalid 'To Time' value"
    return True, "Valid parameters"

# Validates that a dateString is valid format
def paramDateValidation(dateString):
    return validateDateOrTime(dateString,"Y-%m-%d")

# Validates a time string's format
def paramTimeValidation(timeString):
    passes = True if validateDateOrTime(timeString,"%H:%M:%S") else validateDateOrTime(timeString,"%H:%M")
    return passes

# Given a date or time validates the correctness of it
def validateDateOrTime(date_text, format):
    try:
        validatedAndBack = datetime.strptime(date_text, format).strftime(format)
        if date_text != validatedAndBack:
            raise ValueError
        return True
    except ValueError:
        return False

# Takes a DeviceInfo Record and converts it to a dictionary to be passed to view
def convertListToDictionary(nodeList):
    nodes = []
    for node in nodeList:
        n = {}
        n["id"] = node.DeviceId
        n["lat"] = node.Latitude
        n["long"] = node.Longitude
        n["co"] = node.CO
        n["no"] = node.NO
        n["pm1"] = node.PM1
        n["pm2.5"] = node.PM25
        n["pm10"] = node.PM10
        n["temperature"] = node.Temperature
        n["humidity"] = node.Humidity

        if(node.display is None):
            n["display"] = "True"
        elif(node.display):
            n["display"] = "True"
        else:
            n["display"] = "False"

        nodes.append(n)
    return nodes

# Given a list of device ID's get all the average long and latitude
def queryForLongLat(IDS):
    nodes = []
    for id in IDS:
        current_node = {}
        lat = querySpecificFieldFromMeasurement("Latitude", "airQuality", id[1])
        # lat = client.query('select "Latitude" from "airQuality" where "ID" = \'%s\'' % id[1])
        longitude = querySpecificFieldFromMeasurement("Longitude", "airQuality", id[1])
        # PM1 PM10 PM2.5
        pm1 = querySpecificFieldFromMeasurement("PM1", "airQuality", id[1])
        pm10 = querySpecificFieldFromMeasurement("PM10", "airQuality", id[1])
        pm25 = querySpecificFieldFromMeasurement("PM2.5", "airQuality", id[1])
        no = querySpecificFieldFromMeasurement("NO", "airQuality", id[1])
        co = querySpecificFieldFromMeasurement("CO", "airQuality", id[1])
        # TODO JUST query for MEAN over last 5 readings or so
        # longitude = client.query('select "Longitude" from "airQuality" where "ID" = \'%s\'' % id[1])
        current_node['id'] = id[1]
        # Dig down to get the raw longitudes and return their average
        current_node['lat'] = retAvg(lat.raw['series'][0]['values'])
        current_node['lng'] = retAvg(longitude.raw['series'][0]['values'])
        if current_node['lat'] != -1 and current_node['lng'] != -1:
            nodes.append(current_node)

    for node in nodes:
        try:
            db.session.add(DeviceLoc(DeviceId=node["id"], Longitude=node["lng"], Latitude=node["lat"]))
        except:
            print(node)
    db.session.commit()
    return nodes

# Returns a query for a specific parameter, db, and id
def querySpecificFieldFromMeasurement(field, db, id):
    query = ('select "' + field + '" from "' + db + '" where "ID" = \'%s\'' % id) 
    return client.query(query)

# given a list of numbers return the average
def retAvg(values):
    sum = 0
    count = 0
    for val in values:
        if val[1] != 0:
            sum += val[1]
            count += 1
    if count != 0:
        return sum/count
    return -1


################                     ################
################                     ################
################ VIEW HELPER METHODS ################
################                     ################
################                     ################

#Does login form validation rendering the appropriate view
def validateLogin(form):
    if form.validate_on_submit():
        user = userExists(form.username.data)
        if user:
            if check_password_hash(user.Password, form.password.data):
                # Use login manager with the logged in user and redirect
                login_user(user, remember=form.remember.data)
                return redirect(url_for('index'))
        
    flash('Invalid username or password', category='alert alert-danger _login')
    return render_template('login.html', form=form, reg=RegisterForm(), active="login")

# If the form validates, adds a new user to the DB. Excepts called to use "Try" "Except"
def addNewUserToDb(form):
    if form.validate():
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        new_user = User(Username=form.username.data, Email=form.email.data, Password=hashed_password, FirstName=form.firstname.data, LastName=form.lastname.data)
        db.session.add(new_user)
        db.session.commit()

#Does registration form validation rendering the appropriate view
def validateRegistration(form):
    if form.validate_on_submit():
        # Checks the uniqueness of username and email, create one and direct back to the login screen
        user_exists = userExists(form.username.data)
        email_exists = emailExists(form.email.data)

        # Validate that both the email and username are not taken, hash the password --> put the user in the db
        if not user_exists and not email_exists:
            try:
                addNewUserToDb(form)
            except Exception as e:
                db.session.rollback()
                # Something went wrong with the registration process
                flash('Clear Fields and try again', category='alert alert-danger _reg')
                return render_template('login.html', form=LoginForm(prefix='log'),reg=form, active="signup")

            # If there were no errors and the user created
            flash('User successfully created!', category='alert alert-success _login')
            return render_template('login.html', form=LoginForm(prefix='log'),reg=form, active="login")
                        # refresh the login form so it doesn't error out

        # Sends a warning about whether the Username or Email exists
        if user_exists:
            flash('Username taken!', category='alert alert-danger _reg')
        else:
            flash('Email taken!', category='alert alert-danger _reg')

    return render_template('login.html', form=LoginForm(prefix='log'),reg=form, active="signup")

# Checks whether the user exists
def userExists(name):
    return User.query.filter_by(Username=name).first()

# checks whether the email exists
def emailExists(email):
    return User.query.filter_by(Email=email).first()
    


################                      ################
################                      ################
################ MOBILE APP API CALLS ################
################                      ################
################                      ################




# // Returns an average of that days readings for a device: id, timestamp
@app.route("/devices/dataFromDate", methods=["GET"])
# @login_required
def getDataFromDate():
    params = request.args.to_dict()
    ret = {}
    ret["value"] = ""
    try:
        query = 'select MEAN("CO") as "CO", MEAN("NO") as "NO", MEAN("Humidity") as "Humidity", MEAN("PM1") as "PM1", MEAN("PM10") as "PM10", MEAN("PM2.5") as "PM2.5", MEAN("Temperature") as "Temperature" from "airQuality" where "ID" = ' + "'" + params["id"] + "' and" + addTimeBounds(params["timestamp"], ">=") + ' order by time desc limit 1440'
        df = client.query(query, chunked=True).get_points()
        for singleRecord in df:
            ret["value"] = singleRecord
        ret["success"] = "true"
    except Exception as e:
        ret["success"] = "false"
    return jsonify(ret)


# Returns the user details for an account. Used for username changes and update views on mobile
@app.route("/user/refresh", methods=["GET"])
@login_required
def refreshUser():
    user = User.query.filter_by(Username=current_user.Username).first()
    userDetails = {}
    if(user):
        userDetails["success"] = True
        userDetails["username"] = user.Username
        userDetails["firstname"] = user.FirstName
        userDetails["lastname"] = user.LastName
        userDetails["email"] = user.Email
    else:
        userDetails["success"] = False
    return jsonify(json.dumps(userDetails))
    

@app.route("/mobile/play", methods=["POST"])
def test():
    params = request.args.to_dict()
    x = 2
    new_device = AddDeviceAPI(meta={'csrf': False})
    new_device.process(data=params)

    if new_device.validate():
        return jsonify(json.dumps({'DidItwork?':"True"}))
    else:
        return jsonify(json.dumps({'DidItwork?':"False"}))


# Call for mobile app to make to create a new user
@app.route("/mobile/register/user", methods=["POST"])
def createNewUser():
    # Grabs the parameters and creates a RegisterUserForm
    params = request.args.to_dict()
    form = RegisterFormAPI(data=params, meta={'csrf':False})

    response = {}
    # If the form validates check whether the email and username is unique
    if form.validate():
        user_exists = userExists(form.username.data)
        email_exists = emailExists(form.email.data)

        # Validate that both the email and username are not taken
        if not user_exists and not email_exists:
            try:
                addNewUserToDb(form)
                response['success'] = True
            except Exception as e:
                response['success'] = False

        else:
            response['success'] = False
            errors = {}
            if user_exists:
                errors['username'] = ["username already exists"]
            if email_exists:
                errors['email'] = ["email already exists"]
            response['errors'] = errors

    else:
        response['success'] = False
        response['errors'] = form.errors
    return jsonify(json.dumps(response))

@app.route("/mobile/login", methods=["POST"])
def loginUser():
    params = request.args.to_dict()
    form = LoginFormAPI(data=params, meta={'csrf':False})

    # Check whether the fields validate the form
    if form.validate():
        user = userExists(form.username.data)

        # If the user exists and password matches, log the use in
        if user and check_password_hash(user.Password, form.password.data):
            login_user(user)
            return jsonify(json.dumps(GenerateResponseCodes(True)))
        else:
            errors = {'login' :["invalid username or password."] } 
            return jsonify(json.dumps(GenerateResponseCodes(False, errors)))
    # Return to the user that the login failed
    else:
        return jsonify(json.dumps(GenerateResponseCodes(False, form.errors)))


@app.route("/downloadcsv", methods=["POST"])
def downloadcsv():
    params = request.get_json(force=True)


    outfile = io.StringIO()
    validParameter, errorMessage = validateQueryParameters(params)
    values = []
    devicesDataFrames = []
    devices = validateDeviceNames(params["ids"].split(","))
    status = "OK"
    # if len(devices) != 1:
    #     validParameter = False
    #     status = "Error"
    #     errorMessage = "A single device is required to query against."
    if validParameter:
        queryTemplateString = createSqlQueryFromParameters(params)
        queries = subDeviceIntoQuery(queryTemplateString, devices)
        devicesDataFrames, errorMessages = queryForEachDevice(queries)
        if len(errorMessages) > 0:
            status = "Error"

        # Grabs the keys from the query and the keys('ids') from the dataframes
        keys = None
        for dId in devicesDataFrames:
            if len(devicesDataFrames[dId]) > 0:
                keys = list(devicesDataFrames[dId][0].keys())
                break
    
        if keys is not None:
            deviceIds = list(devicesDataFrames.keys())
            # Prints the keys on the top row
            outfile.write("deviceId"+ ",")
            for i in range(0,len(keys)):
                if i == len(keys) - 1:
                    outfile.write(keys[i] + "\n")
                else:
                    outfile.write(keys[i] + ",")
            for i in range(0, len(deviceIds)):
                for j in range(0, len(devicesDataFrames[deviceIds[i]])):
                    outfile.write(deviceIds[i] + ",")
                    for k in range(0, len(keys)):
                        if  k == len(keys) - 1:
                            outfile.write(str(devicesDataFrames[deviceIds[i]][j][keys[k]]) + "\n")
                        else:
                            outfile.write(str(devicesDataFrames[deviceIds[i]][j][keys[k]]) + ",")
        else:
            status = "Error"
            error = "There was no result set."

    else:
        status = "Error"
    resp = make_response(outfile.getvalue())
    resp.headers["Content-Disposition"] = "attachment; filename=export.csv"
    resp.headers["Content-type"] = "text/csv"
    resp.headers["error"] = errorMessage
    resp.headers["filename"] = params["filename"]
    resp.headers["statusText"] = "OK"

    return resp

@app.route("/mobile/device/add", methods=["POST"])
@login_required
def addDeviceToDb():
    params = request.args.to_dict()
    form = AddDeviceAPI(data=params, meta={'csrf':False})

    response = {}

    if form.validate():
        try:
            db.session.add(Devices(Username=current_user.Username, DeviceName=form.devicename.data, DeviceId=form.deviceid.data))
            db.session.commit()

            response["success"] = True

        except Exception as e:
            db.session.rollback()

            response["success"] = False

            errors = {} 
            errors['device'] = ["Unable to add Device"]
            response['errors'] = errors
    else:
            response["success"] = False
            response['errors'] = form.errors
    return jsonify(json.dumps(response))


# Generates the response message, if there are no errors pass back empty dictionary
def GenerateResponseCodes(success, errors = {}):
    response = {}
    response['success'] = success
    response['errors'] = errors
    return response

@app.route('/mobile/device/edit', methods=["POST"])
@login_required
def editSensorProperty():
    params = request.args.to_dict()
    form = ChangeDeviceNameAPI(data=params, meta={'csrf':False})    

    # Check the form validated, if so go on to get device
    if form.validate():
        deviceToEdit = None
        # Attempt to retrieve device and edit name
        try:
            deviceToEdit = Devices.query.filter(and_(Devices.Username == current_user.Username, Devices.DeviceId==form.deviceid.data)).first()

            # If it was a valid device, change the name and return success
            if deviceToEdit:
                deviceToEdit.DeviceName = form.devicename.data
                db.session.commit()
                return jsonify(json.dumps(GenerateResponseCodes(True)))
            else:
                db.session.rollback()
                # Notify the user that a device was not found
                error = {'device' : ["No device found for this user with this id."]}   
                return jsonify(json.dumps(GenerateResponseCodes(False, error)))
        except Exception as e:
            error = {'error':['unexpected error, double check inputs.']}
            return jsonify(json.dumps(GenerateResponseCodes(False, error)))
    # The form did not validate
    error = {'invalid' : ['invalid device name or id.']}
    return jsonify(json.dumps(GenerateResponseCodes(False, error)))

@app.route('/mobile/device/delete', methods=["POST"])
@login_required
def deleteSensor():
    # Grab the parameters and construct the form
    params = request.args.to_dict()
    form = ValidateDeviceIdAPI(data=params, meta={'csrf':False})

    if form.validate():
        # Checks to see if a device exists for this user
        deviceToDelete = Devices.query.filter(and_(Devices.Username == current_user.Username, Devices.DeviceId == form.deviceid.data)).first()
        if deviceToDelete:
            # Attempt to delete device: return success if it works or failure with errors 
            try:
                deleteDeviceFromDb(deviceToDelete)
                return jsonify(json.dumps(GenerateResponseCodes(True)))
            except Exception as e:
                # It failed because there was a DB incident
                error = {'exception' : ["Error deleting from Db"]}
                return jsonify(json.dumps(GenerateResponseCodes(False, error)))
        # Notify that no device was found for this user     
        error = {'device' : ["No device found for this user with this id."]}   
        return jsonify(json.dumps(GenerateResponseCodes(False, error)))
    return jsonify(json.dumps(GenerateResponseCodes(False, form.errors)))


# A call to return an array of devices owned by a user. User for mobile app requests
@app.route("/mobile/user/devices", methods=["GET"])
@login_required
def getUserDevices():
    devices = Devices.query.filter_by(Username=current_user.Username).all()
    devices = convertDeviceToJsonFormat(devices)
    return jsonify(json.dumps(devices))

################                  ################
################                  ################
################ API DATA QUERIES ################
################                  ################
################                  ################

# Takes a device ID and returns the row in the SQL data base
@app.route("/devices/deviceChronData", methods=["GET"])
def getSingleDeviceChronData():
    params = request.args.to_dict()
    ret = {}
    try:
        current_device = DeviceInfo.query.filter_by(DeviceId = params["deviceId"]).first()
        ret["success"] = "true"
        ret["value"] = getDeviceInfoFields(current_device)
    except Exception as e:
        ret["success"] = "false"
    return jsonify(json.dumps(ret))

def getDeviceInfoFields(device):
    ret = {}
    ret["deviceId"] = device.DeviceId
    ret["longitude"] = device.Longitude
    ret["latitude"] = device.Latitude
    ret["humidity"] = device.Humidity
    ret["pm1"] = device.PM1
    ret["pm2.5"] = device.PM25
    ret["pm10"] = device.PM10
    ret["co"] = device.CO
    ret["no"] = device.Nitric
    ret["temperature"] = device.Temperature

    return ret

    

@app.route("/data/getrecent", methods=["GET"])
def getRecentDataFrom():
    params = request.args.to_dict()
    retValue = {}   
    retValue["data"] = []

    try:
        query = 'SELECT "PM1", "PM2.5", "PM10" from "airQuality" WHERE' + addTimeBounds(params["time"], ">=") + ' and "ID" = ' + "'" + params["id"] +"' limit 200"  
        df = client.query(query, chunked=True)
        retValue["sucess"] = True
        for obj_row in df:
            for row in obj_row:
                retValue["data"].append(row)
    except Exception as e:
        retValue["sucess"] = False
    return jsonify(json.dumps(retValue))

# Grabs the average PM in a radius given:
# "LowerTime", "UpperTime","UpperLongitude","LowerLongitude", "LowerLatitude", "UpperLatitude", "radius Multiplier"
@app.route("/data/pollution", methods=["GET"])
def GetSurroundingPollution():
    params = request.args.to_dict()

    queryBounds = calculateCordinateRadius(params)

    queryString = f'SELECT MEAN("PM1") as "PM1", MEAN("PM2.5") as "PM2.5", MEAN("PM10") as "PM10" FROM "airQuality" ' \
                  'WHERE "time" > %s and "time" <  %s '\
                  'and "Longitude" <= %.5f and "Longitude" > %.5f '\
                  'and "Latitude" <= %.5f and "Latitude" > %.5f order by time desc limit 10 '\
                  % (queryBounds["LowerTime"], queryBounds["UpperTime"],queryBounds["UpperLongitude"],queryBounds["LowerLongitude"], queryBounds["UpperLatitude"], queryBounds["LowerLatitude"])

    df = client.query(queryString, chunked=True)
    for obj_row in df:
        return jsonify(json.dumps(obj_row[0]))

    # There was not anything returned from query
    empty = {"PM1": None, "PM10" : None, "PM2.5" : None}
    return jsonify(json.dumps(empty))

# Get particulate matter for a specific device
@app.route("/data/pollution/<string:deviceId>", methods=["GET"])
def getDevicePollutionData(deviceId):
    queryString = 'SELECT "PM1", "PM2.5", "PM10" from "airQuality" where "ID" = \'%s\' order by time desc limit 1;' % deviceId
    df = client.query(queryString, chunked=True)
    for obj_row in df:
        return jsonify(json.dumps(obj_row[0]))

    # There was not anything returned from query
    empty = {"PM1": None, "PM10" : None, "PM2.5" : None}
    return jsonify(json.dumps(empty))

# Pulls out particulate types from a response frame
def extractValues(dataFrame):
    values = {}
    try:
        values["PM1"] = dataFrame['airQuality']["PM1"][0]
    except:
        pass
    try:
        values["PM10"] = dataFrame['airQuality']["PM10"][0]
    except:
        pass
    try:
        values["PM2.5"] = dataFrame['airQuality']["PM2.5"][0]
    except:
        values["PM2.5"] = None

    return values
# Given a point it will calculate all the offsets needed for the query
def calculateCordinateRadius(params):

    # This is a generic distance used representing 100 ft in cordinates
    base_lat = .00016
    base_long = .000202

    # 1000 foot base
    base_lat = base_lat * 10
    base_long = base_long * 10


    multiplier = int(params["times"])
    boundary = {}

    lat = float(params['lat'])
    longitude = float(params['long'])

    # Calculate the bounds of the Latitude
    boundary['UpperLatitude'] = lat + (base_lat * multiplier)
    boundary['LowerLatitude'] = lat - (base_lat * multiplier)

    # Calculate the bounds of the longitude
    boundary['LowerLongitude'] = longitude - (base_long * multiplier)
    boundary['UpperLongitude'] = longitude + (base_long * multiplier)

    # Give the offset string for the time
    boundary["UpperTime"] = "'" + params["timestamp"] + "'" + " + 5h"
    boundary["LowerTime"] = "'" + params["timestamp"] + "'" + " - 5h" 

    return boundary


################ MISC ################

# Injects object into the context of the templates
@app.context_processor
def context_processor():
    return dict(user=current_user)
    
# Callback that is used by flask_login to load the current user details
@loginManager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def queryDB():
    todo = "make it so that its not downloading files"

    # Pandas DataFrame
    # df = client.query("select \"ID\",\"CO\",\"NO\",\"PM1\",\"PM10\",\"PM2.5\" from \"airQuality\" where time > now() - 1h AND \"ID\" = '606405AA0C73'", chunked=True)['airQuality']

    # Do some operation to the DataFrame -- Get a DataFrame for a single Sensor ID:
    # df2 = df[df['ID'] == '606405AA0C73']

    # Save the pollution data to a csv for later use from graphs or download
    # df2.to_csv('./static/pollution.csv')
    # Option to return the dataframe
    # return df


# Helpers for editing Account details
def getField(value):
    if value == "firstName":
        return "First Name"
    elif value == "lastName":
        return "Last Name"
    elif value == "username":
        return "Username"
    elif value == "email":
        return "Email"
    elif value == "password":
        return "Password"
# Returns the correct form type
def getForm(value):
    form = None

    if value == "firstName":
        form = FirstName()
    elif value == "lastName":
        form = LastName()
    elif value == "username":
        form = ChangeUsername()
    elif value == "email":
        form = ChangeEmail()
    elif value == "password":
        form = ChangePassword()
    return form

# Updates the object value with the value passed in
def updateValue(form, value):
    user = User.query.filter_by(Username=current_user.Username).first()
    if user:
        if value == "firstName":
            user.FirstName = form.firstname.data
        elif value == "lastName":
            user.LastName = form.lastname.data
        elif value == "username":
            updateDeviceOwnership(form.username.data)
            user.Username = form.username.data
        elif value == "email":
            user.Email = form.email.data
        elif value == "password":
            user.Password = generate_password_hash(form.password.data, method='sha256')
    db.session.commit()

# Updates the ownership of a device
def updateDeviceOwnership(newName):
    devices = Devices.query.filter_by(Username=current_user.Username).all()
    for device in devices:
        device.Username = newName

# Takes a DB query of devices and turns it into JSON format {Dictionary}
def convertDeviceToJsonFormat(devices):
    jsonDevices = []
    for device in devices:
        current = {}
        current["DeviceId"] = device.DeviceId
        current["DeviceName"] = device.DeviceName
        jsonDevices.append(current)
    return jsonDevices