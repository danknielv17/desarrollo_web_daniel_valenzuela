from flask import Flask, render_template, request, redirect, url_for, session

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)

#-- Auth Routes --
# @app.route('/')