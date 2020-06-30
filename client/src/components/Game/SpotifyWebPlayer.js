import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { withRouter } from 'react-router-dom';

const SpotifyWebPlayer = (props) => {

    const [player, setPlayer] = useState();
    const [playing, setPlaying] = useState(false);
    const [token, setToken] = useState();

    let playerCheckInterval = null;
    let spotifyApi = new SpotifyWebApi();    

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("access_token"));
        setToken(token);
    }, []);

    useEffect(() => {
        if (token) {
            playerCheckInterval = setInterval(() => checkForPlayer(), 1000);
            spotifyApi.setAccessToken(token);
        }
    }, [token]);

    useEffect(() => {
        if (player) {
            createEventHandlers();
            console.log(`Player`, player);
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
            console.log(data.device_id);
            await spotifyApi.transferMyPlayback([data.device_id]);      
            let currentPlayback = await spotifyApi.getMyCurrentPlaybackState();
            if (currentPlayback.device.is_restricted) {
                window.location.assign(`../play/${props.artistId}`);

            } else {
                await spotifyApi.play({device_id: data.device_id, uris: props.songs, position_ms: 35000});
                await spotifyApi.setVolume(50);
                props.handleWebPlayerActive(true);
            }
        }

        player.on('ready', startMusic);
    }

    const onStateChanged = (state) => {
        // console.log(state);
        if (state !== null) {
            setPlaying(!playing);
        }
    }

    return ( 
        <div>

        </div>
    );
}
 
export default withRouter(SpotifyWebPlayer);