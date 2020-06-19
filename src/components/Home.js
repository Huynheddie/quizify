import React, { useState, useEffect } from 'react'
// import Spotify from 'spotify-web-api-js';
import SpotifyWebApi from 'spotify-web-api-js';
import '../css/Home.css';

const Home = (props) => {
    const [token, setToken] = useState();
    const [user, setUser] = useState();

    useEffect(() => {
        retrieveToken();
    }, [])

    useEffect(() => {
        if (token) {
            let spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(token);
            spotifyApi.getMe().then((response) => {
                console.log(response);
                setUser(response);
            })
        }
        
    }, [token])

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
        setToken(hash.access_token);
    }

    return (
        <div style={{height: "100%"}}>
            {user &&
                <div className="home-display">
                    <h1>{user.display_name}</h1>
                    <img alt="user profile" src={user.images[0].url}/>
                </div>
            }
            
        </div>
    )
}

export default Home;