// Module dependencies
 
var express    = require('express'),
    mysql      = require('mysql');

var app = express();

app.configure(function(){
    app.set('view engine', 'html');
    app.engine('html', require('hbs').__express);
});
 
// Application initialization
 
var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : ''
    });
    
//var app = module.exports = express();
 
// Database setup
 
connection.query('CREATE DATABASE IF NOT EXISTS test', function (err) {
    if (err) throw err;
    connection.query('USE test', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS users('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'name VARCHAR(30),'
            + 'admin BIT(1),'
            + 'since DATETIME'
            +  ')', function (err) {
                if (err) throw err;
            });
        connection.query('CREATE TABLE IF NOT EXISTS tasks('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'user_id INT,'
            + 'title VARCHAR(30),'
            + 'description TEXT,'
            + 'done BOOL'
            + ')', function(err) {
                if (err) throw err;
            });
    });

    console.log('connection.query called');
});
 
// Configuration
 
app.use(express.bodyParser());
 


app.get('/u/:name', function(req, res) {
    var username = req.params.name;
    connection.query('SELECT id from test.users WHERE ?', {'name': username}, function(err, result) {
        if (err) throw err; 
        if (result.length > 0) {
            res.render('userTODO.html', {'name': username, 'id': result[0].id});
        } else {
            res.render('index.html');
    }
})
    
    
})  
 
app.get('/', function(req, res) {
    res.render('index.html');
});



// date

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

// Update MySQL database

app.post('/users', function (req, res) {
    var date = new Date().toMysqlFormat();
    connection.query('INSERT INTO users SET ?', {'name': req.body.name, 'admin': 1, 'since': date}, 
        function (err, result) {
            if (err) throw err;
            res.send('User added to database with ID: ' + result.insertId);
        }
    );
});

app.post('/add_task', function (req, res) {
    console.log('/add_task called');
    console.log(req.body);
    var queryParams = {'title': req.body.task_name, 
                        'description': req.body.task_description,
                        'user_id': req.body.user_id,
                        'done': 0
                    };
    connection.query('INSERT INTO tasks SET ?', queryParams,
        function (err, result) {
            if (err) throw err;
            res.send("You've added the task '" + queryParams.title + "'!");
            console.log(result);
        }
    );

});
 
app.listen(3000);
console.log('server started on port 3000');
