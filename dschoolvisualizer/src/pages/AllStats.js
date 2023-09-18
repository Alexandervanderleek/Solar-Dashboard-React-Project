import React, { useContext, useState } from 'react'
import { FcComboChart, FcDataConfiguration, FcDownload, FcHome } from 'react-icons/fc'
import { ToastContainer, toast } from 'react-toastify'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import globalContext from '../context/global/globalContext'



export default function AllStats() {

  const [interval, setInteval] = useState('day')
  const [data, setData] = useState('EC')
  const {isLoading, setIsLoading} = useContext(globalContext)

  // Function to export data as a file
  const exportData = (data, fileName, type) => {
    // Create a link and download the file
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  function convertToCSV(data) {
    // Initialize an empty CSV string
    let csv = '';
  
    // Loop through the data and format it as CSV
    csv+="DATE,KW/H\n"
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row.length >= 2) {
        // Append the first element of the sub-array to column 1
        csv += new Date(row[0]);
  
        // Append a comma as a separator
        csv += ',';
  
        // Append the second element of the sub-array to column 2
        csv += row[1];
  
        // Append a newline character to move to the next row
        csv += '\n';
      }
    }
  
    return csv;
  }




  const downloadData = () => {
    setIsLoading(true)
    fetch('http://127.0.0.1:5000/getSpecificData',{
        method: 'POST',
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin':'*',
            "Content-Type": "application/json",
            },
        body: JSON.stringify({
            type: data,
            interval: interval
        })
    }).then(response=>response.json()).then((res)=>{
        const csvDATA = convertToCSV(res.data)
        exportData(csvDATA, `${data}${interval}data.csv` ,'text/csv;charset=utf-8;')
        setIsLoading(false)
    }).catch((err)=>{
        console.log(err)
        setIsLoading(false)
        toast('Error downloading data')
    })
  }

  return (
    <div className='min-h-screen'>
        <ToastContainer></ToastContainer>
        {isLoading ? (
          <LoadingSpinner></LoadingSpinner>
        ):(
          <>
          <div className="navbar bg-base-300">
                  <div className="flex-1">
  
                    <a href='/admindashboard' className="btn btn-ghost normal-case text-2xl">
                      <FcDataConfiguration size={30}></FcDataConfiguration>
                      ADMINDASHBOARD
                    </a>
  
                    <div className='border-l-2 border-gray-500'>
                      <a href='/' className="btn btn-ghost normal-case text-2xl">
                        <FcHome size={30}></FcHome>
                        HOME
                      </a>
                    </div>
  
                    <div className='border-l-2 border-gray-500'>
                      <a href='/display' className="btn btn-ghost normal-case text-2xl">
                        <FcComboChart size={30}></FcComboChart>
                        DISPLAY
                      </a>
                    </div>
  
                  </div>
  
                  
                </div>
  
  
          {/* INTERVAL INPUT */}
          <div className='flex justify-center'>
  
            <div>
            <div className='flex flex-col m-3'>
              <div className='text-2xl font-bold mb-2'>
                Interval:
              </div>
              
              <select onChange={(e)=>{ setInteval(e.target.value)}} value={interval} className="select select-lg select-success w-full max-w-xs"> 
                <option value={'day'}>Daily</option>
                <option value={'month'}>Monthly</option>
                <option value={'hour'}>Hourly</option>
              </select>
            </div>
  
            <div className='flex flex-col m-3'>
              <div className='text-2xl font-bold mb-2'>
                DataType:
              </div>
              
              <select onChange={(e)=>{ setData(e.target.value)}} value={data} className="select select-lg select-success w-full max-w-xs"> 
                <option value={'EC'}>Electric consumption</option>
                <option value={'EP'}>Electric production</option>
                <option value={'WC'}>Water consumption</option>
              </select>
            </div>
  
  
            <div className='flex justify-center mt-4'>
              <button className="btn btn-info font-bold" onClick={()=>{
                downloadData()
              }}>
                <FcDownload size={30}></FcDownload>
                Download Data
              </button>
            </div>
            </div>
  
          </div>
         
          </>
        )}
      
    </div>
  )
}
