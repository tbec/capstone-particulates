# Grab app and database from the start file
from myapp import app, db, client

#import db model for a User to login
from models import User, Devices, DeviceLoc
# Import forms used in the app
from forms import *

# imports query options for sqlalchemy
from sqlalchemy import and_, or_

# Imports for flask, login management, and security
from flask import Flask, redirect, render_template, url_for, request, flash, abort, jsonify, json, send_file
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required,logout_user, current_user



# Instantiate login manager
loginManager = LoginManager()
loginManager.init_app(app)
loginManager.login_view = "index"

IDS = ['30AEA4E9BA4']

################ DATABASE ################s

################  ROUTES TO VIEWS  ################


@app.route('/')
def index():
    if current_user.is_active:
        return render_template('index.html',logged_in= True)
    return redirect(url_for('login'))
    
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



# TODO give the ability for users to look at their devices and update them
@app.route('/account')
@login_required
def account():
    return render_template('account.html', user=current_user)

# TODO Clean up code and 
@app.route('/graph',methods=["GET","POST"])
@login_required
def graph():
    bar = False
    circle = False
    if request.method == "POST":
        print(request.form['selected'])
        if(request.form['selected'] == 'circle'):
            circle = True
            bar = False
        else:
            circle = False
            bar = True
        queryDB()
        
    return render_template('graph.html', cGraph = circle, bGraph = bar)

# TODO pull in g maps api and add sensor locations
@app.route('/map')
# @login_required
def map():

    nodes = DeviceLoc.query.all()
    # Grabs all the unique ID tags
    # IDS = client.query('SHOW TAG VALUES FROM longitude with key = "ID"')

    # Dig down to get the return value
    # IDS = IDS.raw['series'][0]['values']

    return render_template('map.html', user = current_user, nodes=convertListToDictionary(nodes))


def convertListToDictionary(nodeList):
    nodes = []
    for node in nodeList:
        n = {}
        n["id"] = node.DeviceId
        n["lat"] = node.Latitude
        n["long"] = node.Longitude
        nodes.append(n)
    return nodes

# Given a list of device ID's get all the average long and latitude
def queryForLongLat(IDS):
    nodes = []
    for id in IDS:
        current_node = {}
        lat = client.query('select "Latitude" from "latitude" where "ID" = \'%s\'' % id[1])
        longitude = client.query('select "Longitude" from "longitude" where "ID" = \'%s\'' % id[1])
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

# TODO change the IDS = to not be a local variable in this scope
@app.route('/logout')
@login_required
def logout():
    # Reset the MAC ID for devices, log the user out
    IDS = ['30AEA4E9BA4']
    logout_user()
    return redirect(url_for('index'))

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

################ View Helper Methods ################

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
            # hashed_password = generate_password_hash(form.password.data, method='sha256')
            # new_user = User(Username=form.username.data, Email=form.email.data, Password=hashed_password, FirstName=form.firstname.data, LastName=form.lastname.data)
            try:
                addNewUserToDb(form)
                # db.session.add(new_user)
                # db.session.commit()
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
    
#*
# 
# 
# ########### MOBILE APP API CALLS ###########
# 
#                                           *#

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
        return ononify(json.dumps({'DidItwork?':"True"}))
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



################ API DATA Queries ################

@app.route("/data/pollution", methods=["GET"])
def GetSurroundingPollution():
    params = request.args.to_dict()

    queryBounds = calculateCordinateRadius(params)

    queryString = f'SELECT MEAN("PM1") as "PM1", MEAN(PM"2.5") as "PM2.5", MEAN("PM10") as "PM10" FROM "airQuality" ' \
                  'WHERE "time" > %s and "time" <  %s '\
                  'and "Longitude" <= %.5f and "Longitude" > %.5f '\
                  'and "Latitude" <= %.5f and "Latitude" > %.5f limit 10 '\
                  % (queryBounds["LowerTime"], queryBounds["UpperTime"],queryBounds["UpperLongitude"],queryBounds["LowerLongitude"], queryBounds["UpperLatitude"], queryBounds["LowerLatitude"])

    df = client.query(queryString, chunked=True)
    for obj_row in df:
        return jsonify(json.dumps(obj_row[0]))

    # There was not anything returned from query
    empty = {"PM1": None, "PM10" : None, "PM2.5" : None}
    return jsonify(json.dumps(empty))
    #     print(obj_row.keys())
    #     print(obj_row.values())
    #     print()
    # return jsonify(json.dumps(extractValues(df)))

# Get particulate matter for a specific device
@app.route("/data/pollution/<string:deviceId>", methods=["GET"])
def getDevicePollutionData(deviceId):
    queryString = 'SELECT "PM1", "PM2.5", "PM10" from "airQuality" where "ID" = \'%s\' limit 1;' % deviceId
    df = client.query(queryString, chunked=True)
    for obj_row in df:
        return jsonify(json.dumps(obj_row[0]))

    # There was not anything returned from query
    empty = {"PM1": None, "PM10" : None, "PM2.5" : None}
    return jsonify(json.dumps(empty))

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
