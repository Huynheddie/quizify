import React from 'react'
import Home from './Home';
import { Redirect } from "react-router-dom";

const CustomHomeRoute = (props) => {
    // If access token is in URL, return Home component
    if (window.location.hash) {
        return (
            <Home />
        ); 
    }
    else {
        return <Redirect to='/login' />
    }
}

export default CustomHomeRoute;