import React from 'react'
import {WiLightning, WiRaindrop} from 'react-icons/wi'
import BarGraph from '../UIgraphComponents/BarGraph'
import LineGraph from '../UIgraphComponents/LineGraph'

//Display Item to show data and additional information
//Fed in data-props items to be displayed

export default function DisplayItem({title, type, dataSet, unit, chart}) {

  //change apperance based on information fed in e.g [chart type]

  return (
    <div className='flex'>
      <div className="card card-compact flex-1 bg-base-100 shadow-xl">
        <div className="card-body">

          {/* title item & type */}
          <div className='flex justify-center align-middle text-center'>
            <h2 className="card-title text-lg md:text-4xl">{title}</h2>
            {type==="electric" ? (
              <WiLightning size={60} className="text-yellow-300"></WiLightning>
            )
            :(
              <WiRaindrop size={60} className="text-blue-300"></WiRaindrop>
            )}
          </div>

          {/* Additional Notes, to be developed */}

            <div>
              <p>An interesting fact</p>
              <p>An interesting fact</p>
            </div>
            
            {/* Graph Item */}

            {chart==='bar' && (
                <BarGraph dataSet={dataSet} unit={unit} ></BarGraph>
            )}

            {chart==='line' && (
              <LineGraph dataSet={dataSet} unit={unit} ></LineGraph>
            )}
                  
        </div>
      </div>
    </div>
  )
}
