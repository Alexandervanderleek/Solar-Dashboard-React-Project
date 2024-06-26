import { useContext } from 'react';
import { useState } from 'react';
import globalContext from '../context/global/globalContext';

//hook for authentication, required globally
//includes status and methods with regards to login status

const useAuth = () => {

    //state and gloabl context var's
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const {setIsLoading, setError} = useContext(globalContext)

    //login method
    //Input (credentials)
    //output (login token)
    const LoginIn = async(name,password) => {
        setIsLoading(true)
        //no token login
        if(!localStorage.tokendschool){
            fetch('http://127.0.0.1:5000/loginAPI', {
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
                if(res.token){
                    localStorage.setItem('tokendschool', res.token);
                    setIsLoggedIn(true);
                }
            }).catch((err)=>{
                setIsLoading(false)
                setError('Error Login')
            })
        }else{
            //token login
            fetch('http://127.0.0.1:5000/loginAPI',{
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    "Content-Type": "application/json",
                    'Authorization': localStorage.tokendschool
                    },
               
            }).then(response=>response.json()).then((res)=>{
                setIsLoading(false)
                if(res.error){
                    setError(res.error)
                    localStorage.removeItem('tokendschool')
                }
                if(res.login){
                    setIsLoggedIn(true);
                }
                
            }).catch((err)=>{
                localStorage.removeItem('tokendschool')
                setIsLoading(false)
                setError('Error Login')
            })
        }

    }

    //method: destroys current login token,
    //sets login status to false
    const logoutUser = () => {
        localStorage.removeItem('tokendschool')
        setIsLoggedIn(false)
    }


    //items to be returned for global access
    return [isLoggedIn, LoginIn, logoutUser];
}

export default useAuth;