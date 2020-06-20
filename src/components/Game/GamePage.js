import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const GamePage = (props) => {
    const token = sessionStorage.getItem("access_token");
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const [songs, setSongs] = useState([]);    
    const [currentSong, setCurrentSong] = useState();
    
    useEffect(() => {
        const artist = props.location.state.artistSelection;

        async function getSongs() {
            let albums = await spotifyApi.getArtistAlbums(artist.id, { limit: 5 });
            let allSongs = [];

            for (const album of albums.items) {
                const albumTracks = await spotifyApi.getAlbumTracks(album.id);
                
                for (const track of albumTracks.items) {
                    allSongs.push(track);
                }
            }
            setSongs(shuffleSongs(allSongs));
        }

        getSongs();

    }, []);

    useEffect(() => {
        console.log(songs);
        if (songs.length) {
            async function startPlayer() {
                spotifyApi.play({uris: (songs.map(song => song.uri))});
                setCurrentSong({ song: songs[0], index: 0});
            }

            startPlayer();
        }
    }, [songs]);

    const shuffleSongs = (songs) => {
        for (let i = songs.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            let temp = songs[i];
            songs[i] = songs[j];
            songs[j] = temp;
        }
        return songs;
    }

    const handleNextSong = (event) => {
        spotifyApi.skipToNext();
        if (currentSong.index >= songs.length - 1) {
            setCurrentSong({song: songs[0], index: 0})
        } else {
            setCurrentSong({song: songs[currentSong.index + 1], index: currentSong.index + 1});
        }
    }

    const handlePreviousSong = (event) => {
        spotifyApi.skipToPrevious();
        if (currentSong.index == 0) {
            setCurrentSong({song: songs[songs.length - 1], index: songs.length - 1})
        } else {
            setCurrentSong({song: songs[currentSong.index - 1], index: currentSong.index - 1});
        }
    }

    return ( 
        <div style={{color: "white", fontFamily: "Montserrat"}}>
            <button onClick={handlePreviousSong}>Previous</button>
            <button onClick={handleNextSong}>Next</button>
            {currentSong &&
                <h1>Current song: {currentSong.song.name}</h1>
            }
            {songs.map((song, index) => (<h3 key={index}>{song.name}</h3>))}
        </div>
    );
}
 
export default GamePage;