import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import authContext from '../context/auth/authContext';
import NumberPicker from "react-widgets/NumberPicker";
import { FcComboChart, FcDataConfiguration, FcFullTrash, FcHome, FcUpload } from "react-icons/fc";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import globalContext from '../context/global/globalContext';
import { ToastContainer, toast } from 'react-toastify';


//Specific item class
//Shows details on a display item 
//has methods and ability to edit the current specific display item [Edit & Delete]

export default function SpecificItem({}) {

    const { logoutUser} = useContext(authContext);
    const { setError, setIsLoading} = useContext(globalContext)
    const location = useLocation()
    const navigate = useNavigate();

    //Details for the current Item
    const [item, setItem] = useState({
      id: location.state[0],
      type:location.state[1],
      data:location.state[2],
      interval:location.state[3],
      period:location.state[4],
      graph:location.state[5],
      adNotes:location.state[6],
      enabled:location.state[7],
      title: location.state[8],
    })

    //Method for deletion of current item
    //Input itemID -> Output deletion of item from database
    const submitDelete = () => {
      confirmAlert({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this.',
        buttons: [{
            label: 'Yes',
            onClick: () => {
              fetch('http://127.0.0.1:5000/deleteItem',{
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    "Content-Type": "application/json",
                    'Authorization': localStorage.tokendschool
                    },
                body: JSON.stringify({
                    itemID: item.id
                })
            }).then(response=>response.json()).then((res)=>{
                setIsLoading(false)
                if(res.error){
                    setError(res.error)
                }
                if(res.success){
                    navigate('/admindashboard')
                }
            }).catch((err)=>{
                setIsLoading(false)
                setError('Error deleting Item')
            })}},
          { label: 'No', }]
      });
    };

    //Method for submiting the updating of results for display item
    //Input new item data -> updated item in display item database
    const submitUpdate = () => {
      confirmAlert({
        title: 'Confirm Updating',
        message: 'Are you sure you want to update this.',
        buttons: [{
            label: 'Yes',
            onClick: () => {
              fetch('http://127.0.0.1:5000/updateItem',{
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    "Content-Type": "application/json",
                    'Authorization': localStorage.tokendschool
                    },
                body: JSON.stringify({
                    item: item
                })
            }).then(response=>response.json()).then((res)=>{
                setIsLoading(false)
                if(res.error){
                    setError(res.error)
                }
                if(res.success){
                   toast("Updated Succesfully")
                }
            }).catch((err)=>{
                setIsLoading(false)
                toast('Error updating Item')
            })}},
          { label: 'No', }]
      });
    };

    //Method call to logout used
    //Output navigation to main dashboard
    const logout = () => {
      logoutUser()
      navigate('/admindashboard')
  }

    if(location.state){
        return (
            <div className='min-h-screen'>

              <ToastContainer></ToastContainer>

              {/* NAVBAR COMPONENT */}
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

                <div className="flex-none">
                  <ul className="menu menu-horizontal px-1">
                    <button onClick={()=>{logout()}} className="btn btn-lg btn-error">Logout</button>
                  </ul>
                </div>
              </div>

              {/* EDITABLE INPUTS FOR ITEM ] */}
                <div className='flex justify-center'>
                  <div className='mt-12 border-4 border-gray-500 p-3 rounded-xl'>

                    {/* TITLE INPUT */}
                    <div className='flex flex-col m-3'>
                      <div className='text-2xl font-bold'>
                        Title:
                      </div>

                      <input type="text" placeholder="Type here" value={item.title} onChange={(e)=>{
                        item.title = e.target.value
                        setItem({...item})}} className="input input-lg input-bordered input-accent w-96 text-xl" />
                    </div>
                    
                    {/* INTERVAL INPUT */}
                    <div className='flex flex-col m-3'>
                      <div className='text-2xl font-bold'>
                        Interval:
                      </div>
                      
                      <select onChange={(e)=>{
                        item.interval = e.target.value
                        setItem({...item})}} value={item.interval} className="select select-lg select-success w-full max-w-xs"> 
                        <option value={'day'}>Daily</option>
                        <option value={'month'}>Monthly</option>
                        <option value={'hour'}>Hourly</option>
                      </select>
                    </div>
                    
                    {/* PERIOD INPUT */}
                    <div className='flex flex-col m-3'>
                      <div className='text-2xl font-bold'>
                        Period:
                      </div>
                      <div className='border-2 border-emerald-500 rounded-md'>
                        <NumberPicker
                            className='text-3xl p-2'
                            onKeyDown={(e)=>{e.preventDefault()}}
                            value={item.period}
                            onChange={(value)=>{
                              item.period = value
                              setItem({...item})}}
                            min={1}
                            max={30}
                        ></NumberPicker>
                      </div>
                    </div>

                    {/* GRAPH INPUT */}
                    <div className='flex flex-col m-3'>
                      <div className='text-2xl font-bold'>
                        Graph:
                      </div>
                      
                      <select onChange={(e)=>{
                        item.graph = e.target.value
                        setItem({...item})}} value={item.graph} className="select select-lg select-success w-full max-w-xs">

                        { item.data === 'ECVSEP' ?
                          <option value={'linemulti'}>Multi Line Graph</option> :
                          <>
                            <option value={'line'}>Line Graph</option>
                            <option value={'bar'}>Bar Graph</option>
                          </>}  
                      </select>
                    </div>
                        
                    {/* ICON INPUT */}
                    <div className='flex flex-col m-3'>
                      <div className='text-2xl font-bold'>
                        Icon:
                      </div>

                      <select onChange={(e)=>{
                        item.adNotes = e.target.value
                        setItem({...item})}} value={item.adNotes} className="select select-lg select-success w-full max-w-xs">

                        {item.data === 'ECVSEP' && (
                          <>
                            <option value={''}>None</option>
                            <option value={'net'}>Net consumed vs produced</option>
                          </>)}

                        {(item.data === 'EP' || item.data === 'EC') && (
                          <>
                            <option value={'house'}>
                              Houses produced/consumed
                            </option>
                            <option value={'trend'}>
                              Trend % for data
                            </option>
                            <option value={''}>None</option>

                          </>)}

                        {item.data === 'WC' && (
                          <>
                            <option value={'bottle'}>
                              Bottles Consumed
                            </option>
                            <option value={'trend'}>
                              Trend % for data
                            </option>
                            <option value={''}>None</option>

                          </>)}
                      </select>
                    </div>  
                    
                    {/* ENABLED BUTTON */}
                   <div className='flex m-3'>
                      <div className="text-2xl font-bold mr-5">Enabled:</div>
                      <input type="checkbox" checked={item.enabled==='t'?true:false}  onChange={(e)=>{
                        item.enabled = e.target.checked ? 't' : 'f'
                        setItem({...item})}} className="checkbox checkbox-lg checkbox-success" />
                    </div>
                      
                    {/* BUTTONS FOR UPDATING AND DELETING */}
                    <div className='flex justify-between mt-8'>
                      <button className="btn btn-info font-bold" onClick={submitUpdate}>
                        <FcUpload size={20}></FcUpload>
                        Update
                      </button>
                      <button className="btn btn-error font-bold" onClick={submitDelete}>
                        <FcFullTrash size={20}></FcFullTrash>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
            </div>)}

    return (
        <div>
        Could not locate Item
        </div>
    )
}
