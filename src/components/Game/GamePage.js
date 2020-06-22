import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import SpotifyWebPlayer from './SpotifyWebPlayer';

const GamePage = (props) => {
    const token = sessionStorage.getItem("access_token");
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const [songs, setSongs] = useState([]);    
    const [currentSong, setCurrentSong] = useState();
    const [score, setScore] = useState(0);
    const [gameChoices, setGameChoices] = useState([]);
    const [playerIsActive, setPlayerIsActive] = useState(false);
    
    useEffect(() => {
        const artist = props.location.state.artistSelection;
        getSongs(artist);
    }, []);

    async function getSongs(artist) {
        let artistAlbums = await spotifyApi.getArtistAlbums(artist.id, { limit: 5 });
        let allTracks = [];

        for (const album of artistAlbums.items) {
            const albumTracks = await spotifyApi.getAlbumTracks(album.id);
            
            for (const track of albumTracks.items) {
                allTracks.push(track);
            }
        }

        allTracks = shuffleSongs(allTracks);
        setSongs(allTracks);

        let firstSong = await spotifyApi.getTrack(allTracks[0].id);
        setCurrentSong({ song: firstSong, index: 0})
    }

    const shuffleSongs = (songs) => {
        for (let i = songs.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            let temp = songs[i];
            songs[i] = songs[j];
            songs[j] = temp;
        }
        return songs;
    }

    useEffect(() => {
        if (songs && currentSong) {
            startGame();
        }
    }, [songs, currentSong]);

    const startGame = () => {
        let randomChoices = [-1, -1, -1, -1];
        let correctIndex = Math.floor(Math.random() * 4);

        for (let i=0; i<4; i++) {
            if (i !== correctIndex) {
                let filledChoice = false;
                let randomSongIndex = -1;

                while (!filledChoice) {
                    randomSongIndex = Math.floor(Math.random() * (songs.length));
                    if (randomChoices.findIndex(index => index === randomSongIndex) === -1 && randomSongIndex !== currentSong.index) {
                        filledChoice = true;
                    }
                }
                randomChoices[i] = randomSongIndex;
            }
        }

        randomChoices = randomChoices.map(index => songs[index]);
        randomChoices[correctIndex] = songs[currentSong.index];

        setGameChoices(randomChoices);
    }

    const handleGameButton = async (index) => {
        if (gameChoices[index].name === currentSong.song.name) {
            setScore(score + 1);
        } 
        spotifyApi.skipToNext();

        if (currentSong.index >= songs.length - 1) {
            let nextSong = await spotifyApi.getTrack(songs[0].id);
            setCurrentSong({song: nextSong, index: 0})
        } else {
            let nextSong = await spotifyApi.getTrack(songs[currentSong.index + 1].id);
            setCurrentSong({song: nextSong, index: currentSong.index + 1});
        }
        
        startGame();
    }

    const handleCallback = (event) => {
        setPlayerIsActive(event.isActive);
        if (event.isActive) {
            // console.log('Ready');
            setTimeout(() => {
                spotifyApi.seek(35000);
            }, 50); 
        }
    }

    return ( 
        <div style={{fontFamily: "Montserrat", height: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
            { !playerIsActive &&
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            }

            {songs &&
                <div>
                    <SpotifyWebPlayer songs={songs.map(song => song.uri)} token={token} handleCallback={handleCallback} />
                </div>
            }
            
            { currentSong && playerIsActive && [
                <h1 key="score">Score: {score}</h1>,
                <h1 key="answer">Current song: {currentSong.song.name}</h1>,
                <img key="album-cover" className="album-cover" src={currentSong.song.album.images[0].url} alt="album" />            
            ]}

            { gameChoices.length > 0 && playerIsActive &&
                <div className="game-interface">
                    <button onClick={() => handleGameButton(0)} className="game-btn">{gameChoices[0].name}</button>
                    <button onClick={() => handleGameButton(1)} className="game-btn">{gameChoices[1].name}</button>
                    <button onClick={() => handleGameButton(2)} className="game-btn">{gameChoices[2].name}</button>
                    <button onClick={() => handleGameButton(3)} className="game-btn">{gameChoices[3].name}</button>                
                </div>
            }

        </div>
    );
}
 
export default GamePage;