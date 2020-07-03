import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import SpotifyWebPlayer from './SpotifyWebPlayer';
import { withRouter, useParams } from 'react-router-dom';
import LoadingGif from './LoadingGif';
import GameChoices from './GameChoices';
import GameDisplay from './GameDisplay';
import musicTools from '../../utils/musicTools';

const GamePage = (props) => {
    const SLEEP_TIMER = 2000;
    const GAME_TIMER = 120;
    const spotifyApi = new SpotifyWebApi();

    const [token, setToken] = useState();
    const [songs, setSongs] = useState([]);    
    const [currentSong, setCurrentSong] = useState();
    const [score, setScore] = useState(0);
    const [gameChoices, setGameChoices] = useState([]);
    const [correctChoice, setCorrectChoice] = useState(-1);
    const [showAnswers, setShowAnswers] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [webPlayerActive, setWebPlayerActive] = useState(false);
    const [pauseTimer, setPauseTimer] = useState(false);

    let { artistId } = useParams();
    
    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        setToken(token);
    }, []);

    useEffect(() => {
        if (token) {
            spotifyApi.setAccessToken(token);
            getSongs(artistId);
        }
    }, [token]);

    async function getSongs(artistId) {
        try {
            let artistAlbums = await spotifyApi.getArtistAlbums(artistId, { limit: 5 });
            let allTracks = [];

            for (const album of artistAlbums.items) {
                const albumTracks = await spotifyApi.getAlbumTracks(album.id);
                
                for (const track of albumTracks.items) {
                    allTracks.push(track);
                }
            }

            allTracks = musicTools.shuffle(allTracks);
            setSongs(allTracks);

            let firstSong = await spotifyApi.getTrack(allTracks[0].id);
            setCurrentSong({ song: firstSong, index: 0})
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => { 
        if (songs && currentSong) {
            startGame();
        }
    }, [currentSong]);

    const startGame = () => {

        if (songs.length < 4) {
            console.log('Not enough songs to play.');
            props.history.push('/');
            return;
        }

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

        // console.log(songs.map(song => song.name));
        // console.log("Random choice indices: ", randomChoices);
        randomChoices = randomChoices.map(index => songs[index]);
        randomChoices[correctIndex] = songs[currentSong.index];
        // console.log("Random choice songs: ", randomChoices.map(song => song.name));
        // console.log(`Correct choice at index ${correctIndex}, song ${randomChoices[correctIndex].name}`)
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

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const goToNextSong = async (index) => {
        try {
            let nextSong = await spotifyApi.getTrack(songs[index].id);
            setCurrentSong({song: nextSong, index: index});
            if (nextSong.duration_ms > 70000) {
                spotifyApi.play({uris: [songs[index].uri], position_ms: 35000});
            } else {
                spotifyApi.play({uris: [songs[index].uri]});
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleWebPlayerActive = (isPlayerActive) => {
        setWebPlayerActive(isPlayerActive);
    }

    const disableButtons = () => {
        setButtonsDisabled(true);
    }

    return ( 
        <div style={{fontFamily: "Montserrat", height: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <LoadingGif webPlayerActive={webPlayerActive} />
            
            {songs.length > 0 &&
                <SpotifyWebPlayer songs={songs} handleWebPlayerActive={handleWebPlayerActive} artistId={artistId} />
            }
            
            <GameDisplay currentSong={currentSong} webPlayerActive={webPlayerActive} score={score} 
                         GAME_TIMER={GAME_TIMER} pauseTimer={pauseTimer} token={token}
                         sleep={sleep} SLEEP_TIMER={SLEEP_TIMER} disableButtons={disableButtons} />

            <GameChoices gameChoices={gameChoices} webPlayerActive={webPlayerActive} handleGameButton={handleGameButton}
                         showAnswers={showAnswers} correctChoice={correctChoice} buttonsDisabled={buttonsDisabled} />
        </div>
    );
}
 
export default withRouter(GamePage);