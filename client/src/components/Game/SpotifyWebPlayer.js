import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback'

const SpotifyWebPlayer = ({ songs, token, handleCallback }) => {
    return ( 
        <div>
            { songs &&
                <div style={{display: "none"}}>
                    <SpotifyPlayer
                        autoPlay={true}
                        token={token}
                        uris={songs}
                        callback={handleCallback}
                    />
                </div>
            }
        </div>
     );
}
 
export default SpotifyWebPlayer;