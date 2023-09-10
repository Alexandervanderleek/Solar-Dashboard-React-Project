import React from 'react'
import DisplayItem from './DisplayItem'

//The display page, component to hold display items
//To Do [Expand the capability to customize the grid types and formation]

export default function DisplayPage({data, gridSettings}) {
  
  //Data fed in as array and broken into sperate display Items

  return (  
      <div className={`min-h-screen grid xl:grid-cols-${gridSettings[1]} xl:grid-rows-${gridSettings[2]} gap-2 p-2 bg-black` }>
          {
            data.map((item)=>(
              <DisplayItem title={item.name} type={item.type} dataSet={item.data} unit={item.units} chart={item.chart}></DisplayItem>
            )) 
          }  
      </div>
    )
}
