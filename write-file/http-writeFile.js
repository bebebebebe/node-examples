var http = require("http");
var url = require("url");
var fs = require("fs");
var counter = 0;


http.createServer(function (request, response) {

    response.setHeader( 'Content-Type', 'text/html; charset=UTF-8' );

    response.write('<html><h1>Hi.</h1></html>');

    var _get = url.parse(request.url, true).query;

    response.end('Hello. <b>You input:</b> ' + _get['data']);

    console.log('url: ' + request.url);
    
    if (request.url !== '/favicon.ico') {
      counter = counter + 1;
      console.log('page requested');
      fs.writeFile('file.txt', counter);
    } 
    


}).listen(8080);

console.log('Server running on port 8080')
