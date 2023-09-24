import requests
from decouple import config
import numpy as np
import json

    
# Description: This is the data collection 'class' for the backend routes,
# request information is parsed to this class, which will then request from
# the the terraform api and return the formated the data
# Methods:
# [x] createURL
# [x] fetchElectricData
# [x] fetchWaterData
# [x] dualElectricFetch
# [x] displayItems


#Method: match datatype and return the respective terraforma api route
#Input (Datatype ['EC']) -> Output [formated create url]
def createURL(item2,item3):
    match item2:
       case "EC":
            baseURL = 'https://dashboard.terrafirma-software.com/Clientapi/'
            match item3:
                case "day":
                    baseURL += 'getG1Data?interval=ts_1day&from_id=7&data_id=14472'
                    return baseURL
                case "month":
                    baseURL += 'getG1Data?interval=ts_1month&from_id=7&data_id=14472'
                    return baseURL
                case "hour":
                    baseURL += 'getG1Data?interval=ts_1hour&from_id=4&data_id=14472'
                    return baseURL
       case "EP":
            baseURL = 'https://dashboard.terrafirma-software.com/Clientapi/'
            match item3:
                case "day":
                    baseURL += 'getG33Data?interval=ts_1day&from_id=7&data_id=14746'  
                    return baseURL
                case "month":
                    baseURL += 'getG33Data?interval=ts_1month&from_id=7&data_id=14746'
                    return baseURL
                case "hour":
                    baseURL += 'getG33Data?interval=ts_1hour&from_id=4&data_id=14746'
                    return baseURL
       case "WC":
            match item3:
                case "day":
                    baseURL = 'https://dashboard.terrafirma-software.com/WaterApi/getWaterUsageData?interval=ts_1day&from_id=5&data_id='
                    return baseURL
                case "month":
                    baseURL = 'https://dashboard.terrafirma-software.com/WaterApi/getWaterUsageData?interval=ts_1month&from_id=7&data_id='
                    return baseURL
                case "hour":
                    baseURL = 'https://dashboard.terrafirma-software.com/WaterApi/getWaterUsageData?interval=ts_1hour&from_id=3&data_id='
                    return baseURL

#Method: fetch electric production/consumption based on input data ranges
#Input (types/ranges) -> output (Formated electric data)
def fetchElectricData(x,gatheredData, returnData, dataPoint, units, color, title, realData):
    placeholder = title + x[3]
    if placeholder not in  gatheredData:
        url = createURL(title,x[3])
        if realData == 't':
            response = requests.get(url=url, auth=(config('TERRA_API_USER') ,config('TERRA_API_PASS')))
            finalResponse = response.json()[dataPoint]
        else:
            f = open(f'./data/{title}{x[3]}.json')
            response = json.load(f)
            finalResponse = response[dataPoint]
        gatheredData[placeholder] = finalResponse
        returnData.append(
            {
                'id' : x[0],
                'name': x[8],
                'chart': x[5],
                'type': x[1],
                'notes': x[6],
                'units': units,
                'data': gatheredData[placeholder][-x[4]:],
                'color': color
            }
        )
    else:
        returnData.append(
            {
                'id' : x[0],
                'name': x[8],
                'chart': x[5],
                'type': x[1],
                'notes': x[6],
                'units': units,
                'data': gatheredData[placeholder][-x[4]:],
                'color': color
            }
        )

#Method: fetch water consumption based on input data ranges
#Input (types/ranges) -> output (Formated water data)
def fetchWaterData(x,gatheredData, returnData, units, color, realData):
    if x[2]+x[3] not in  gatheredData:  
        url = createURL(x[2],x[3])
        headers = {'Cookie': 'JSESSIONID=859B363EE9ED61EBED21CB1D7FFAE2E9; SERVERID=c2|ZQBMv|ZQAhS'}
        DataItems = ['14016','14017','14010','14012','14009','14011','14013','14015','14014']
        cleanResponses = []
        for z in DataItems:
            if realData == 't':
                response = requests.get(url=url+z, headers=headers) 
                cleanResponse = response.json()['data_json'][0]['water_kl']
            else:
                f = open(f'./data/{x[2]}{x[3]}{z}.json')
                response = json.load(f)
                cleanResponse = response['data_json'][0]['water_kl']
            cleanResponses.append(cleanResponse)
        FinalResponse = []
        for i in range(len(cleanResponses[0])):
            total = 0
            for arr in cleanResponses:
                    total += arr[i][1]
            FinalResponse.append([total,cleanResponses[0][i][0]])
        gatheredData[x[2]+x[3]] = FinalResponse
        returnData.append({
                'id' : x[0],
                'name': x[8],
                'chart': x[5],
                'type': x[1],
                'notes': x[6],
                'units': units,
                'data': gatheredData[x[2]+x[3]][-x[4]:],
                'color': color
            })
    else:
        returnData.append({
            'id' : x[0],
            'name': x[8],
            'chart': x[5],
            'type': x[1],
            'notes': x[6],
            'units': units,
            'data': gatheredData[x[2]+x[3]][-x[4]:],
            'color': color
        })

#Method for fetching 2 types of electric data and creating a combined single response
#Input (types/ranges) -> output (Formated electric data combined)
def dualElectricFetch(x, gatheredData, returnData, realData):
    arr1 = []
    arr2 = []
    units = 'kw/h'
    color = 'rgb(255, 99, 132, 0.5)'
    fetchElectricData(x, gatheredData, arr1, 1, units, color, 'EC', realData)
    color = 'rgb(72,195,83,0.6)'
    fetchElectricData(x, gatheredData, arr2, 0, units, color, 'EP', realData)

    returnData.append(
         {
                'id' : x[0],
                'name': x[8],
                'chart': x[5],
                'type': x[1],
                'notes': x[6],
                'units': units,
                'data': [arr1[0], arr2[0]],
                'color': color
            }
        ) 

#Method to returned base data for display
def returnBaseData(returnData,x):
    returnData.append({
                'id' : x[0],
                'name': x[8],
                'chart': x[5],
                'type': x[1],
                'notes': x[6],
                'units': 'none',
                'data': x[3],
                'color': 'none'
            }) 
    

#Method for calling correct data fetching methods based display items we want to show
#Input (display items) -> output (all data formated for display) 
def displayItems(arrayDisplayItems, realData):

    gatheredData = {}
    returnData = []

    for x in arrayDisplayItems:
        match x[2]:
            case "EC":
                units = 'kw/h'
                color = 'rgb(255, 99, 132, 0.5)'
                dataPoint = 1
                fetchElectricData(x, gatheredData, returnData, dataPoint, units, color, x[2], realData)

            case "EP":
                units = 'kw/h'
                dataPoint = 0
                color = 'rgb(72,195,83,0.6)'
                fetchElectricData(x, gatheredData, returnData, dataPoint, units, color, x[2], realData)

            case 'WC':
                units = 'k/l'
                color = 'rgb(53, 162, 235, 0.5)'
                fetchWaterData(x,gatheredData,returnData,units,color, realData)
            
            case 'ECVSEP':
                dualElectricFetch(x,gatheredData,returnData, realData)
            
            case 'TEXT':
                returnBaseData(returnData,x)

            case 'VIDEO':
                returnBaseData(returnData,x),

    return returnData



