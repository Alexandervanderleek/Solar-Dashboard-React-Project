import React, { useState} from "react";
import GlobalContext from "./globalContext";

//global provider component, providing access to global vars to all children components

const GlobalState = ({children}) => {

    //vars to be used
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    return (
        <GlobalContext.Provider value={{
            error,
            setError,
            isLoading,
            setIsLoading,
        }}>
            {children}
        </GlobalContext.Provider>
       
    )
}

export default GlobalState;