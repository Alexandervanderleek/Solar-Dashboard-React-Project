from flask import Flask,request
from dataCollector import *
from flask_cors import CORS
from functools import wraps
from decouple import config
import bcrypt
import jwt
import sqlite3


# Description: This is the main 'class' for the backend routes,
# requests are sent to this backend class, which will then match
# the request to the appropriate method. 
# Routes:
# [x] displayAPI
# [x] dbAPI
# [x] updateGrid
# [x] addDefault
# [x] deleteItem
# [x] updateItem
# [x] loginAPI


app = Flask(__name__)
CORS(app)



# Method to protect routes that require an authorization token
# Input (Authorization token) -> Output validated token (based on secret code) result
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


# Display API route, returning all enabled components for display
# Not protected route [no token required]
# Method fetches all display components that are enabled [GET METHOD]
@app.route('/displayAPI')
def displayMain():
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

# Database component route, returning all components stored in the database
# Protected route [token required]
# Method fetches all components that are in the database [enabled or not] [GET METHOD]
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
    except Exception:
        return 'error'

# Update grid route, updating grid settings stored in the database
# Protected route [token required]
# Method takes input [new settings] and updates existing grid settings [POST METHOD]    
@app.route('/updateGrid', methods=["POST"])
@token_required
def updateGrid():
    try:
        col = request.json.get('col',3)
        row = request.json.get('row',2)
        with sqlite3.connect("database.db") as db:
            cursor = db.cursor()
            cursor.execute(f"UPDATE SETTINGS SET col={col},row={row} WHERE type='GRID'")
            
        return { 'success' : True}
    except Exception:
        return 'error'
    

@app.route('/getSpecificData', methods=["POST"])
def getDownloadableData():
    try:
        type = request.json.get('type','')
        interval = request.json.get('interval','')
        match type:
            case 'EC':
                url = createURL(type, interval)
                response = requests.get(url=url, auth=(config('TERRA_API_USER') ,config('TERRA_API_PASS')))
                return { 'data' : response.json()[1]}
            case 'EP':
                url = createURL(type, interval)
                response = requests.get(url=url, auth=(config('TERRA_API_USER') ,config('TERRA_API_PASS')))
                return { 'data' : response.json()[0]}
    except Exception:
        return 'error'


# Add default component, updating component database with a new item
# Protected route [token required]
# Method takes input [new item] and updates existing components database [POST METHOD]    
@app.route('/addDefault', methods=["POST"])
@token_required
def addDefault():
    try:
        item = request.json.get('item',None)
        with sqlite3.connect("database.db") as db:
            cursor = db.cursor()
            match item:
                case "EC":
                    cursor.execute(f"INSERT INTO COMPONENTS (type,data,interval,period,graph,adNotes,enabled,title) VALUES ('electric','EC', 'day','7','line','house','t','Electric Consumption - 7 Days')")
                case "EP":
                    cursor.execute(f"INSERT INTO COMPONENTS (type,data,interval,period,graph,adNotes,enabled,title) VALUES ('electric','EP', 'day','7','line','house','t','Electric Production - 7 Days')")
                case "WC":
                    cursor.execute(f"INSERT INTO COMPONENTS (type,data,interval,period,graph,adNotes,enabled,title) VALUES ('water','WC', 'day','7','line','bottle','t','Water Consumption - 7 Days')")
                case "ECVSEP":
                    cursor.execute(f"INSERT INTO COMPONENTS (type,data,interval,period,graph,adNotes,enabled,title) VALUES ('electric','ECVSEP', 'day','7','linemulti','','t','Consumed vs Produced - 7 Days')")
                case _:
                   return { 'success' : True } 

        return { 'success' : True }
    except Exception:
        return 'error'

# Delete display item, updating component database with newly deleted item
# Protected route [token required]
# Method takes input [delted item id] and updates existing components database [POST METHOD]    
@app.route('/deleteItem', methods=["POST"])
@token_required
def deleteItem():
    try:
        itemID = request.json.get('itemID',None)
        with sqlite3.connect("database.db") as db:
            cursor = db.cursor()
            cursor.execute(f"DELETE FROM COMPONENTS WHERE id={itemID}")

        return {'success' : True}
    except Exception:
        return 'error'

# Update display item, updating component database with newly updated item
# Protected route [token required]
# Method takes input [new item id] and updates existing components database [POST METHOD]        
@app.route('/updateItem', methods=["POST"])
@token_required
def updateItem():
    try:
        item = request.json.get('item',None)
        with sqlite3.connect("database.db") as db:
             cursor = db.cursor()
             cursor.execute(f"UPDATE COMPONENTS SET interval='{item['interval']}',period='{item['period']}',graph='{item['graph']}',adNotes='{item['adNotes']}',enabled='{item['enabled']}',title='{item['title']}' WHERE id='{item['id']}'")
            
        return {'success' : True}
    except Exception:
        return 'error'

# login display route, verify credentials and get a login token
# Protected route [token required]
# Method takes input [credentials] and returns login status and token [POST METHOD] 
# If input includes login token [verify it], else verify credentials and create new token     
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
    
  
#run main
if __name__ == '__main__':
    app.run(debug=True)