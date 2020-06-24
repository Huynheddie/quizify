import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import ArtistSearch from './ArtistSearch';
import '../../css/Home.css';
import SpotifyWebApi from 'spotify-web-api-js';
import { withRouter } from 'react-router-dom';

const Home = (props) => {
    const [user, setUser] = useState();
    const [token, setToken] = useState();
    const spotifyApi = new SpotifyWebApi();   

    useEffect(() => {
        // const token = sessionStorage.getItem("access_token");
        const token = JSON.parse(localStorage.getItem("access_token"));
        if (token === null) {
            console.log('huh')
            props.history.push('/');
        }
        setToken(token);
        console.log('Rendered home')
    }, []);

    useEffect(() => {
        if (token) {
            spotifyApi.setAccessToken(token);
            spotifyApi.getMe().then((response) => {
                setUser(response);
            });
        }
        
    }, [token]);

    return (
        <div style={{height: "100%"}}>
            <UserInfo user={user} />
            <ArtistSearch />
        </div>
    )
}

export default withRouter(Home);