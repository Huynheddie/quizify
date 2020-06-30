import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const access_token = urlParams.get("access_token");
        const access_token_ls = JSON.parse(localStorage.getItem("access_token"));

        if (access_token_ls) {
            return true;
        }
        
        if (access_token) {
            localStorage.setItem("access_token", JSON.stringify(access_token));
            return true;
        }
        return false;
    }
    return (
        <Route {...rest} render={(props) => (
            isLoggedIn()
            ? <Component {...props} {...rest} />
            : <Redirect to = "/login" />
        )} />
    )
}
 
export default PrivateRoute;