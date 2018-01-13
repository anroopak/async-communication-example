"""
Index file of web service
"""
import os
import requests

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

app = Flask(__name__)
db = {}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/gain-capital/", methods=["POST"])
def gain_capital():
    req_json = request.get_json()
    resp = requests.post(
        "http://127.0.0.1:8002/gain-capital/", json=req_json)
    return jsonify(resp.json()), resp.status_code


@app.route("/capital/<string:request_id>/", methods=['GET'])
def get_capital(request_id):
    capital = db.get(request_id, None)
    return jsonify(
        request_id=request_id,
        available=(capital is not None),
        capital=capital), 200


@app.route("/post_capital/", methods=['POST'])
def post_capital():
    capital = request.get_json()['capital']
    request_id = request.get_json()['request_id']
    db[request_id] = capital
    return "", 204


if __name__ == '__main__':
    config_env = os.getenv("CP_GAIN_WEB_ENV")
    app.config.from_json("./config/config." + config_env + ".json")
    app.run(threaded=True)
