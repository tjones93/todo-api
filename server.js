var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
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
    var matchedTodo = _.findWhere(ToDos, {id: todoID});
    
        if (matchedTodo) {
            res.json(matchedTodo);
        } else {
            res.status(404).send();8
}
});

app.post("/todos", function (req, res) {
    var body = _.pick(req.body, "description", "completed");;

    
    console.log(body);
    if (!_.isString(body.description)|| !_.isBoolean(body.completed) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

  

    body.id = todoNextId;
    body.description = body.description.trim();
      
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