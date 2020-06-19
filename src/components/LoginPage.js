import React from 'react'
import logo from '../images/spotify.png';
import CREDENTIALS from '../utils/config';

const LoginPage = (props) => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const { CLIENT_ID, REDIRECT_URI } = CREDENTIALS;
    const scopes = [
        'user-read-private'
    ];

    const handleLogin = () => {
        window.location = `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    }

    return (
        <div className="login-page">
            <div className="banner">
            <h1 className="banner-text">Quizify</h1>
            <img style={{paddingLeft: "30px"}} alt="logo" src={logo} width="100" height="100"/> 
            </div>
            <button className="login-btn" type="login" onClick={handleLogin}>Login</button>
        </div>
    )
}

export default LoginPage;