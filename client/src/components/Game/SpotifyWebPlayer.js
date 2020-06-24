import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback'

const SpotifyWebPlayer = ({ isPlaying, songs, token, handleCallback }) => {
    return ( 
        <div>
            { songs &&
                <div style={{display: "none"}}>
                    <SpotifyPlayer
                        autoPlay={true}
                        play={isPlaying}
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