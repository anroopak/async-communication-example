"""
Index file of web service
"""
import base64
import os
import uuid
import xmltodict

import requests
import json

from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
db = {}


@app.route("/gain-capital/", methods=["POST"])
def gain_capital():
    try:
        req_json = request.get_json()
        print req_json
        req_str = req_json['request']
        callback_url = req_json['callback_url']
        inputs = xmltodict.parse(base64.b64decode(req_str))['inputs']

        process_inputs(inputs)
        req_id = insert_into_db(inputs, callback_url)
        response = {"request_id": req_id}

        resp = requests.post(
            callback_url,
            json={"capital": inputs, "request_id": str(req_id)})
        if (200 <= resp.status_code < 300):
            return jsonify(response), 200
        else:
            raise Exception("Request to callback URL failed")

    except Exception as ex:
        import traceback; print(traceback.format_exc(ex))
        return jsonify(message=ex.message), 500


def process_inputs(inputs):
    for key, value in inputs.iteritems():
        inputs[key] = value.upper()


def insert_into_db(inputs, callback_url):
    req_id = uuid.uuid4()
    db[req_id] = {
        "inputs": inputs,
        "callback_url": callback_url
    }
    return req_id


if __name__ == '__main__':
    config_env = os.getenv("CP_GAIN_API_ENV")
    app.config.from_json("./config/config." + config_env + ".json")
    app.run(threaded=True)
