import React, { useState, useEffect } from 'react';
// import UserInfo from './UserInfo';
import ArtistSearch from './ArtistSearch';
import RecommendedArtists from './RecommendedArtists';
import SpotifyWebApi from 'spotify-web-api-js';
import { withRouter } from 'react-router-dom';
import musicTools from '../../utils/musicTools';

const Home = (props) => {
    const [token, setToken] = useState();
    // const [user, setUser] = useState();
    const [topArtists, setTopArtists] = useState([]);
    const spotifyApi = new SpotifyWebApi();   

    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        if (token === null) {
            props.history.push('/');
        }
        setToken(token);
    }, [props.history]);

    useEffect(() => {
        if (token) {
            spotifyApi.setAccessToken(token);
            // spotifyApi.getMe().then((response) => {
            //     setUser(response);
            // });
            spotifyApi.getMyTopArtists({limit: 20}).then((response) => {
                let shuffledArtists = musicTools.shuffle(response.items);
                setTopArtists(shuffledArtists.slice(0,5));
            });
        }
    }, [token]);

    return (
        <div style={{height: "100%"}}>
            {/* <UserInfo user={user} /> */}
            <RecommendedArtists topArtists={topArtists} />
            <ArtistSearch />
        </div>
    )
}

export default withRouter(Home);