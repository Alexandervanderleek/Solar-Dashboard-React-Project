//Routing Component
//All available routes for the d-school visualization webapp

import React from 'react'
import {Routes, Route} from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import Display from '../../pages/Display';
import AdminDashBoard from '../../pages/AdminDashBoard';
import SpecificItem from '../../pages/SpecificItem';

export default function TheRoutes() {
  return (
    <Routes>
        
        {/* Main Route */}
        <Route path="/" element={<LandingPage></LandingPage>}>
            
        </Route>

        {/* Main Display Route */}
        <Route path="/display" element={<Display></Display>}>

        </Route>

        {/* Dashboard route, to be protected */}
        <Route path="/admindashboard" element={<AdminDashBoard></AdminDashBoard>}>

        </Route>

         {/* Dashboard route, to be protected */}
         <Route path="/admindashboard/:id" exact element={<SpecificItem></SpecificItem>}>

        </Route>

        {/* All data available route */}
        <Route path="/alldata">

        </Route>

    </Routes>
  )
}
