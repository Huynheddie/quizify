let AUTHZ_CREDENTIALS = {
    REDIRECT_URI: 'http://localhost:3000/login',
    BACKEND_REDIRECT_URI: 'http://localhost:3001/callback',
    SCOPES: ['user-read-private',
             'user-read-playback-state',
             'user-modify-playback-state',
             'streaming',
             'user-read-email',
            ]
};

module.exports = AUTHZ_CREDENTIALS;