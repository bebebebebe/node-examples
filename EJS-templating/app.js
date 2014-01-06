var PORT = 3000;
var express = require("express");
var app = express();

app.use("/public",express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.render('welcome.ejs');
});

app.listen(PORT);