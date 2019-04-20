Web Server:

    Required libraries:
    Flask_Cors==3.0.7
    Flask_Login==0.4.1
    Flask_WTF==0.14.2
    PyMySQL==0.9.3
    WTForms==2.2.1
    influxdb==5.2.0
    Werkzeug==0.12.2
    SQLAlchemy==1.1.9
    Flask==0.12.2
    Flask_SQLAlchemy==2.3.2
    Flask_Bootstrap==3.3.7.1
    protobuf==3.7.0



Navigate to the root directory of the project.
From the command line type: 
    export FLASK_APP=hello.py
    flask run


Mobile:
	React 16.6.1
	react-native v0.57.5
	react-navigation 2.18.2
	react-native-vector-icons 6.1.0

    
    The project is currently targeted at Android. To setup and install react-native, see
    https://facebook.github.io/react-native/docs/getting-started.html and select 'Building project with native code'
    After installing NPM, run the command 'npm install' in root file directory to install all needed dependencies, including react-native.
    Afterwards, connect an Android device and run the command "react-native run-android" to build the application.
    For proper support, you will also need to provide your own API key in the android/MainApplication.java file.
