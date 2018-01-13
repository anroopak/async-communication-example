"""
Index file of web service
"""
import os
import pusher

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

app = Flask(__name__)
db = {}

pusher_client = pusher.Pusher(
    app_id='457388',
    key='8a86350fabc94179ab01',
    secret='d700469e36abeabce077',
    cluster='ap2',
    ssl=True
)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/capital/<string:request_id>/", methods=['GET', 'POST'])
def capital(request_id):
    if request.method == 'GET':
        return get_captial(request_id)
    else:
        return post_capital(request_id)


def get_captial(request_id):
    capital = db.get(request_id, None)
    return jsonify(
        request_id=request_id,
        available=(capital is not None),
        capital=capital), 200


def post_capital(request_id):
    capital = request.get_json()['capital']
    request_id = request.get_json()['request_id']
    db[request_id] = capital
    push_response(request_id)
    return "", 204


def push_response(request_id):
    if request_id in db:
        pusher_client.trigger(
            'cp-gain', 'cp-gain-response',
            {'request_id': request_id, 'capital': db.get(request_id)})


if __name__ == '__main__':
    config_env = os.getenv("CP_GAIN_WEB_ENV")
    app.config.from_json("./config/config." + config_env + ".json")
    app.run(threaded=True)
