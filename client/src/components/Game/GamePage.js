import React, { useEffect, useState, useRef } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import SpotifyWebPlayer from './SpotifyWebPlayer';
import Timer from './Timer';
import { withRouter } from 'react-router-dom';

const GamePage = (props) => {
    const SLEEP_TIMER = 1000;
    const GAME_TIMER = 10000;
    const spotifyApi = new SpotifyWebApi();

    const [songs, setSongs] = useState([]);    
    const [currentSong, setCurrentSong] = useState();
    const [score, setScore] = useState(0);
    const [gameChoices, setGameChoices] = useState([]);
    const [webPlayerActive, setWebPlayerActive] = useState(false);
    const [correctChoice, setCorrectChoice] = useState(-1);
    const [showAnswers, setShowAnswers] = useState(false);
    const [pauseTimer, setPauseTimer] = useState(false);
    const [token, setToken] = useState();

    const loadedRef = useRef(false);
    
    useEffect(() => {
        // const token = sessionStorage.getItem("access_token");
        const token = JSON.parse(localStorage.getItem("access_token"));
        setToken(token);
        const artist = props.location.state.artistSelection;
        getSongs(artist);
    }, []);

    useEffect(() => {
        if (token) {
            spotifyApi.setAccessToken(token);
        }
    }, [token]);

    async function getSongs(artist) {
        let artistAlbums = await spotifyApi.getArtistAlbums(artist.id, { limit: 10 });
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
    }, [currentSong]);

    const startGame = () => {
        let randomChoices = [-1, -1, -1, -1];
        let correctIndex = Math.floor(Math.random() * 4);

        for (let i=0; i<4; i++) {
            if (i !== correctIndex) {
                let filledChoice = false;
                let randomSongIndex = -1;

                while (!filledChoice) {
                    randomSongIndex = Math.floor(Math.random() * (songs.length));
                    if (randomChoices.indexOf(randomSongIndex) === -1 
                            && randomChoices.findIndex(index => index !== -1 && songs[index].name === songs[randomSongIndex].name) === -1
                            && randomSongIndex !== currentSong.index
                            && songs[randomSongIndex].name !== songs[currentSong.index].name) {
                        filledChoice = true;
                    }
                }
                randomChoices[i] = randomSongIndex;
            }
        }

        console.log("Random choice indices: ", randomChoices);
        randomChoices = randomChoices.map(index => songs[index]);
        randomChoices[correctIndex] = songs[currentSong.index];
        console.log("Random choice songs: ", randomChoices.map(song => song.name));
        console.log(`Correct choice at index ${correctIndex}, song ${randomChoices[correctIndex].name}`)
        console.log(songs.map(song => song.uri));
        setCorrectChoice(correctIndex);
        setGameChoices(randomChoices);
    }

    const handleGameButton = async (index) => {
        if (gameChoices[index].name === currentSong.song.name) {
            setScore(score + 1);
        } 

        await setShowAnswers(true);
        await setPauseTimer(true);
        await sleep(SLEEP_TIMER);
        setShowAnswers(false); 
        setPauseTimer(false);

        if (currentSong.index >= songs.length - 1) {
            await goToNextSong(0);
        } else {
            await goToNextSong(currentSong.index + 1);
        }
    }

    const goToNextSong = async (index) => {
        let nextSong = await spotifyApi.getTrack(songs[index].id);
        setCurrentSong({song: nextSong, index: index});
        let currentPlayback = await spotifyApi.getMyCurrentPlayingTrack();
        if (currentPlayback.item.duration_ms > 70000) {
            spotifyApi.play({uris: [songs[index].uri], position_ms: 35000});
        } else {
            spotifyApi.play({uris: [songs[index].uri]});
        }
    }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const handleCallback = async (event) => {
        console.log(event);
        await setWebPlayerActive(event.isActive);
        if (event.isActive) {
            if (!loadedRef.current) {
                let currentPlayback = await spotifyApi.getMyCurrentPlayingTrack();
                if (currentPlayback.item.duration_ms > 70000) {
                    setTimeout(() => {
                        spotifyApi.seek(35000);
                    }, 250); 
                }
                loadedRef.current = true;
            }
        }
    }

    const handleQuit = (event) => {
        // props.history.push('/');
        window.location.assign('/');
    }

    return ( 
        <div style={{fontFamily: "Montserrat", height: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
            { !webPlayerActive &&
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            }

            {songs &&
                <div>
                    <SpotifyWebPlayer songs={songs.map(song => song.uri)} token={token} handleCallback={handleCallback} />
                </div>
            }
            
            { currentSong && webPlayerActive && [
                <button key="quit" onClick={handleQuit}>Quit</button>,
                <h1 key="score">Score: {score}</h1>,
                <h1 key="answer">Current song: {currentSong.song.name}</h1>,
                <Timer key="timer" seconds={GAME_TIMER} token={token} pauseTimer={pauseTimer} sleep={sleep} SLEEP_TIMER={SLEEP_TIMER} />,
                <img key="album-cover" className="album-cover" src={currentSong.song.album.images[0].url} alt="album" />            
            ]}

            { gameChoices.length > 0 && webPlayerActive &&
                <div className="game-interface">
                    {
                        [0,1,2,3].map(index => <button key={index} onClick={() => handleGameButton(index)} className={`game-btn ${showAnswers === true ? correctChoice === index ? 'game-btn-correct' : 'game-btn-incorrect' : '' }`}>{gameChoices[index].name}</button> )
                    }
                </div>
            }
        </div>
    );
}
 
export default withRouter(GamePage);