var Hapi   = require('hapi');
var Inert  = require('inert'); // serve static content
var Path   = require('path');
// var Basic   = require('hapi-auth-basic');
// var AuthJWT = require('hapi-auth-jwt2')
// var Joi     = require('joi');
// var lout    = require('lout');
// var ES      = require('esta');  // https://github.com/nelsonic/esta
var port   = process.env.PORT || 3000; // heroku define port or use 3000
var server = new Hapi.Server();

server.connection({ port: port });
console.log('Path:', Path.normalize(__dirname + '/../'));
// var routes = require('./routes.js');

server.register(Inert, function (err) {
  server.route( {
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: { path: Path.normalize(__dirname + '/../') }
      }
    });
  // server.route(routes);
});

server.start(function(){
  console.log('Now Visit: http://localhost:'+port);
});

module.exports = server;
