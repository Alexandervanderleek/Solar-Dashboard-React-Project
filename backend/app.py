from flask import Flask,request
from dataCollector import *
from flask_cors import CORS
from functools import wraps
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
CORS(app)



#Function to protect routes that require a token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if('Authorization' in request.headers):
            try:
                decoded_jwt = jwt.decode(request.headers['Authorization'], config('SECRET_JWT_ENCODE'), algorithms=["HS256"])
                if decoded_jwt['login'] == 'true':
                    return f(*args, **kwargs)
                else:
                    return  {"error" : "Auth Token error"}
            except:
                return {"error" : "Auth Token error"}
        else:
            return {"error": "No Auth Token detected"}
    return decorated


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
    except Exception as exc:
        print(exc)
        return 'error'


@app.route('/dbAPI')
@token_required
def dbItems():
    try:
        with sqlite3.connect("database.db") as db:
            cursor = db.cursor()
            res = cursor.execute("SELECT * FROM COMPONENTS")
            result = res.fetchall()

            resSettings = cursor.execute("SELECT * FROM SETTINGS WHERE type='GRID'")
            resultSettings = resSettings.fetchall()
        return {
            'results' : result,
            'settings': resultSettings[0]
            }
    except Exception as exc:
        print(exc)
        return 'error'
    
@app.route('/updateGrid', methods=["POST"])
@token_required
def updateGrid():
    try:
        col = request.json.get('col',3)
        row = request.json.get('row',2)
        with sqlite3.connect("database.db") as db:
            cursor = db.cursor()
            cursor.execute(f"UPDATE SETTINGS SET col={col},row={row} WHERE type='GRID'")
            
        return {
            'success' : True,
            }
    except Exception as exc:
        print("wrong")
        print(exc)
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