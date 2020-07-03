import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = () => {
        // const urlParams = new URLSearchParams(window.location.search);
        // const access_token = urlParams.get("access_token");

        // Get access token from url hash
        const hash = window.location.hash
            .substring(1)
            .split('&')
            .reduce(function (initial, item) {
                if (item) {
                    var parts = item.split('=');
                    initial[parts[0]] = decodeURIComponent(parts[1]);
                }
                return initial;
                }, {});
        window.location.hash = '';

        const access_token = hash.access_token;
        // const access_token_ls = JSON.parse(localStorage.getItem("access_token"));
        const access_token_ss = sessionStorage.getItem("access_token");


        if (access_token_ss) {
            return true;
        }
        
        if (access_token) {
            // localStorage.setItem("access_token", JSON.stringify(access_token));
            sessionStorage.setItem("access_token", access_token);
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