import { useContext } from 'react';
import { useState } from 'react';
import globalContext from '../context/global/globalContext';

//hook for authentication, required globally
//includes status and methods with regards to login status

const useAuth = () => {

    //state and gloabl context var's

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const {setIsLoading, setError} = useContext(globalContext)

    //login function, using fetch api, and name and password passed to function 

    const LoginIn = async(name,password) => {
        setIsLoading(true)
        fetch('http://127.0.0.1:5000/loginAPI',{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin':'*',
                "Content-Type": "application/json",
                },
            body: JSON.stringify({
                user: name,
                password: password
            })
        }).then(response=>response.json()).then((res)=>{
            setIsLoading(false)
            if(res.error){
                setError(res.error)
            }
            if(res.login){
                setIsLoggedIn(true);
            }
        }).catch((err)=>{
            console.log(err)
            setIsLoading(false)
            setError('Error Login')
        })

    }

    //items to be returned for global access

    return [isLoggedIn, LoginIn];
}

export default useAuth;