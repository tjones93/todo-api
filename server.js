"use strict"
var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require('./db.js');

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
    var queryParams = req.query;
    var filteredToDos = ToDos;
    // if has property and compled === true 
    //call filtered = _.where (,?)
    if (queryParams.hasOwnProperty("completed") && queryParams.completed === "true") {
        filteredToDos = _.where(filteredToDos, {
            completed: true
        })
    } else if (queryParams.hasOwnProperty("completed") && queryParams.completed === "false") {
        filteredToDos = _.where(filteredToDos, {
            completed: false
        })
    }

    if (queryParams.hasOwnProperty("q") && queryParams.q.length > 0) {
        filteredToDos = _.filter(filteredToDos, function (todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;

        })
    }

    res.json(filteredToDos);
});

//get /todo/id

app.get("/todos/:id", function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(ToDos, {
        id: todoID
    });


    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
        8
    }
});

app.post("/todos", function (req, res) {
    var body = _.pick(req.body, "description", "completed");;

    var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});

    /*if (!_.isString(body.description) || !_.isBoolean(body.completed) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.id = todoNextId;
    body.description = body.description.trim();

    ToDos.push(body);

    res.json(body);
    if (body) {
        console.log("Success! ID " + body.id + " was created.");

    }
    todoNextId += 1; */
});

// delete id based on number 
app.delete("/todos/:id", function (req, res) {
    var length = 0
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(ToDos, {
        id: todoID
    });
    // var body = req.body
    if (matchedTodo) {
        length = ToDos.length
        ToDos = _.without(ToDos, matchedTodo);

        if (ToDos.length === length - 1) {

            res.json("Success! ID " + todoID + " was deleted");
            console.log("Success! ID " + todoID + " was deleted");
        } else {
            res.json("Failed!");
        }
    } else {
        res.json("Failed! Unable to find ID " + todoID + ".");
        console.log("Failed! Unable to find ID " + todoID + ".")
    }
});

app.put("/todos/:id", function (req, res) {
    var body = _.pick(req.body, "description", "completed");
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(ToDos, {
        id: todoID
    });
    var initialDescription = matchedTodo.description;
    var initialCompletion = matchedTodo.completed;
    var validAttributes = {};
    if (!matchedTodo) {
        return res.status(400).send()
    }
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    //Here

    _.extend(matchedTodo, validAttributes);

    if (initialDescription != body.description && initialCompletion != body.completed) {
        res.json("Success: the description field was updated to: \"" + validAttributes.description + "\" and the completion field was updated to: \"" + validAttributes.completed + "\"");
        console.log("Success: the description field was updated to: \"" + validAttributes.description + "\"  and the completion field was updated to: \"" + validAttributes.completed + "\"");
    } else if (initialDescription != body.description) {
        res.json("Success: the description field was updated to: \"" + validAttributes.description + "\" ");
        console.log("Success: the description field was updated to: \"" + validAttributes.description + "\" ");
    } else if (initialCompletion != body.completed) {
        res.json("Success: the completion field was updated to: \"" + validAttributes.completed + "\"");
        console.log("Success: the completion field was updated to: \"" + validAttributes.completed + "\"");
    }


});

db.sequelize.sync().then(function () {
    console.log("Sync Complete.")
    app.listen(port, function () {
        console.log('Express server started on port ' + port + '!');
    });
});