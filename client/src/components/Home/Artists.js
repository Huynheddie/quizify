import React from 'react';
import blankArtist from '../../images/blank-artist.png'
import { Link } from "react-router-dom";

const Artists = ({ artists }) => {
    return ( 
        <div className="artist-grid">
            {artists.map((artist, index) => (
                <div className="artist-panel" key={index}>
                    <Link to={{
                        pathname: "/play",
                        state: {
                            artistSelection: artist
                        }
                    }}>
                        {artist && artist.images[0] && 
                            <img src={artist.images[0].url} alt="artist profile" width="300" height="300"/>
                        }
                        {artist && !artist.images[0] &&
                            <img src={blankArtist} alt="artist profile" width="300" height="300"/>
                        }
                    </Link>
                    <h1><a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">{artist.name}</a></h1>
                </div>
            ))}
        </div>
     );
}
 
export default Artists;