const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/test', (req, res) => {
    console.log(`Request made to:`, req.url)
    res.send({test: "test"});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
