from flask import Flask,request, jsonify
from dataCollector import *
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
from decouple import config
import bcrypt
import jwt
import json
import sqlite3


# Routes for backend
# COMPLETED
# [x] display
# [x] LoginBase
# To Do
# [] Register/change pass
# [x] Login Tokens and db interaction
# [] Admin Routes
# [] display customization routes


app = Flask(__name__)
auth = HTTPBasicAuth()
CORS(app)

@auth.veify_token
def verify_token(token):
    print(token)
    



#display route - used to return current active components for large screen display
@app.route('/displayAPI')
def index():
    try:
        with sqlite3.connect("database.db") as db:
            cursor = db.cursor()
            res = cursor.execute("SELECT * FROM COMPONENTS WHERE enabled='t'")
            result = displayItems(res.fetchall())

            resSettings = cursor.execute("SELECT * FROM SETTINGS WHERE type='GRID'")
            resultSettings = resSettings.fetchall()

        return {
            'results' : result,
            'settings': resultSettings[0]
            }
    except:
        return 'error'

#login route - used to attempt login when accessing the admin page
@app.route('/loginAPI', methods=["POST"])
def loginMethod():
    if('Authorization' in request.headers):
        try:
            decoded_jwt = jwt.decode(request.headers['Authorization'], config('SECRET_JWT_ENCODE'), algorithms=["HS256"])
            if decoded_jwt['login'] == 'true':
                return {'login':'true'}
            else:
                return  {"error" : "Bad Token"}
        except:
            return {"error" : "Bad Token"}
    else:
        username = request.json.get('user',None)
        password = request.json.get('password',None)
        try:
            with sqlite3.connect("database.db") as db:
                cursor = db.cursor()
                res = cursor.execute(f"SELECT * FROM USERS WHERE username='{username}'")
                result = res.fetchall()[0]

                if bcrypt.hashpw(password.encode(), result[1].encode()) == result[1].encode():
                    encoded_jwt = jwt.encode({"login":'true'}, config('SECRET_JWT_ENCODE'), algorithm="HS256")
                    return {"token" : encoded_jwt}
                else:
                    return  {"error":"Inccorect credentials"}
        except:
            return "error", 400
    

   

  
if __name__ == '__main__':
    app.run(debug=True)