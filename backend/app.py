from flask import Flask,request, jsonify
from dataCollector import *
from flask_cors import CORS
import json
import sqlite3


# Routes for backend
# COMPLETED
# [x] display
# [x] LoginBase
# To Do
# [] Register/change pass
# [] Login Tokens and db interaction
# [] Admin Routes
# [] display customization routes


app = Flask(__name__)
  
CORS(app)

#display route - used to return current active components for large screen display
@app.route('/displayAPI')
def index():
    try:
        with sqlite3.connect("database.db") as db:
            cursor = db.cursor()
            res = cursor.execute("SELECT * FROM COMPONENTS WHERE enabled='t'")
            result = displayItems(res.fetchall())
        return jsonify(result)
    except:
        return 'error'

#login route - used to attempt login when accessing the admin page
@app.route('/loginAPI', methods=["POST"])
def loginMethod():
    name = request.json.get('user',None)
    password = request.json.get('password',None)
    
    if name == 'test' and password == 'test':
         return {"login":'true'}    
    else:
         return "Error Login", 400

  
if __name__ == '__main__':
    app.run(debug=True)