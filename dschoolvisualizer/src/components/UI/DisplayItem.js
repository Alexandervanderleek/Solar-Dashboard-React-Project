import React from 'react'
import {WiLightning, WiRaindrop} from 'react-icons/wi'
import { FcGlobe, FcHome, FcNegativeDynamic, FcPositiveDynamic } from "react-icons/fc";
import { FaBottleWater } from "react-icons/fa6";
import BarGraph from '../UIgraphComponents/BarGraph'
import LineGraph from '../UIgraphComponents/LineGraph'
import MultiLineGraph from '../UIgraphComponents/MultiLineGraph';
import { RiEmotionHappyLine, RiEmotionUnhappyLine } from "react-icons/ri";


//Display Item 'class' to show data and additional information
//Takes in a number of props to define how the display item is visualized
//Input variables [title, type, dataSet, unit, chart, color, isSmall, notes]
//Output -> data visualized

export default function DisplayItem({title, type, dataSet, unit, chart, color, isSmall,notes}) {
  
  //Method to calculate average trend percentage from dataset
  const calculateTrendPercentages = (datasetIn) => {
    let trendPercentages = 0;
    
    // Iterate through the dataset starting from the second element
    for (let i = 1; i < datasetIn.length; i++) {
      const currentValue = datasetIn[i][1];
      const previousValue = datasetIn[i - 1][1];
  
      // Calculate the trend percentage and push it to the result array
      const trendPercentage = ((currentValue - previousValue) / previousValue) * 100;
      trendPercentages += trendPercentage;
    }
  
    return trendPercentages/datasetIn.length;
  }

   //Method to calculate average difference between datasets
   const calculateAverageDifference = (datasetIn,datasetIn2) => {
    let differences = 0;
    
    // Iterate through the dataset starting from the second element
    for (let i = 1; i < datasetIn.length; i++) {
      const difference = ((datasetIn2[i]) / (datasetIn[i] )) * 100
      differences += difference;
    }
  
    return differences/datasetIn.length;
  }

  const transpose = (matrix) => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));




  //Method creates note visualization based on input note
  // E.g [house] => number of average homes energy produced
  const defineNote = (note) =>{
    let sum
    let average
    switch(note) {
      case "house":
        sum = dataSet.reduce((acc, arr) => acc += arr[unit==='k/l' ? 0 : 1], 0)
        return (
          <div className='flex text-center items-center justify-center'>
            
            {color==='rgb(72,195,83,0.6)' && (
              <div className='text-xl font-bold'>
                Produced {Math.round(sum/9.4)} x Average
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

      case "trend":
        average = Math.round(calculateTrendPercentages(dataSet))
        return(
          <div className='flex text-center items-center justify-center'>
            {average>0? (
              <>
               <div className='text-xl font-bold'>
                 Trending up {average} %
               </div>
           
                <FcPositiveDynamic size={50} className="text-blue-400"></FcPositiveDynamic> 
                </>
            ):(
              <>
               <div className='text-xl font-bold'>
                 Trending down {average} %
               </div>
           
                <FcNegativeDynamic size={50} className="text-blue-400"></FcNegativeDynamic> 
                </>
            )}
        </div>
        )
      
      case "net":
        const transposedArray = transpose(dataSet[0].data)[1]
        const tansposedArray2 = transpose(dataSet[1].data)[1]
        const result = Math.round(calculateAverageDifference(transposedArray,tansposedArray2))

        return(
          <div className='flex text-center items-center justify-center'>

               <div className='text-xl font-bold'>
                 We are covering {result} % of consmption  
               </div>
           
                <FcGlobe size={50} className="text-blue-400"></FcGlobe>             
        </div>
        )
      
      case "compare":
        const difference = dataSet[0][1] - dataSet[1][1] 
        const percentage = Math.round((Math.abs(difference)/dataSet[0][1]) * 100)
        console.log(dataSet)
        return(
          <div className='flex text-center items-center justify-center'>

               {difference>=0 ? (
                <>
                  <div className='text-xl font-bold'>
                     We are down {percentage} % 
                  </div>
                  <RiEmotionHappyLine size={50} className='text-green-400'> </RiEmotionHappyLine>
                  <div className='text-xl font-bold'>
                    = {Math.round(difference)} kw/h
                  </div>
                </>
               ):(
                <>
                <div className='text-xl font-bold'>
                   We are down {percentage} %   
                </div>
                <RiEmotionUnhappyLine size={50} className="text-red-400"></RiEmotionUnhappyLine> 
                <div className='text-xl font-bold'>
                    = {Math.round(difference)} kw/h  
                  </div>
                </>
               )}
           
                
        </div>
        )



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
                  <BarGraph dataSet={dataSet} unit={unit} color={color} ></BarGraph>
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
