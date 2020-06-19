import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ isLoggedIn, component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isLoggedIn === true
        ? <Component {...props} {...rest} />
        : <Redirect to = "/login" />
    )} />
)
 
export default PrivateRoute;