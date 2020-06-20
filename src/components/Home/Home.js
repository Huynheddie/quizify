import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import ArtistSearch from './ArtistSearch';
import '../../css/Home.css';
import SpotifyWebApi from 'spotify-web-api-js';

const Home = (props) => {
    const [user, setUser] = useState();
    const token = sessionStorage.getItem("access_token");
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    useEffect(() => {
        spotifyApi.getMe().then((response) => {
            // console.log(response);
            setUser(response);
        })
    }, []);

    return (
        <div style={{height: "100%"}}>
            <UserInfo user={user} />
            <ArtistSearch />
        </div>
    )
}

export default Home;