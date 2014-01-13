var express = require('express')
  , app = express();

app.configure(function(){
    app.set('view engine', 'html');
    app.engine('html', require('hbs').__express);
});

app.use("/public",express.static(__dirname + "/public"));

    var data = {
        title: "Examples",
        body: "Hello World!"
    };

    var people = [
        {name: 'Alice'},
        {name: 'Bob'},
        {name: 'Carol'}
    ];

    var tableData = {
        rows: [ {
            letter: 'A',
            number: '1'
        }, {
            letter: 'B',
            number: '2',
        }, {
            letter: 'C',
            number: '3'
        }]
    };

app.get('/', function(req, res){
    res.render('index.html', data);
});

app.get('/list', function(req, res) {
    res.render('list.html', {items: people});
});

app.get('/table', function(req, res) {
    res.render('table.html', {rows: tableData.rows});
})

app.listen(3000);
console.log('Server running at port 3000');