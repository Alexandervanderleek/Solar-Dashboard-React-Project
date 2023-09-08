import requests
from decouple import config


#function to create the request url based on componet parsed in
def createURL(item):

    baseURL = 'https://dashboard.terrafirma-software.com/Clientapi/'

    match item[2]:
       case "EC":
            match item[3]:
                case "day":
                    baseURL += 'getG1Data?interval=ts_1day&from_id=7&data_id=14472'
                    return baseURL
                case "month":
                    baseURL += 'getG1Data?interval=ts_1month&from_id=7&data_id=14472'
                    return baseURL
                case "hour":
                    baseURL += 'getG1Data?interval=ts_1hour&from_id=4&data_id=14472'
                    return baseURL
     


#function to return all data for the parsed in display item
#based on item, create a url for the request of data
#create a clean object [appended to return array]

def displayItems(arrayDisplayItems):
    
    gatheredData = {}
    returnData = []

    for x in arrayDisplayItems:
        match x[2]:
            case "EC":
                units = 'kw/h'


        if x[2]+x[3] not in  gatheredData:
            url = createURL(x)
            response = requests.get(url=url, auth=(config('TERRA_API_USER') ,config('TERRA_API_PASS')))
            gatheredData[x[2]+x[3]] = response.json()[1]

            returnData.append(
                {
                    'name': x[8],
                    'chart': x[5],
                    'type': x[1],
                    'units': units,
                    'data': gatheredData[x[2]+x[3]][-x[4]:]
                }
            )
        else:
             returnData.append(
                {
                    'name': x[8],
                    'chart': x[5],
                    'type': x[1],
                    'units': units,
                    'data': gatheredData[x[2]+x[3]][-x[4]:]
                }
            )

    return returnData



