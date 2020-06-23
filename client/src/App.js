import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Switch, Route, withRouter } from "react-router-dom";
import SpotifyWebApi from 'spotify-web-api-js';
import Home from './components/Home/Home';
import PrivateRoute from './components/Routes/PrivateRoute';
import LoginPage from './components/Login/LoginPage';
import GamePage from './components/Game/GamePage';
import './css/App.css';


const App = (props) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useLayoutEffect(() => {
    document.title="Quizify"
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get("access_token");
    
    if (access_token) {
      setIsLoggedIn(true);
      // spotifyApi.setAccessToken(hash.access_token);
      sessionStorage.setItem("access_token", access_token);
      props.history.push("/");
    }
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
            exact path="/play"
            isLoggedIn={isLoggedIn}
            component={GamePage}
            title="Quizify"
          />
          <PrivateRoute 
            path="/" 
            isLoggedIn={isLoggedIn} 
            component={Home}
            title="Quizify"
          />
        </Switch>
    
    </div>
  );
}

export default withRouter(App);