import React from 'react'
import { useLocation } from 'react-router-dom'

//TO BE COMPLETED [ADVANCED FEATURE]

export default function SpecificItem({route, navigation}) {

    const location = useLocation()



    if(location.state){
        return (
            <div>
              {location.state}
            </div>
          ) 
    }

    return (
        <div>
        Could not locate Item
        </div>
    )
}
