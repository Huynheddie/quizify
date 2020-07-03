import React from 'react';
import blankArtist from '../../images/blank-artist.png'
import { Link } from "react-router-dom";

const ArtistPanels = ({ artists }) => {
    return ( 
        <div className="artist-grid">
            {artists.map((artist, index) => (
                <div className="artist-panel" key={index}>
                    <Link to={{
                        pathname: `/play/${encodeURIComponent(artist.id)}`,
                        state: {
                            artistSelection: artist
                        }
                    }}>
                        {artist && artist.images[0] && 
                            <img src={artist.images[0].url} alt="artist profile" width="200" height="200"/>
                        }
                        {artist && !artist.images[0] &&
                            <img src={blankArtist} alt="artist profile" width="200" height="200"/>
                        }
                    </Link>
                    <h2><a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">{artist.name}</a></h2>
                </div>
            ))}
        </div>
     );
}
 
export default ArtistPanels;