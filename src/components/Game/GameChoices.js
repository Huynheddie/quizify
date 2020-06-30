import React, { Fragment } from 'react';

const GameChoices = (props) => {
    return ( 
        <Fragment>
            { props.gameChoices.length > 0 && props.webPlayerActive &&
                <div className="game-interface">
                    {
                        [0,1,2,3].map(index => <button key={index} disabled={props.buttonsDisabled} onClick={() => props.handleGameButton(index)} className={`game-btn ${props.showAnswers === true ? props.correctChoice === index ? 'game-btn-correct' : 'game-btn-incorrect' : '' }`}>{props.gameChoices[index].name}</button> )
                    }
                </div>
            }
        </Fragment>
     );
}
 
export default GameChoices;