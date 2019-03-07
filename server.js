const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const scrapingRouter = require('./routes/scraping');
const app = express();
const port = process.env.PORT || 5000;
  

app.use('/api', apiRouter);
app.use('/scraping', scrapingRouter);




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => {console.log(`Listening on port ${port}`)});
