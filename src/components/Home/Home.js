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
                setUser(response);
            });
            spotifyApi.getMyTopArtists({limit: 20}).then((response) => {
                let shuffledArtists = shuffle(response.items);
                setTopArtists(shuffledArtists.slice(0,5));
            });
        }
    }, [token]);

    const shuffle = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    return (
        <div style={{height: "100%"}}>
            {/* <UserInfo user={user} /> */}
            <RecommendedArtists topArtists={topArtists} />
            <ArtistSearch />
        </div>
    )
}

export default withRouter(Home);