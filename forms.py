from flask_wtf import FlaskForm
from wtforms import TextField, PasswordField, PasswordField, BooleanField, StringField
from wtforms.validators import InputRequired, Email, Length, EqualTo, DataRequired

# Create's different forms for LOGIN and SINGUP. This will validate the requirements for each input field
class LoginForm(FlaskForm):
    username = TextField('Username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=80)])
    remember = BooleanField('remember me')

# Check whether the max length should be 80 here or just in the hash?
class RegisterForm(FlaskForm):
    email = StringField('Email', validators=[InputRequired(), Email(message='Invalid Email'), Length(max=50)])
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=20)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=15)])
    firstname = StringField("First Name", validators=[InputRequired(), Length(min=2, max=20)])
    lastname = StringField("Last Name", validators=[InputRequired(), Length(min=2, max=20)])

# Will use the devices table
class AddDevice(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=20)])
    deviceid = StringField('Device ID', validators=[InputRequired(), Length(min=12, max=12)])
    devicename = StringField("Device Name", validators=[InputRequired(), Length(min=1, max=15)])

# Validates the new password
class ChangePassword(FlaskForm):
    password = PasswordField('New Password', [InputRequired(), Length(min=8, max=15), EqualTo('confirm', message="Passwords must Match")])
    confirm = PasswordField('Repeat Password')

# Updates the field of the class name
class ChangeUsername(FlaskForm):
    username = TextField('Username', validators=[InputRequired(), Length(min=4, max=15)])

class ChangeEmail(FlaskForm):
    email = StringField('Email', validators=[InputRequired(), Email(message='Invalid Email'), Length(max=50)])

class FirstName(FlaskForm):
    firstname = StringField("First Name", validators=[InputRequired(), Length(min=2, max=20)])

class LastName(FlaskForm):
    lastname = StringField("Last Name", validators=[InputRequired(), Length(min=2, max=20)])

class ChangeDeviceName(FlaskForm):
    devicename = StringField("Device Name", validators=[InputRequired(), Length(min=1, max=15)])


# Forms to be validated from API Calls

class AddDeviceAPI(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=20)])
    deviceid = StringField('Device ID', validators=[DataRequired(), Length(min=12, max=12)])
    devicename = StringField("Device Name", validators=[DataRequired(), Length(min=1, max=15)])
    visible = BooleanField("Visable")

class LoginFormAPI(FlaskForm):
    username = TextField('Username', validators=[DataRequired(), Length(min=4, max=15)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8, max=80)])
    remember = BooleanField('remember me')

# Check whether the max length should be 80 here or just in the hash?
class RegisterFormAPI(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(message='Invalid Email'), Length(max=50)])
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=20)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8, max=15)])
    firstname = StringField("First Name", validators=[DataRequired(), Length(min=2, max=20)])
    lastname = StringField("Last Name", validators=[DataRequired(), Length(min=2, max=20)])

class ValidateDeviceIdAPI(FlaskForm):
    deviceid = StringField('Device ID', validators=[DataRequired(), Length(min=12, max=12)])

class ChangeDeviceNameAPI(FlaskForm):
    devicename = StringField("Device Name", validators=[DataRequired(), Length(min=1, max=15)])
    deviceid = StringField('Device ID', validators=[DataRequired(), Length(min=12, max=12)])
    visibilty = BooleanField("Visable")
