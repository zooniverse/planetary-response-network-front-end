var morgan     = require('morgan');
var path       = require('path');
var express    = require('express');
var webpack    = require('webpack');
var config     = require('./webpack.config');

var app = express();
var compiler = webpack(config);

app.use(morgan('combined'));

// Serve all other static assets
app.use(express.static(__dirname + '/public'))

// Start server
var port = process.env.PORT || 3737;
app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Server listening on port:', port);
});
