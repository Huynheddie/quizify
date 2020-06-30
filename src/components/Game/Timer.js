import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';

const Timer = (props) => {
    const [time, setTime] = useState(props.seconds);
    const [timerInterval, setTimerInterval] = useState();
    let spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(props.token);

    useEffect(() => {
        setTimerInterval(setInterval(() => {
                setTime(seconds => seconds - 1);
            }, 1000)
        )
    }, []);

    useEffect(() => {
        if (time === 0) {
            clearInterval(timerInterval);
            console.log('Game ended!');
            props.history.push('/');
        }

        async function timerSleep() {
            if (props.pauseTimer) {
                clearInterval(timerInterval);
    
                await props.sleep(props.SLEEP_TIMER);
    
                setTimerInterval(setInterval(() => {
                        setTime(seconds => seconds - 1);
                    }, 1000)
                );
            }
        }
        timerSleep();
    }, [time]);


    useEffect(() => {
        return () => {
            clearInterval(timerInterval);
        }
    }, [timerInterval]);

    const formatTime = (time) => {
        let seconds = time % 60;
        let minutes = Math.floor(time / 60);

        minutes = minutes < 1 ? '00' : minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 1 ? '00' : seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${seconds}`
    }

    return ( 
        <div>
            <h1>{formatTime(time)}</h1>
        </div>
    );
}
 
export default withRouter(Timer);