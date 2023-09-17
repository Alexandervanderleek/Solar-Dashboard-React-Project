import React from 'react'
import {Routes, Route} from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import Display from '../../pages/Display';
import AdminDashBoard from '../../pages/AdminDashBoard';
import SpecificItem from '../../pages/SpecificItem';

//Routing Component
//All available routes for the d-school visualization webapp
//Each route will load the respective component defined below

export default function TheRoutes() {
  return (
    <Routes>
      {/* Main Route */}
      <Route path="/" element={<LandingPage></LandingPage>}/>
            
      {/* Main Display Route */}
      <Route path="/display" element={<Display></Display>}/>

      {/* Dashboard route, to be protected */}
      <Route path="/admindashboard" element={<AdminDashBoard></AdminDashBoard>}/>

      {/* Dashboard route, to be protected */}
      <Route path="/admindashboard/:id" exact element={<SpecificItem></SpecificItem>}/>

      {/* All data available route */}
      <Route path="/alldata"/>
    </Routes>
  )
}
