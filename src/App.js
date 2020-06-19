import React, { useEffect, useState } from 'react';
// import Spotify from 'spotify-web-api-js';
import SpotifyWebApi from 'spotify-web-api-js';
import CREDENTIALS from './utils/config';
// import axios from 'axios';
import './css/App.css';
import logo from './images/spotify.png'

function App() {
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const { CLIENT_ID, REDIRECT_URI } = CREDENTIALS;
  const scopes = [
    'user-read-private'
  ];

  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
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
    window.location.hash = '';

    setToken(hash.access_token);

  }, [])

  useEffect(() => {
    if (token) {
      let spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token);
      spotifyApi.getMe().then((r) => {
        setUser(r);
      });
    }
  }, [token])

  const handleLogin = () => {
    window.location = `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
  }

  return (
    <div style={{textAlign: "center", height: "100%"}}>
    
      <div className="login-page">
        <div className="banner">
          <h1 className="banner-text">Quizify</h1>
          <img style={{paddingLeft: "30px"}} alt="logo" src={logo} width="100" height="100"/> 
        </div>
        <button className="login-btn" type="login" onClick={handleLogin}>Login</button>
      </div>

      
      { user !== null && 
      <div>
        <h2>{user.display_name}</h2>
        <h2>{user.id}</h2>
        <img alt="profile" src={user.images[0].url}/>
        <h3>Followers: {user.followers.total}</h3>
      </div>
      }
     
    </div>
  );
}

export default App;
