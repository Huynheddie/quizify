let express = require('express')
let cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3001;

let app = express()

app.use(cors());
app.use(require('./util/middleware'));
app.use(require('./routes/login'));

app.listen(port, () => console.log(`Listening on port ${port}`));