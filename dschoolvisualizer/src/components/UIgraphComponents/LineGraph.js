import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler );

//Line Graph display class
//Input variables [dataSet, unit, color]
//Output line graph 

export default function LineGraph({dataSet, unit, color}) {

  //transpose function, convert 2d array to two individual arrays

  const transpose = (matrix) => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));

  // graph options

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(166,173,186)',
          font: {
            weight: 'bold',
            size: 16
          }
          
        }
      },
    },
    scales: {
      
      y: {
        ticks: { color: 'rgb(166,173,186,0.8)', },
        border: {color: 'rgb(166,173,186,0.8)', width: 2}
      },
      x: {
        ticks: { color: 'rgb(166,173,186,0.8)', },
        border: {color: 'rgb(166,173,186,0.8)', width: 2}
      }
    }
  };

  //transposing the data set 

  const transposedArray = transpose(dataSet)
  let labelsArr = []
  transposedArray[ unit==='k/l' ? 1 : 0 ].forEach((item)=>{
    labelsArr.push((new Date(item).toLocaleDateString().split(" ")).slice(0,3).join(' '))
  })
  
  const labels = labelsArr;

  //final data options for graph

  const data = {
    labels,
    datasets: [
      {
        label: unit,
        data: transposedArray[unit==='k/l' ? 0 : 1],
        backgroundColor: color,
        borderColor: color,
        fill: true,
      },
    ],
  };

  return (
    <div style={{ display: 'flex',height:'99%', width:'99%', justifyContent: 'center', alignItems: 'center'}}>
        <Line redraw={true} options={options} data={data}></Line>             
    </div>
  )
}
