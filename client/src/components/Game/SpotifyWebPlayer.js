import React, { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback'
import SpotifyWebApi from 'spotify-web-api-js';

const SpotifyWebPlayer = ({ songs, token, handleCallback }) => {

    const [player, setPlayer] = useState();
    const [playing, setPlaying] = useState(false);

    let playerCheckInterval = null;
    let spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    useEffect(() => {
        playerCheckInterval = setInterval(() => checkForPlayer(), 1000);
    }, []);

    useEffect(() => {

        if (player) {
            createEventHandlers();
            console.log('Player:', player);
            player.connect();
        }
    }, [player]);

    const checkForPlayer = () => {
        console.log('Checking for player...');
        if (window.Spotify !== null) {
            clearInterval(playerCheckInterval);
            setPlayer(new window.Spotify.Player({
                name: "Spotify Web Player",
                getOAuthToken: cb => { cb(token); },
            }));
        }
    }

    const createEventHandlers = () => {
        player.on('initialization_error', e => { console.error(e); });
        player.on('authentication_error', e => {
            console.error(e);
        });
        player.on('account_error', e => { console.error(e); });
        player.on('playback_error', e => { console.error(e); });

        player.on('player_state_changed', state => { onStateChanged(state) });

        const startMusic = async (data) => {
            console.log('Let the music play!');
            await spotifyApi.transferMyPlayback([data.device_id], { play: true });
            await spotifyApi.play({uris: songs, position_ms: 35000});
            // await spotifyApi.seek(35000);
        }

        player.on('ready', startMusic);
    }

    const onStateChanged = (state) => {
        // console.log(state);
        if (state !== null) {
            setPlaying(!playing);
            // spotifyApi.seek(35000);
        }
    }

    return ( 
        <div>
            { songs &&
                <div style={{display: "none"}}>
                    {/* <SpotifyPlayer
                        autoPlay={true}
                        play={isPlaying}
                        token={token}
                        uris={songs}
                        callback={handleCallback}
                    /> */}
                </div>
            }
            <button onClick={()=>spotifyApi.skipToPrevious()}>Previous</button>
            <button onClick={()=>spotifyApi.skipToNext()}>Next</button>
        </div>
     );
}
 
export default SpotifyWebPlayer;