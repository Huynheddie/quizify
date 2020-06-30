import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import ArtistSearch from './ArtistSearch';
import RecommendedArtists from './RecommendedArtists';
import '../../css/Home.css';
import SpotifyWebApi from 'spotify-web-api-js';
import { withRouter } from 'react-router-dom';

const Home = (props) => {
    const [token, setToken] = useState();
    const [user, setUser] = useState();
    const [topArtists, setTopArtists] = useState([]);
    const spotifyApi = new SpotifyWebApi();   

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("access_token"));
        if (token === null) {
            props.history.push('/');
        }
        setToken(token);
    }, []);

    useEffect(() => {
        if (token) {
            spotifyApi.setAccessToken(token);
            spotifyApi.getMe().then((response) => {
                console.log(response);
                setUser(response);
            });
            spotifyApi.getMyTopArtists({limit: 5}).then((response) => {
                console.log(response);
                setTopArtists(response.items);
            });
        }
    }, [token]);

    return (
        <div style={{height: "100%"}}>
            <UserInfo user={user} />
            <RecommendedArtists topArtists={topArtists} />
            <ArtistSearch />
        </div>
    )
}

export default withRouter(Home);