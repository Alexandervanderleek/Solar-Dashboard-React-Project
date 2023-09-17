import React from "react";
import AuthContext from './authContext';
import useAuth from '../../hooks/useAuth';

//auth provider class, providing access to auth vars to all children components

const AuthProvider = ({children}) => {
    
    //auth hook returns the login and login status
    const [isLoggedIn, LoginIn, logoutUser] = useAuth();

    return(
        <AuthContext.Provider value={{isLoggedIn, LoginIn, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider; 