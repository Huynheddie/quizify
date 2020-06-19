import React from 'react';
import '../../css/Home.css';

const UserInfo = ({ user }) => {
    return ( 
        <div style={{margin: "40px 0px"}}>
            {user &&
                <div className="home-display">
                    <h1 className="user-name">{user.display_name}</h1>
                    <a href={user.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                        <img id="user-profile-pic" alt="user profile" src={user.images[0].url} width="250" height="250"/>
                    </a>
                </div>
            }
        </div>
     );
}
 
export default UserInfo;