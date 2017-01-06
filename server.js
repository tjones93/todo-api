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
    var query = req.query;
    var where = {};


    if (query.hasOwnProperty("completed") && query.completed === "true") {
        where.completed = true;
    }
    if (query.hasOwnProperty("completed") && query.completed === "false") {
        where.completed = false;
    }
    if (query.hasOwnProperty("q") && query.q.length > 0) {
        where.description = {
            $like: "%" + query.q + "%"
        }
    }

    console.log({
        where: where
    });
    db.todo.findAll({
        where: where
    }).then(function (todo) {
        res.json(todo);
    }, function (e) {
        res.status(500).send();
    })

});

//get /todo/id

app.get("/todos/:id", function (req, res) {
    var todoID = parseInt(req.params.id, 10);

    console.log(todoID);
    db.todo.findById(todoID).then(function (todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send()
            console.log("Unable to find todo item.");
        }

    }, function (e) {
        res.status(500).send();
    })

});


app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});




app.delete("/todos/:id", function (req, res) {
    var todoID = parseInt(req.params.id, 10);

    db.todo.count({}).then(function (count) {
        db.todo.destroy({
            where: {
                id: todoID
            }
        }).catch(function (e) {
            res.status(500).send();
        })
        db.todo.count({}).then(function (secondCount) {
            if (count === secondCount + 1) {
                res.status(200).send();
                console.log("Delete Successful");
            } else if (count === secondCount) {
                res.status(404).send();
                console.log("Failed");
            }
        })
    })
});




/*var matchedTodo = _.findWhere(ToDos, {
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
}*/





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