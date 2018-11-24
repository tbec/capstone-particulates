# Holds all the routes but need to have access to the app.routes decorator
# Grab the application from the myapp file
from myapp import app, db
from flask import Flask, redirect, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required,logout_user, current_user
# IMport the class form created
# from forms import LoginForm

#import the models from the model file
from models import User

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'



@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return "You are not logged in, sign up!"
@app.route('/login')
def login():
    user = User.query.get(1)
    login_user(user)
    return "<h1> You are logged in as: " + current_user.username + current_user.email+"</h1>"

@app.route('/signup', methods=['GET','POST'])
def signup():
    hashed_pwd = generate_password_hash('password', method='sha256')
    user = User(id=1, username='John', email='John@gmail.com', password=hashed_pwd )
    db.session.add(user)
    db.session.commit()
    return redirect('login')

 
@app.route('/check')
@login_required
def check():
    return "<h1> You're still logged in: " + current_user.username + "</h1>"


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return "You have logged out!"
