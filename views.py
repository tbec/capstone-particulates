# Holds all the routes but need to have access to the app.routes decorator
# Grab the application from the myapp file
from myapp import app, db
from flask import Flask, redirect, render_template, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required,logout_user, current_user
# TODO Create forms
# from forms import LoginForm

#import the models from the model file
from models import User

# Manages the whole login session: loggin in a user, remembering, and logging out a user.
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'


# Callback that is used by flask_login to load the current user details
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

#Each of the functions below are used as endpoints for the /<html page>

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    #Grabs the current user, in this test case the only one
    user = User.query.get(1)
    login_user(user)
    return render_template('login.html', user=current_user)

@app.route('/signup', methods=['GET','POST'])
def signup():
    # Attempts to grab the user by the defaul name, if it doesn't exist proceed else 'error'
    user = User.query.filter_by(username="John").first()
    if not user:
        hashed_pwd = generate_password_hash('password', method='sha256')
        user = User(id=1, username='John', email='John@gmail.com', password=hashed_pwd )
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('index.html', error=True)

 
@app.route('/check')
@login_required
def check():
    return render_template('check.html', user = current_user)
    
@app.route('/logout')
@login_required
def logout():
    db.session.delete(current_user)
    db.session.commit()
    logout_user()
    return render_template('logout.html')
