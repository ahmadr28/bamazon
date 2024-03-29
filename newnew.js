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

// These are the action functions
function displayProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("=======================================================");
        console.log("ID\tProduct\t\tPrice\tQuantity");
        console.log("=======================================================");
        res.forEach(element => {
            //Trick to format so that columns are properly aligned
            let extraTab = element.product_name.length < 8 ? "\t\t" : "\t";
            console.log(
                `${element.item_id}\t${element.product_name}${extraTab}${element.price}\t${element.stock_quantity}`
            );
        });
        promptUser(res);
    });
}

function updateStock(id, quantity, sales) {
    console.log(id, quantity);
    connection.query(
        "UPDATE products SET stock_quantity = ?, productsales = ? WHERE item_id=?",
        [quantity, sales, id],
        function(err) {
            if (err) throw err;

            displayProducts();
        }
    );
}

function promptUser(stock) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "id",
                message: "Enter the ID of the product you want to buy:"
            },
            {
                type: "input",
                name: "quantity",
                message: "How many would you like to purchase?"
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
                console.log(`Your order is on the way!!`);
                console.log(`The total costs is ${amount}.`);

                updateStock(
                    parseInt(answer.id),
                    parseInt(stock[answer.id - 1].stock_quantity) - parseInt(answer.quantity),
                    newProductSales
                );
            } else {
                console.log("We don't have that item or enough of that item.  Please try again.");
                promptUser(stock);
            }
        });
}

//Main program
connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
});
