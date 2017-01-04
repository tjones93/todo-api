var Sequalize = require("sequelize");
var sequelize = new Sequalize(undefined, undefined, undefined, {
    "dialect": "sqlite",
    "storage": __dirname + "/basic-sqlite-database.sqlite"

});

var Todo = sequelize.define("Todo", {
    description: {
        type: Sequalize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequalize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

sequelize.sync({
    //force: true
}).then(function () {
    console.log("Sync Complete.");


Todo.findById(5).then(function(todo){
    if (todo){
        console.log(todo.toJSON());
    }else{
        console.log("Naw bro");
    }
});

})

/*
    Todo.create({
        description: "Take out trash",
    }).then(function (todo) {
        return Todo.create({
            description: "Clean the office"
        });
    }).then(function(){
        //return Todo.findById(1)
        return Todo.findAll({
            where: {
                description: {
                    $like: "%OFFICE%"
                }
                
            }
        });
    }).then(function(todos){
        if (todos) {
            todos.forEach(function(todo){
                console.log(JSON.stringify(todo));
                console.log(todo.toJSON());
            });
            
        }else{
            console.log("No Todo found");
        }
    }).catch(function(e){
        console.log(e);
    })
})
}).then(function(){
    return Todo.findById(1);
}).then(function(todo){
    console.log(todo.toJSON());
}).catch(function(e){
    console.log(e);
})
*/