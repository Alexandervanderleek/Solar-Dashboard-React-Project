import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { MdFullscreen } from 'react-icons/md';
import DisplayPage from '../components/UI/DisplayPage';
import DisplayItem from '../components/UI/DisplayItem';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useContext } from 'react';
import globalContext from '../context/global/globalContext';


//Display Page Component
//To be use for the display of data around D-school

export default function Display() {

    //State & global context variables used
    const handle = useFullScreenHandle();
    const [scale, setScale] = useState(1);
    const [error, setError] = useState();
    const {isLoading, setIsLoading} = useContext(globalContext)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [dataItems, setDataItems] = useState();
    const [gridSettings, setSettings] = useState();

    //Method to set window dimensions
    const setWindowDimensions = () => {
        setWindowWidth(window.innerWidth)
    }


   //Function to request the display data from the backend
   const requestData = (newData) =>{
        if(!dataItems || newData ){
             setIsLoading(true)
             fetch('http://127.0.0.1:5000/displayAPI',{
                 mode: 'cors',
                 headers: {
                     'Access-Control-Allow-Origin':'*'
                }
            }).then(response=>response.json()).then((res)=>{
                setDataItems(res.results)
                setSettings(res.settings)
           
                setIsLoading(false)
            }).catch((e)=>{
                setIsLoading(false)
                console.log(e)
                setError("error fetching")
            })
        }
    }


    //hook for repetitive request of display data for updating purposes
    useEffect(()=>{
        console.log("use Effect")
        requestData(false)
        const reFetch = setInterval(()=>{
            requestData(true)
        }, 1000 * 60 * 60)
        return () => clearInterval(reFetch)
    },[])


    
    
    //hook called on screen change
    useEffect(() => {
        window.addEventListener('resize', setWindowDimensions);
            return () => {
        window.removeEventListener('resize', setWindowDimensions)
        }
    }, [])

    //function to split array, into subsequent smaller arrays
    //used to map data to multiple smaller pages
    function splitArray(arr, chunkSize) {
        let result = [];
      
        for (let i = 0; i < arr.length; i += chunkSize) {
          let chunk = arr.slice(i, i + chunkSize);
          result.push(chunk);
        }

        return result;
      }

    // if in a loading state, return the loading spinner
    if(isLoading){
        return (
            <LoadingSpinner/>
        )
    }

    // if in error state, load a error page [need to be completed]
    if(error){
        return(
            <div>
                error
            </div>
        )
    }


    //if a request for display items was sucessful 
    //load the display 
    if(dataItems){
        return (
            <>
                {/* Overaly component with fullscreen button, only shown for certain screens */}
                { (!handle.active && windowWidth >= 1200  ) && 
                    <div style={styles.overlayStyle}>
                        <button
                            onMouseLeave={()=>{
                                setScale(1)
                            }}

                            onClick = {handle.enter}

                            onMouseEnter={()=>{
                                setScale(1.2)
                            }}>
                                <MdFullscreen  size={80*scale} color={'#A6ADBA'}></MdFullscreen>
                        </button>
                    </div>
                }

                {/* fullscreen component, all items within can be fullscreened */}
                {/* if screen larger than 1200px grid display applies, if smaller single col applies */}
                <FullScreen handle={handle}>
                    {windowWidth>=1200 ? (
                            <Carousel className='flex' autoPlay={true} infiniteLoop={true} interval={4000} showThumbs={false} showStatus={false} showIndicators={false}>
                                {
                                    (splitArray(dataItems, (+gridSettings[1]*+gridSettings[2]))).map((item)=>(
                                        <DisplayPage data={item} gridSettings={gridSettings} ></DisplayPage>
                                    ))
                                }
                            </Carousel> 
                        ):(
                            <div className="min-h-screen grid text-center gap-2 p-2 bg-black">
                                {
                                    dataItems.map((item)=>(
                                         <DisplayItem title={item.name} type={item.type} dataSet={item.data} unit={item.units} chart={item.chart}></DisplayItem>
                                    ))
                                }
                            </div>
                        )}
                </FullScreen>
            </>
        )
    }
}


//A special overlay style for the full-screen button
const styles = {
    overlayStyle:   {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'end',
        width: '100%',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0)',
        cursor: 'pointer',
    }
}