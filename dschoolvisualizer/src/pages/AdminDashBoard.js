import React from 'react'
import authContext from '../context/auth/authContext';
import { useContext } from 'react';
import { useState } from 'react';
import globalContext from '../context/global/globalContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import {useNavigate} from "react-router-dom"


//Admin Dashboard page for for editing display options
//Requires a login via a master login

export default function AdminDashBoard() {

    //state variables and global context 

    const {isLoggedIn, LoginIn, logoutUser} = useContext(authContext);
    const {isLoading,error, setError, setIsLoading} = useContext(globalContext)
    const [name,setName] = useState('');
    const [password, setPassword] = useState('');
    const [dataItems, setDataItems] = useState();
    const [gridSettings, setSettings] = useState();
    const [value, setValue] = useState();

    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.tokendschool && !isLoggedIn){
            LoginIn()
        }
    }, [])

     const logout = () => {
             console.log("logout attempt")
            logoutUser()
            toast("Succefully Logged out")
       
    }

    const requestData = () =>{
        if(!dataItems ){
             setIsLoading(true)
             fetch('http://127.0.0.1:5000/dbAPI',{
                 mode: 'cors',
                 headers: {
                     'Access-Control-Allow-Origin':'*',
                     'Authorization': localStorage.tokendschool
                }
            }).then(response=>response.json()).then((res)=>{
                console.log(res.results)
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

    const addNewItem = () => {
        if(!value){
            toast("Please select a item to add")
        }
        console.log(value)
    }

    useEffect(()=>{
        if(isLoggedIn){
            console.log("I want the data items")
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

    //if is logged in display the admin dashboard [to be developed]

    if(isLoggedIn && dataItems){
        return(
            <>
            <ToastContainer></ToastContainer>
            <div className='min-h-screen'>
            <div className="navbar bg-base-300">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-2xl">ADMINDASHBOARD</a>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                    <button onClick={()=>{logout()}} className="btn btn-error">Logout</button>
                    </ul>
                </div>
            </div>

            

            <div className='flex flex-col justify-center items-center mt-8'>
                <div className='flex flex-row w-full justify-center p-12'>

                    <select onChange={event => setValue(event.target.value)} className="select select-lg select-success w-full max-w-xs">
                        <option disabled selected>Pick a display item</option>
                        <option value={'EC'}>Electric Consumption</option>
                        <option value={'EP'}>Electric Production</option>
                        <option value={'WC'}>Water Consumption</option>
                        <option value={'ECVSEP'}>Electric Consumption vs Production</option>
                    </select>

                    <button class="btn btn-lg btn-success ml-8" onClick={()=>{addNewItem()}}>Add Display Item</button>

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
    //had toastcontainer, for error displays on failure of login

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


