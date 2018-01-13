# Capital Gainer

A simple project to show how communication can be done across
2 different services using callback URLs.

## Sample

Web Service - http://cp-gain-web.herokuapp.com/

API Service - http://cp-gain-api.herokuapp.com/capital/


## Description

There are 2 services - One which is the web service and the next which is the API service.

- The Web service is accessed for the simple webpage.
- The form is submitted to the API service.
- API service on completion of processing, calls back the registered URL with the output. This is generally the URL of the web service.
- The web service now communicates this output with the web app.

## TODO

- API service's communication to the callback URL is now a blocking call. Need to unblock
- If more than one app is online, response event will shown in all the apps. :P

## Setup

### Step 1: Installing
```
$ pip install -r requirements.txt
```

### Step 2: Update `web/static/app.js`
Update the variables - `webUrl` and `apiUrl` with proper values


## Running the Services in Dev Mode

Steps are same for both API service and Web service.

1. Go to specific folders - `web` for Web service and `api` for API service.
2. Run `./start_dev_server.sh` - this runs the flask app in the foregroud.
