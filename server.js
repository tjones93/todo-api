var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 3000;
var ToDos = [];
var todoNextId = 1;

app.use(bodyParser.json());


app.get("/", function (req, res) {
    res.send("Todo API Root");
});

//GET /todos 
app.get("/todos", function (req, res) {
    res.json(ToDos);
});

//get /todo/id

app.get("/todos/:id", function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo;

    // iterate over array
    ToDos.forEach(function (todo) {
        if (todoID === todo.id) {
            matchedTodo = todo;

        }

    });
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

app.post("/todos", function (req, res) {
    var body = req.body;
    body.id = todoNextId;
    ToDos.push(body);

    res.json(body);
    if (body) {
        console.log("Success")
    }
    todoNextId += 1;
});

app.listen(port, function () {
    console.log('Express server started on port ' + port + '!');
});