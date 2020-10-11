from flask import Flask, render_template, Response, request
from werkzeug.utils import secure_filename
import os, time

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def Index():
    if request.method == 'GET':
        return render_template('index.html')

@app.route('/jacobian', methods=['GET', 'POST'])
def Jacobian():
    if request.method == 'GET':
        return render_template('jacobian.html')

@app.route('/3d', methods=['GET', 'POST'])
def Render3d():
    if request.method == 'GET':
        return render_template('render3d.html')

@app.route('/physics', methods=['GET', 'POST'])
def Physics():
    if request.method == 'GET':
        return render_template('physics2d.html')

@app.route('/neuralnetwork', methods=['GET', 'POST'])
def AutoDiff():
    if request.method == 'GET':
        return render_template('neuralnetwork.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port="5000")
    