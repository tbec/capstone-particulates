from flask_wtf import FlaskForm
from wtforms import TextField, PasswordField, PasswordField, BooleanField, StringField
from wtforms.validators import InputRequired, Email, Length

# Create's different forms for LOGIN and SINGUP. This will validate the requirements for each input field
class LoginForm(FlaskForm):
    username = TextField('Username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=80)])
    remember = BooleanField('remember me')

# Check whether the max length should be 80 here or just in the hash?
class RegisterForm(FlaskForm):
    email = StringField('Email', validators=[InputRequired(), Email(message='Invalid Email'), Length(max=50)])
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=15)])