import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

//Bar Graph display component, takes in props with unit types and data to display

export default function BarGraph({dataSet, unit }) {

  //transpose function, take 2d array dataset[data,time] and split it into seperate arrays 

  const transpose = (matrix) => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));

  //graph options

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // transpose the data set and use if for label puprposes and data purposes

  const transposedArray = transpose(dataSet)
  
  let labelsArr = []
  
  transposedArray[0].forEach((item)=>{
    labelsArr.push((new Date(item).toLocaleDateString().split(" ")).slice(0,3).join(' '))
  })

  
  const labels = labelsArr;

  //final data object to be used
  
  const data = {
    labels,
    datasets: [
      {
        label: unit,
        data: transposedArray[1],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div style={{ display: 'flex',height:'99%', width:'99%', justifyContent: 'center', alignItems: 'center'}}>
        <Bar redraw={true} options={options} data={data}></Bar>             
    </div>
  )
}
