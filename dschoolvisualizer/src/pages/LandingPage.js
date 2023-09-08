import React from 'react'
import { useNavigate } from 'react-router-dom'

//Basic Landing Page, the initial route for the webApp

export default function LandingPage() {

  //navigation hook
  const navigate = useNavigate();  

  //function for navigation to other routes
  const handleClick = (e) => {
    navigate(`/${e.currentTarget.title}`)
  }  
  

  //Basic landing page 
  //with buttons for navigation to other routes
  //d-school used as background image

  return (
    <div className="hero min-h-screen" style={{backgroundImage: 'url(/images/d-school-image.png)'}}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-xl">
            <h1 className="mb-2 lg:mb-5 text-4xl  md:text-5xl xl:text-8xl  font-bold">Welcome</h1>
            <h1 className="mb-2 lg:mb-5 text-2xl  md:text-3xl xl:text-5xl font-bold">To The D-school Afrika</h1>
            <h1 className="mb-2 lg:mb-5 text-2xl  md:text-3xl xl:text-5xl font-bold">Green Data Visualizer</h1>
            <p className="mb-2 lg:mb-5  text-xs md:text-lg">Pionnering the green building revolution within not only UCT but the entire African continent, soon to be the first every green 6-star rated building in the country !</p>
            <div className='flex flex-wrap justify-center'>
                <button className="m-2 btn btn-outline btn-success" title={"display"} onClick={handleClick}>Our Display</button>
            
                <button className="m-2 btn btn-outline btn-secondary" title={"alldata"} onClick={handleClick}>All Data</button>
            
                <button className="m-2 btn btn-outline btn-info" title={"admindashboard"} onClick={handleClick}>Admin Dashboard</button>
            </div> 
        </div>
      </div>
    </div> )
}



