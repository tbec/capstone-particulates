# Holds all the routes but need to have access to the app.routes decorator
# Grab the application from the myapp file
from myapp import app, db
from flask import Flask, redirect, render_template, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required,logout_user, current_user

# Import the models for forms so they can be validated
from forms import LoginForm, RegisterForm

#import the models from the model file
from models import User

# Manages the whole login session: loggin in a user, remembering, and logging out a user.
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'

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
    if current_user:
        logged_in = True
    return render_template('index.html', logged_in=logged_in)

@app.route('/graph')
def graph():
    return render_template('graph.html')
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
                        return redirect(url_for('check'))
                flash('Invalid username or password', category='alert alert-danger _login')
            # Else there was an error TODO: Check whether the reg form needs to be revalidated
            return render_template('login.html', form=form, reg=reg_form, active="login")
        elif request.form['form_type'] == 'register':
            form = LoginForm(prefix='log')
            if reg_form.validate_on_submit():
                 # Checks the uniqueness of username and email, create one and direct back to the login screen
                user_exists = userExists(reg_form.username.data)
                email_exists = emailExists(reg_form.email.data)
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

    #     # If it was the login form: grab the user and validate it
    #     if form.validate_on_submit():
    #         user = userExists(form.username.data)
    #         if user:
    #             if check_password_hash(user.password, form.password.data):
    #                 # Use login manager with the logged in user and redirect
    #                 login_user(user, remember=form.remember.data)
    #                 return redirect(url_for('check'))
    #         flash('Invalid username or password', category='alert alert-danger _login')
    #         # Else there was an error TODO: Check whether the reg form needs to be revalidated
    #         return render_template('login.html', form=form, reg=reg_form, active="login")
    #     # Check whether it was a registration form    
    #     elif reg_form.validate_on_submit():
    #         # form = LoginForm(prefix='log')
    #         # Checks the uniqueness of username and email, create one and direct back to the login screen
    #         user_exists = userExists(reg_form.username.data)
    #         email_exists = emailExists(reg_form.email.data)
    #         if not user_exists and not email_exists:
    #             hashed_password = generate_password_hash(reg_form.password.data, method='sha256')
    #             new_user = User(username=reg_form.username.data, email=reg_form.email.data, password=hashed_password)
    #             db.session.add(new_user)
    #             db.session.commit()
    #             flash('User successfully created!', category='alert alert-success _login')
    #             return render_template('login.html', form=form,reg=reg_form, active="login")
    #         # refresh the login form so it doesn't error out
    #         flash('Username taken.', category='alert alert-danger _reg')
    #         return render_template('login.html', form=form,reg=reg_form, active="signup")
    # return render_template('login.html', form=form,reg=reg_form, active="login")

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
    # user = User.query.filter_by(username="John").first()
    # if not user:
    #     hashed_pwd = generate_password_hash('password', method='sha256')
    #     user = User(id=1, username='John', email='John@gmail.com', password=hashed_pwd )
    #     db.session.add(user)
    #     db.session.commit()
    #     return redirect(url_for('login'))
    # return render_template('index.html', error=True)

 
@app.route('/check')
@login_required
def check():
    return render_template('check.html', user = current_user)

@app.route('/logout')
@login_required
def logout():
    # db.session.delete(current_user)
    # db.session.commit()
    logout_user()
    return render_template('logout.html')


# Checks whether the user exists
def userExists(name):
    return User.query.filter_by(username=name).first()

# checks whether the email exists
def emailExists(email):
    return User.query.filter_by(email=email).first()