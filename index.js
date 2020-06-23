let express = require('express')
let request = require('request')
let querystring = require('querystring')
let cors = require('cors');

let app = express()

app.use(cors());

app.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:3001/callback'

app.get('/login', function(req, res) {
  console.log(`Reached endpoint: ${req.url}`);
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-playback-state user-modify-playback-state streaming user-read-email',
      redirect_uri,
      show_dialog: 'true'
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64')),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000/login'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 3001
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)