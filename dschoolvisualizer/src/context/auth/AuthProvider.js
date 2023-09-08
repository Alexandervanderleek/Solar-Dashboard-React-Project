import React from "react";
import AuthContext from './authContext';
import useAuth from '../../hooks/useAuth';

//auth provider component, providing access to auth vars to all children components

const AuthProvider = ({children}) => {
    
    //auth hook returns the login and login status
    const [isLoggedIn, LoginIn] = useAuth();

    return(
        <AuthContext.Provider value={{isLoggedIn, LoginIn}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider; 