# Holds all the routes but need to have access to the app.routes decorator
# Grab the application from the myapp file
from myapp import app, db
<<<<<<< HEAD
from flask import Flask, redirect, render_template, url_for, request, flash, abort, jsonify, json
=======
from flask import Flask, redirect, render_template, url_for, request, flash, abort
>>>>>>> 686cb384c7dc58208cde06bf3e3b208dbb4fc255
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required,logout_user, current_user

from influxdb import DataFrameClient, InfluxDBClient
import pandas as pf

# Import the models for forms so they can be validated
from forms import LoginForm, RegisterForm

#import the models from the model file
from models import User

# Manages the whole login session: loggin in a user, remembering, and logging out a user.
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'

# Fake Device ID's to be used for account details and possibly graphs
IDS = []

# InfluxDB Username and Password
USERNAME = 'trentSenior'
PASSWORD = 'LnSwACNZPN5BLP95'

client = DataFrameClient(host='air.eng.utah.edu',
                         port=8086,
                         username=USERNAME,
                         password=PASSWORD,
                         database='airU',
                         ssl=True,
                         verify_ssl=True)


def queryDB():
        # Pandas DataFrame
    df = client.query("select \"ID\",\"CO\",\"NO\",\"PM1\",\"PM10\",\"PM2.5\" from \"airQuality\" where time > now() - 1h AND \"ID\" = '606405AA0C73'", chunked=True)['airQuality']

    # You can print DataFrame keys just like dict keys
    # print('\033[92m \nDataFrame keys (column names): \033[0m')
    # print(df.keys())

    # Do some operation to the DataFrame -- Get a DataFrame for a single Sensor ID:
    df2 = df[df['ID'] == '606405AA0C73']
    # print('\033[92m \nPandas DataFrame where ID is "606405AA0C73": \033[0m')
    # print(df2)
    df2.to_csv('./static/pollution.csv')
    # Option to return the dataframe
    # return df

# Hopefully this injects an object in to context of all templates
@app.context_processor
def context_processor():
    return dict(user=current_user)


# Callback that is used by flask_login to load the current user details
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

#Each of the functions below are used as endpoints for the /<html page>




@app.route('/')
def index():
    x = current_user
    logged_in = False
    if current_user.is_active:
        logged_in = True
        return render_template('index.html', logged_in=logged_in)
    return redirect(url_for('login'))
    

@app.route('/account')
@login_required
def account():
    return render_template('account.html', user=current_user, ids = IDS)

@app.route('/addDevice', methods=["POST"])
@login_required
def addDevice():
    if request.form["add_device"] != "":
        IDS.append(request.form["add_device"])
    return redirect(url_for('account'))

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

@app.route('/login', methods=['GET','POST'])
def login():
    # Create the two forms for login or create
    form = LoginForm(prefix='log')
    reg_form = RegisterForm()

    #If it was a post request check which form was being validated
    if request.method == 'POST':
        # Checks whether the login for was submitted, refreshes the signup and validates the user
        if request.form['form_type'] == 'login':
            reg_form = RegisterForm()

            if form.validate_on_submit():
                user = userExists(form.username.data)
                if user:
                    if check_password_hash(user.password, form.password.data):
                        # Use login manager with the logged in user and redirect
                        login_user(user, remember=form.remember.data)
                        return redirect(url_for('index'))
                flash('Invalid username or password', category='alert alert-danger _login')
            # Else there was an error TODO: Check whether the reg form needs to be revalidated
            return render_template('login.html', form=form, reg=reg_form, active="login")
        elif request.form['form_type'] == 'register':
            form = LoginForm(prefix='log')
            if reg_form.validate_on_submit():
                 # Checks the uniqueness of username and email, create one and direct back to the login screen
                user_exists = userExists(reg_form.username.data)
                email_exists = emailExists(reg_form.email.data)

                # Validate that both the email and username are not taken, hash the password --> put the user in the db
                if not user_exists and not email_exists:
                    hashed_password = generate_password_hash(reg_form.password.data, method='sha256')
                    new_user = User(username=reg_form.username.data, email=reg_form.email.data, password=hashed_password)
                    db.session.add(new_user)
                    db.session.commit()
                    flash('User successfully created!', category='alert alert-success _login')
                    return render_template('login.html', form=form,reg=reg_form, active="login")
            # refresh the login form so it doesn't error out
                flash('Username taken!', category='alert alert-danger _reg')
            return render_template('login.html', form=form,reg=reg_form, active="signup")
    return render_template('login.html', form=form,reg=reg_form, active="login")

@app.route('/signup', methods=['GET','POST'])
def signup():
    
    # Attempts to grab the user by the defaul name, if it doesn't exist proceed else 'error'
    form = RegisterForm(request.form)
    if request.method == 'POST':
        # Validate the form then check if a user already exists
        if form.validate_on_submit():
            if not userExists(form.username.data):
                hashed_password = generate_password_hash(form.password.data, method='sha256')
                new_user = User(username=form.username.data, email=form.email.data, password=hashed_password)
                db.session.add(new_user)
                db.session.commit()
                flash('User successfully created!', category='alert alert-success')
                return redirect(url_for('login'))
    return redirect(url_for('login'))


 
@app.route('/map')
@login_required
def map():
    return render_template('map.html', user = current_user)

@app.route('/logout')
@login_required
def logout():
    # db.session.delete(current_user)
    # db.session.commit()
    IDS = []
    logout_user()
    return redirect(url_for('index'))

@app.route('/download')
def download():
    pass

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# Checks whether the user exists
def userExists(name):
    return User.query.filter_by(username=name).first()

# checks whether the email exists
def emailExists(email):
    return User.query.filter_by(email=email).first()
<<<<<<< HEAD

=======
>>>>>>> 686cb384c7dc58208cde06bf3e3b208dbb4fc255
