import React from 'react'
import authContext from '../context/auth/authContext';
import { useContext } from 'react';
import { useState } from 'react';
import globalContext from '../context/global/globalContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

//Admin Dashboard page for for editing display options
//Requires a login via a master login

export default function AdminDashBoard() {

    //state variables and global context 

    const {isLoggedIn, LoginIn} = useContext(authContext);
    const {isLoading,error, setError} = useContext(globalContext)
    const [name,setName] = useState('');
    const [password, setPassword] = useState('');
   
    
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

    if(isLoggedIn){
        return(
            <div>
                welcome to admin dashboard
            </div>
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
