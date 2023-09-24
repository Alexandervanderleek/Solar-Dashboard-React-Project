import React from 'react'
import authContext from '../context/auth/authContext';
import { useContext } from 'react';
import { useState } from 'react';
import globalContext from '../context/global/globalContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { ToastContainer, toast } from 'react-toastify';
import { FcComboChart, FcDataConfiguration, FcHome } from "react-icons/fc";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import NumberPicker from "react-widgets/NumberPicker";



//Admin Dashboard class for editing display options
//Certain methods require login to access
//Can edit display items via the admindashboard class

export default function AdminDashBoard() {

    //state variables and global context 
    const {isLoggedIn, LoginIn, logoutUser} = useContext(authContext);
    const {isLoading,error, setError, setIsLoading} = useContext(globalContext)
    const [name,setName] = useState('');
    const [password, setPassword] = useState('');
    const [dataItems, setDataItems] = useState();
    const [item, setItem] = useState();
    const [gridSettings, setGridSettings] = useState()
    const [col, setCol] = useState(1)
    const [row, setRow] = useState(1)
    const [fakeData,SetFakeData] = useState('')
    const navigate = useNavigate();

    //Hook to run loginMethod if a token is detected
    useEffect(()=>{
        if(localStorage.tokendschool && !isLoggedIn){
            LoginIn()
        }
    }, [])

    //Logout method, call logout method from authcontext
    const logout = () => {
        logoutUser()
        toast("Succefully Logged out")       
    }

    //Method: request all items in display item database
    //Ouput => data item from database
    //Requires the login token is present
    const requestData = (wantNow) =>{
        if(!dataItems || wantNow ){
             setIsLoading(true)
             fetch('http://127.0.0.1:5000/dbAPI',{
                 mode: 'cors',
                 headers: {
                     'Access-Control-Allow-Origin':'*',
                     'Authorization': localStorage.tokendschool
                }
            }).then(response=>response.json()).then((res)=>{
                setDataItems(res.results)
                console.log(res.settings)
                SetFakeData(res.settings[1][1])
                setGridSettings(res.settings[0])
                setCol(res.settings[0][1])
                setRow(res.settings[0][2])
                setIsLoading(false)
            }).catch((e)=>{
                setIsLoading(false)
                setError("error fetching")
            })
        }
    }

    //Method: updateGrid settings for display 
    //takes input grid settings and sends to backend
    //ouput is updated grid 
    //Token is required
    const updateGrid = (fakedata, value) => {
        if(col==gridSettings[1] && row==gridSettings[2] && !fakedata){
            toast("Grid up to date")
        }else{
            setIsLoading(true)
            fetch('http://127.0.0.1:5000/updateGrid',{
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    "Content-Type": "application/json",
                    'Authorization': localStorage.tokendschool
                    },
                body: JSON.stringify(
                    {
                        col: col,
                        row: row,
                        fake: value
                    }
            )
            }).then(response=>response.json()).then((res)=>{
                setIsLoading(false)
                if(res.error){
                    setError(res.error)
                }
                if(res.success){
                    setGridSettings(["grid",col, row])
                    if(fakedata){
                        toast("Changed Data ")
                    }else{
                        toast("Updated Grid")
                    }
                       
                }
            }).catch((err)=>{
                setIsLoading(false)
                setError('Error updating grid')
            })
        }
    }

    //Method: add a new item to database
    //takes input item to be added and sends to backend
    //ouput is updated display items 
    //Token is required
    const addNewItem = () => {
        if(!item){
            toast("Please select item to add")
        }else{
            setIsLoading(true)
            fetch('http://127.0.0.1:5000/addDefault',{
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
                    requestData(true)
                    toast("Added new Item")
                }
            }).catch((err)=>{
                setIsLoading(false)
                setError('Error adding Item')
            })
        }
    }

    //Hook to re request data on a login
    useEffect(()=>{
        if(isLoggedIn){
            requestData()
        }
    },[isLoggedIn])

    
    //hook for error detection, to trigger a error toast effect
    useEffect(()=>{
       if(error!==''){
        toast(error)
        setError('')
       }
    },[error])

    //if in a loading state, display loading spinner
    if(isLoading){
        return(
        <LoadingSpinner></LoadingSpinner>
        )
    }

    //if is loggedin display the admin dashboard 
    if(isLoggedIn && dataItems){
        return(
            <>
            <ToastContainer></ToastContainer>
            <div className='min-h-screen'>
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
                    
                    <span className="label-text text-lg font-bold mr-2">Fake Data</span> 
                    <input type="checkbox" checked={fakeData==='f'?true:false} onChange={(e)=>{
                        SetFakeData(e.target.checked ? 'f' : 't')
                        updateGrid(true,e.target.checked ? 'f' : 't' )
                        }} className="toggle toggle-accent toggle-lg mr-8" />                

                    <ul className="menu menu-horizontal px-1">
                    <button onClick={()=>{logout()}} className="btn btn-lg btn-error">Logout</button>
                    </ul>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center mt-8'>
                <div className='flex items-center'>
                    <div className='border-4 border-blue-400 p-4 rounded-lg'>
                        <div className='text-2xl'>
                            Grid Cols:
                        </div>
                        <NumberPicker
                            className='text-3xl p-2'
                            onKeyDown={(e)=>{e.preventDefault()}}
                            value={col}
                            onChange={value=>setCol(value)}
                            min={1}
                            max={4}
                        ></NumberPicker>
                    
                        <div className='text-2xl'>
                            Grid Rows:
                        </div>
                        <NumberPicker
                            min={1}
                            max={4}
                            className='text-3xl p-2'
                            onKeyDown={(e)=>{e.preventDefault()}}
                            value={row}
                            onChange={value=>setRow(value)}
                        ></NumberPicker>
                    
                    </div>

                    <button className="btn ml-6 btn-lg btn-info" onClick={()=>{updateGrid(false)}}>Update Grid</button>


                </div>
                
            </div>
            

            <div className='flex flex-col justify-center items-center mt-8'>
                <div className='flex flex-row w-full justify-center p-12'>

                    <select onChange={event => setItem(event.target.value)} className="select select-lg select-success w-full max-w-xs">
                        <option disabled selected>Pick a display item</option>
                        <option value={'EC'}>Electric Consumption</option>
                        <option value={'EP'}>Electric Production</option>
                        <option value={'WC'}>Water Consumption</option>
                        <option value={'ECVSEP'}>Electric Consumption vs Production</option>
                        <option value={'compare'}>Compare this vs last Electric</option>
                        <option value={'comparewater'} >Compare this vs last Water</option>
                        <option value={'information'}>Text Component</option>
                        <option value={'video'}>Video Component</option>
                    </select>

                    <button className="btn btn-lg btn-success ml-8" onClick={()=>{addNewItem()}}>Add Display Item</button>

                </div>


                <div className="border-indigo-500 border-4 rounded-2xl">
                    <table className=" table table-lg max-w-6xl m-5">
                    
                            <thead>
                            <tr className='text-lg'>
                                <th>ID</th>
                                <th>TYPE</th>
                                <th>DATA</th>
                                <th>INTERVAL</th>
                                <th>PERIOD</th>
                                <th>GRAPH</th>
                                <th>ICON</th>
                                <th>ENABLED</th>
                                <th>TITLE</th>


                            </tr>
                            </thead>
                        <tbody className=''>
                            {
                                dataItems.map((item)=>(
                                    
                                        <tr onClick={()=>{navigate(`/admindashboard/${item[0]}`, {state: item})}} key={item[0]} class="hover">
                                            <th>{item[0]}</th>
                                            <td>{item[1]}</td>
                                            <td>{item[2]}</td>
                                            <td>{item[3]}</td>
                                            <td>{item[4]}</td>
                                            <td>{item[5]}</td>
                                            <td>{item[6]}</td>
                                            <td>{item[7]}</td>
                                            <td>{item[8]}</td>
                                            
                                        </tr>
                                   
                                ))
                            }


                        </tbody>
                    </table>
                    </div>
            </div>
            </div>
            </>
        )
    }


    //if not logged in && not loading 
    //display a login prompt 
    //have toastcontainer, for error displays on failure of login
    return (
        <>
            <ToastContainer></ToastContainer>
            <div className="h-screen flex flex-col justify-center items-center">
                <div className="flex flex-col bg-slate-700 p-8 rounded-md border-2 shadow-lg border-none content-center" >
                    <div className='text-4xl font-extrabold m-2 text-center'>Admin Login</div>

                    <div className="p-3">
                        <input type="text" placeholder="Name" value={name} onChange={(e)=>{setName(e.target.value)}} className="input w-full max-w-xs" />
                    </div>

                    <div className="p-3">
                        <input type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}} className="input w-full max-w-xs" />
                    </div>

                    <div className="flex justify-evenly m-2">
                        <button className="btn btn-info w-full" onClick={()=>{LoginIn(name, password)}}>Login</button>  
                    </div>
                </div>
            </div>
        </>
    )
}


