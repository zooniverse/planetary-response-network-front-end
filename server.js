var morgan     = require('morgan')
var path       = require('path')
var express    = require('express')
var webpack    = require('webpack')
var wpConfig   = require('./webpack.config')
var https      = require('https')
var fs         = require('fs')
var config     = require('./src/config.js')
var url        = require('url')

var app = express()
var compiler = webpack(wpConfig)

app.use(morgan('combined'))

// Serve all other static assets
app.use(express.static(__dirname + '/public'))

// Handle all routes
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

var key = fs.readFileSync('server.key')
var cert = fs.readFileSync('server.crt')

var credentials = {
    key: key,
    cert: cert
};

var httpsServer = https.createServer(credentials, app);
var port = url.parse(config.client).port;
httpsServer.listen(port, function(error){
  if (error){
    console.log(error)
  } else {
    console.log('Server listening on port: %d', port)
  }
})
