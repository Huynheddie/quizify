import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import ArtistSearch from './ArtistSearch';
import '../../css/Home.css';

const Home = ({ spotifyApi }) => {
    const [user, setUser] = useState();

    useEffect(() => {
        document.title="Quizify"
        spotifyApi.getMe().then((response) => {
            console.log(response);
            setUser(response);
        })
    }, []);

    return (
        <div style={{height: "100%"}}>
            <UserInfo user={user} />
            <ArtistSearch spotifyApi={spotifyApi} />
        </div>
    )
}

export default Home;