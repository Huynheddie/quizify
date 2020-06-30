import React, { Fragment } from 'react';

const LoadingGif = (props) => {
    return ( 
        <Fragment>
            { !props.webPlayerActive &&
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            }
        </Fragment>
        
    );
}
 
export default LoadingGif;