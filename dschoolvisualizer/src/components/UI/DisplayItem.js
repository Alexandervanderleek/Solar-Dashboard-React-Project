import React from 'react'
import {WiLightning, WiRaindrop} from 'react-icons/wi'
import { FcHome } from "react-icons/fc";
import { FaBottleWater } from "react-icons/fa6";
import BarGraph from '../UIgraphComponents/BarGraph'
import LineGraph from '../UIgraphComponents/LineGraph'
import MultiLineGraph from '../UIgraphComponents/MultiLineGraph';

//Display Item 'class' to show data and additional information
//Takes in a number of props to define how the display item is visualized
//Input variables [title, type, dataSet, unit, chart, color, isSmall, notes]
//Output -> data visualized

export default function DisplayItem({title, type, dataSet, unit, chart, color, isSmall,notes}) {

  //Method creates note visualization based on input note
  // E.g [house] => number of average homes energy produced
  const defineNote = (note) =>{
    let sum
    switch(note) {
      case "house":
        sum = dataSet.reduce((acc, arr) => acc += arr[unit==='k/l' ? 0 : 1], 0)
        return (
          <div className='flex text-center items-center justify-center'>
            
            {color==='rgb(72,195,83,0.6)' && (
              <div className='text-xl font-bold'>
                produced {Math.round(sum/9.4)} x Average
              </div>
            )}

            {color==='rgb(255, 99, 132, 0.5)' && (
              <div className='text-xl font-bold'>
                Consumed {Math.round(sum/9.4)} x Average  
              </div>
            )}

            <FcHome size={50} className=""></FcHome>
            
            <div className='text-xl font-bold'>
                = {Math.round(sum)} kw/h  
            </div>
          </div>)
      
      case "bottle":
        sum = dataSet.reduce((acc, arr) => acc += arr[unit==='k/l' ? 0 : 1], 0);
        return (
          <div className='flex text-center items-center justify-center'>
         
            <div className='text-xl font-bold'>
              Consumed {Math.round(sum/0.00033)} x 
            </div>
          
           <FaBottleWater size={50} className="text-blue-400"></FaBottleWater> 
          
            <div className='text-xl font-bold'>
              = {Math.round(sum)} k/l  
            </div>

          </div>)

      default:
        return(<div></div>)
    }
  }
  
  //Returned visualization
  return (
      <div className={ isSmall ? "h-96 card card-compact  bg-base-100 shadow-xl" : "card card-compact  bg-base-100 shadow-xl"}>

          {/* title item & type */}
          <div className='flex justify-center align-middle text-center'>
            <h2 className="card-title text-lg md:text-4xl">{title}</h2>
             {type==="electric" ? (
              <WiLightning size={60} className="text-yellow-300"></WiLightning>
              ):(
              <WiRaindrop size={60} className="text-blue-300"></WiRaindrop> )}
          </div>

          {/* Additional Notes, to be developed */}
            {defineNote(notes)}  

          {/* Graph Item */}
          <div className='h-full w-full p-2'>
              {chart==='bar' && (
                  <BarGraph dataSet={dataSet} unit={unit} color={color}></BarGraph>
              )}
              {chart==='line' && (
                <LineGraph dataSet={dataSet} unit={unit} color={color}></LineGraph>
              )}
              {chart ==='linemulti' && (
                <MultiLineGraph dataSet={dataSet} unit={unit}></MultiLineGraph>
              )}
          </div>       
      </div>)
}
