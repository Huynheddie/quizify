let AUTHZ_CREDENTIALS = {
    REDIRECT_URI: 'http://localhost:3000/',
    BACKEND_REDIRECT_URI: 'http://localhost:3001/callback',
    SCOPES: ['user-read-private',
             'user-read-playback-state',
             'user-modify-playback-state',
             'streaming',
             'user-read-email',
             'user-top-read',
            ]
};

module.exports = AUTHZ_CREDENTIALS;