import React, { Fragment } from 'react';
import Timer from './Timer';

const GameDisplay = (props) => {
    return ( 
        <Fragment>
            { props.currentSong && props.webPlayerActive && [
                <button key="quit" onClick={props.handleQuit}>Quit</button>,
                <button key="playagain" onClick={props.handlePlayAgain}>Play again</button>,
                <h1 key="score">Score: {props.score}</h1>,
                <h1 key="answer">Current song: {props.currentSong.song.name}</h1>,
                <Timer key="timer" seconds={props.GAME_TIMER} token={props.token} pauseTimer={props.pauseTimer} sleep={props.sleep} 
                                   SLEEP_TIMER={props.SLEEP_TIMER} score={props.score} handlePlayAgain={props.handlePlayAgain} 
                                   handleQuit={props.handleQuit} />,
                <img key="album-cover" className="album-cover" src={props.currentSong.song.album.images[0].url} alt="album" />            
            ]}  
        </Fragment>
    );
}
 
export default GameDisplay;