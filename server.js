var morgan     = require('morgan')
var path       = require('path')
var express    = require('express')
var webpack    = require('webpack')
var config     = require('./webpack.config')
var https      = require('https')
var fs         = require('fs')

var app = express()
var compiler = webpack(config)

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

var httpsServer = https.createServer(credentials, app)
httpsServer.listen(3443, function(error){
  if (error){
    console.log(error)
  } else {
    console.log('Server listening on port: 3443')
  }
})
