import React, { useEffect, useState, useLayoutEffect } from 'react';
import Home from './components/Home/Home';
import PrivateRoute from './components/Routes/PrivateRoute';
import LoginPage from './components/Login/LoginPage';
import { Switch, Route, withRouter } from "react-router-dom";
import SpotifyWebApi from 'spotify-web-api-js';
import './css/App.css';

const App = (props) => {
  let spotifyApi = new SpotifyWebApi();

  // const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useLayoutEffect(() => {
    let hash = retrieveToken();
    if (hash.access_token) {
      // setToken(hash.access_token);
      setIsLoggedIn(true);
      spotifyApi.setAccessToken(hash.access_token);
      props.history.push("/");
    }
  }, []);

  const retrieveToken = () => {
    let hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
    return hash;
  }

  return (
    <div style={{textAlign: "center", height: "100%"}}>

        <Switch>
          <Route 
            exact path="/login" 
            component={LoginPage}
            title="Login"
          />
          <PrivateRoute 
            path="/" 
            isLoggedIn={isLoggedIn} 
            component={Home}
            spotifyApi={spotifyApi}
            title="Quizify"
          />
        </Switch>
    
    </div>
  );
}

export default withRouter(App);