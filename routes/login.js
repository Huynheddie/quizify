let express = require('express');
let request = require('request')
let querystring = require('querystring')
let router = express.Router();
let config = require('../util/config');

let redirect_uri = process.env.REDIRECT_URI || config.BACKEND_REDIRECT_URI;

router.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: config.SCOPES.join(','),
        redirect_uri,
        // show_dialog: 'true'
    }))
})
  
router.get('/callback', function(req, res) {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      // console.log(response)
      var access_token = body.access_token
      let uri = process.env.FRONTEND_URI || config.REDIRECT_URI
      res.redirect(uri + '?access_token=' + access_token)
    })
})


module.exports = router;