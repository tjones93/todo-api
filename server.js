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
    id:3, 
    description: "Watch TV",
    completed: true
}];

app.get("/", function (req, res) {
    res.send("Todo API Root");
});

//GET /todos 
app.get("/todos", function(req,res){
    res.json(ToDos);
});
//get /todo/id
//app.get("/todo/:id", function(req,res){
//    res.json(ToDos(i));
//})

app.listen(port, function () {
    console.log('Express server started on port ' + port + '!');
});