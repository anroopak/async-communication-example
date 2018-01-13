# Capital Ganiner

A simple project to show how communication can be done across
2 different services using callback URLs.


## Description

There are 2 services - One which is the web service and the next which is the API service.

- The Web service is accessed for the simple webpage.
- The form is submitted to the API service.
- API service on completion of processing, calls back the registered URL with the output. This is generally the URL of the web service.
- The web service now communicates this output with the web app.

## TODO

- API service's communication to the callback URL is now a blocking call. Need to unblock
- Web service to web app communication of the result is now a polling mechanism. Need to change it to a push response.


## Installing

```
$ pip install -r requirements.txt
```

## Running the Services

- WIP
