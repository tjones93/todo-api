var Sequalize = require("sequelize");
var sequelize = new Sequalize(undefined, undefined, undefined, {
    "dialect": "sqlite",
    "storage": __dirname + "/basic-sqlite-database.sqlite"

});

var Todo = sequelize.define("todo", {
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
    force: false
}).then(function () {
    console.log("Sync Complete.");

    Todo.create({
        description: "Take out trash",
        //completed: false
    }).then(function (Todo) {
        console.log("Finished");
        console.log(Todo);
    }).catch(function(e){
        console.log(e);
    })
})