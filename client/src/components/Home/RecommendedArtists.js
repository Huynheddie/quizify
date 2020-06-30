import React from 'react';
import { Link } from 'react-router-dom';
import blankArtist from '../../images/blank-artist.png'

const RecommendedArtists = (props) => {
    return ( 
        <div>
            <h1 style={{marginBottom: "20px"}}>Your Top Artists:</h1>
            <div className="artist-grid" style={{justifyContent: "space-evenly"}}>
                {props.topArtists.map((artist, index) => (
                    <div className="artist-panel" style={{flex: "none"}} key={index}>
                        <Link to={{
                            pathname: "/play",
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
        </div>
    );
}
 
export default RecommendedArtists;