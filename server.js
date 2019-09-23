const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const scrapingRouter = require('./routes/scraping');
const filesRouter = require('./routes/files');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

console.log(JSON.parse(process.env.FIREBASE_KEY));


const cors = require('cors')

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.static('public'))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);
app.use('/scraping', scrapingRouter);
app.use('/files', filesRouter);



if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => {console.log(`Listening on port ${port}`)});
