var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
});
connection.query("select * from products", function(err, res) {
    console.table(res);
    start();
    // connection.end();
});

start = stock => {
    inquirer
        .prompt([
            {
                name: "id",
                type: "prompt",
                message: "What is the ID of the item you wanna buy?"
            },
            {
                name: "quantity",
                type: "prompt",
                message: "How many of this item would you like to buy?"
            }
        ])
        .then(function(answer) {
            if (
                answer.id >= 1 &&
                answer.id <= 10 &&
                answer.quantity >= 1 &&
                answer.quantity <= stock[answer.id - 1].stock_quantity
            ) {
                let amount = parseFloat(answer.quantity) * parseFloat(stock[answer.id - 1].price);
                let newProductSales = stock[answer.id - 1].productsales + amount;

                console.log(`The total costs is ${amount}.`);

                updateStock(
                    parseInt(answer.id),
                    parseInt(stock[answer.id - 1].stock_quantity) - parseInt(answer.quantity),
                    newProductSales
                );
                console.log("Your order is on the way !");
            } else {
                console.log("We don't have that item or enough of that item.  Please try again.");
                start(stock);
            }
        });
};

// if (answer.id >= 1 && answer.id <= 10) {
//     console.log("We have your item!");
//     console.log("Your Order is on its way!");
// } else if (answer.quantity >= 1 && answer.quantity <= item_id.stock_quantity) {
//     console.log("We dont have enough of that item :(");
// } else {
//     console.log("try again");
// }
// });
