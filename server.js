var express = require("express");
var app = express();

var port = process.env.PORT || 3000;

var ToDos = [{
    id: 1,
    description: "Meet mom for lunch",
    completed: false
}, {
    id: 2,
    description: "Go to Market",
    completed: false
}, {
    id: 3,
    description: "Watch TV",
    completed: true
}];

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
    } else{
        res.status(404).send();
}
});

app.listen(port, function () {
    console.log('Express server started on port ' + port + '!');
});