import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const Timer = (props) => {
    const [time, setTime] = useState(props.seconds);
    const [timerInterval, setTimerInterval] = useState();

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
    }, [time]);

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