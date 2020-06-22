import React, { useState } from 'react';
import Artists from './Artists';
import SpotifyWebApi from 'spotify-web-api-js';

const ArtistSearch = (props) => {
    const token = sessionStorage.getItem("access_token");
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const [searchTerm, setSearchTerm] = useState('ill');
    const [artists, setArtists] = useState([]);

    const handleSearchTerm = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        spotifyApi.search(searchTerm, ['artist'], { limit: 5}).then((response) => {
            setArtists(response.artists.items);
        })
    }
    
    return ( 
        <div>
            <form style={{marginBottom: "40px"}} onSubmit={handleSearchSubmit} >
                <input className="search-input"
                       placeholder="Enter an artist" 
                       value={searchTerm} 
                       onChange={handleSearchTerm}
                />
                {/* <button>Submit</button> */}
            </form>
            
            <Artists artists={artists} />
        </div>
    );
}
 
export default ArtistSearch;