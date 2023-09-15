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
    const {isLoading,error, setError, setIsLoading} = useContext(globalContext)
    const [name,setName] = useState('');
    const [password, setPassword] = useState('');
    const [dataItems, setDataItems] = useState();
    const [gridSettings, setSettings] = useState();
    

    useEffect(()=>{
        if(localStorage.tokendschool && !isLoggedIn){
            LoginIn()
        }
    }, [])

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
            <div class="overflow-x-auto">
                <table class="table">
                   
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Job</th>
                            <th>Favorite Color</th>
                        </tr>
                        </thead>
                    <tbody>
                   
                        {/* <tr>
                            <th>1</th>
                            <td>Cy Ganderton</td>
                            <td>Quality Control Specialist</td>
                            <td>Blue</td>
                        </tr>
                    
                        <tr class="hover">
                            <th>2</th>
                            <td>Hart Hagerty</td>
                            <td>Desktop Support Technician</td>
                            <td>Purple</td>
                        </tr>
                   
                        <tr>
                            <th>3</th>
                            <td>Brice Swyre</td>
                            <td>Tax Accountant</td>
                            <td>Red</td>
                        </tr> */}
                        {
                            dataItems.map((item)=>(
                                <tr class="hover">
                                    <th>{item[0]}</th>
                                    <td>{item[1]}</td>
                                    <td>Desktop Support Technician</td>
                                    <td>Purple</td>
                                </tr>
                            ))
                        }


                    </tbody>
                </table>
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
