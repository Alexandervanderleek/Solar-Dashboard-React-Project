import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );

//Line graph component taking in props, dataset and unit types

export default function LineGraph({dataSet, unit}) {

  //transpose function, convert 2d array to two individual arrays

  const transpose = (matrix) => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));

  // graph options

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  //transposing the data set 

  const transposedArray = transpose(dataSet)
  let labelsArr = []
  transposedArray[0].forEach((item)=>{
    labelsArr.push((new Date(item).toLocaleDateString().split(" ")).slice(0,3).join(' '))
  })
  
  const labels = labelsArr;

  //final data options for graph

  const data = {
    labels,
    datasets: [
      {
        label: unit,
        data: transposedArray[1],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 0.5)'
      },
    ],
  };

  return (
    <div style={{ display: 'flex',height:'99%', width:'99%', justifyContent: 'center', alignItems: 'center'}}>
        <Line redraw={true} options={options} data={data}></Line>             
    </div>
  )
}
