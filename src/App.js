import React, { useEffect, useState } from 'react';
// import Spotify from 'spotify-web-api-js';
import SpotifyWebApi from 'spotify-web-api-js';
import AUTHZ_CREDENTIALS from './utils/config';
// import axios from 'axios';
import './css/App.css';

function App() {
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const clientId = AUTHZ_CREDENTIALS.CLIENT_ID;
  const redirectUri = AUTHZ_CREDENTIALS.REDIRECT_URI;
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
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
  }

  return (
    <div className="App">
     <h1>Hello World</h1>
     <button type="login" onClick={handleLogin}>Login</button>
     
     { user !== null && 
      <div>
        <h2>{user.display_name}</h2>
        <h2>{user.id}</h2>
        <img src={user.images[0].url}/>
        <h3>Followers: {user.followers.total}</h3>
      </div>
     }
     
    </div>
  );
}

export default App;
