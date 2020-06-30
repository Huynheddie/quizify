import React from 'react'
import logo from '../../images/spotify.png';

const LoginPage = (props) => {

    const handleLogin = () => {
        window.location = 'http://localhost:3001/login';
    }

    return (
        <div className="login-page">
            <div className="banner">
                <h1 className="banner-text">Quizify</h1>
                <img style={{paddingLeft: "30px"}} alt="logo" src={logo} width="100" height="100"/> 
            </div>
            <button className="login-btn" type="login" onClick={handleLogin}>Login with Spotify</button>
        </div>
    )
}

export default LoginPage;