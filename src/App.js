import React, { useState, useLayoutEffect } from 'react';
import { Switch, Route, withRouter } from "react-router-dom";
import Home from './components/Home/Home';
import PrivateRoute from './components/Routes/PrivateRoute';
import LoginPage from './components/Login/LoginPage';
import GamePage from './components/Game/GamePage';
import './css/App.css';


const App = (props) => {
  useLayoutEffect(() => {
    document.title="Quizify"
  }, []);

  return (
    <div style={{textAlign: "center", height: "100%"}}>

        <Switch>
          <Route 
            exact path="/login" 
            component={LoginPage}
            title="Login"
          />
          <PrivateRoute
            path="/play/:artistId"
            component={GamePage}
            title="Quizify"
          />
          <PrivateRoute 
            path="/" 
            component={Home}
            title="Quizify"
          />
        </Switch>
    
    </div>
  );
}

export default withRouter(App);