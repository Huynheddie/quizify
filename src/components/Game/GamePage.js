import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import SpotifyWebPlayer from './SpotifyWebPlayer';
import { withRouter, useParams } from 'react-router-dom';
import LoadingGif from './LoadingGif';
import GameChoices from './GameChoices';
import GameDisplay from './GameDisplay';

const GamePage = (props) => {
    const SLEEP_TIMER = 2000;
    const GAME_TIMER = 5;
    const spotifyApi = new SpotifyWebApi();

    const [token, setToken] = useState();
    const [songs, setSongs] = useState([]);    
    const [currentSong, setCurrentSong] = useState();
    const [score, setScore] = useState(0);
    const [gameChoices, setGameChoices] = useState([]);
    const [correctChoice, setCorrectChoice] = useState(-1);
    const [showAnswers, setShowAnswers] = useState(false);
    const [webPlayerActive, setWebPlayerActive] = useState(false);
    const [pauseTimer, setPauseTimer] = useState(false);

    let { artistId } = useParams();
    
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("access_token"));
        setToken(token);
        getSongs(artistId);
    }, []);

    useEffect(() => {
        if (token) {
            spotifyApi.setAccessToken(token);
        }
    }, [token]);

    async function getSongs(artistId) {
        let artistAlbums = await spotifyApi.getArtistAlbums(artistId, { limit: 10 });
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

        // console.log("Random choice indices: ", randomChoices);
        randomChoices = randomChoices.map(index => songs[index]);
        randomChoices[correctIndex] = songs[currentSong.index];
        // console.log("Random choice songs: ", randomChoices.map(song => song.name));
        // console.log(`Correct choice at index ${correctIndex}, song ${randomChoices[correctIndex].name}`)
        // console.log(songs.map(song => song.uri));
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

    const handleWebPlayerActive = (isPlayerActive) => {
        setWebPlayerActive(isPlayerActive);
    }

    const handlePlayAgain = () => {
        window.location.assign(`${process.env.PUBLIC_URL}/play/${artistId}`)
    }

    const handleQuit = (event) => {
        console.log('Quitting');
        window.location.assign(`${process.env.PUBLIC_URL}/`);
    }

    return ( 
        <div style={{fontFamily: "Montserrat", height: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <LoadingGif webPlayerActive={webPlayerActive} />
            
            {songs.length > 0 &&
                <SpotifyWebPlayer songs={songs.map(song => song.uri)} handleWebPlayerActive={handleWebPlayerActive} artistId={artistId} />
            }
            
            <GameDisplay currentSong={currentSong} webPlayerActive={webPlayerActive}
                         handleQuit={handleQuit} score={score} currentSong={currentSong}
                         GAME_TIMER={GAME_TIMER} token={token} pauseTimer={pauseTimer}
                         sleep={sleep} SLEEP_TIMER={SLEEP_TIMER} handlePlayAgain={handlePlayAgain}
                         handleQuit={handleQuit} />

            <GameChoices gameChoices={gameChoices} webPlayerActive={webPlayerActive} handleGameButton={handleGameButton}
                         showAnswers={showAnswers} correctChoice={correctChoice} />
        </div>
    );
}
 
export default withRouter(GamePage);