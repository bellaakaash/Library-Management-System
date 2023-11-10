/**
 * Filename: app.js
 * Author: Akaash Bella, Raahi Vaidya
 * Date: August 10, 2023
 * Language: JavaScript (Node.js with Express.js framework)
 * Description: 
 *   This file sets up a basic web application using the Express.js framework.
 *   It initializes the express application, sets up necessary middlewares for
 *   JSON parsing, URL encoding, and serving static files. It also has some 
 *   configuration for connecting to a database, in the db-connector.js file.
 *   
 *   The server listens on port 4489, which can be easily changed at the top of the
 *   file.
 */

/****************
| WEB APP SETUP |
****************/

// Express
var express = require('express');                 // We are using the express library for the web server
var app = express();                              // We need to instantiate an express object to interact with the server in our code

// Setup
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Port
PORT = 4489;                                      // Set a port number at the top so it's easy to change in the future

// Database connector
var db = require('./database/db-connector');
app.use(express.static(__dirname + '/public'));

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');       // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));    // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                   // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*********
| ROUTES |
**********/

/**************************************
| GET ROUTES [FOR WEBPAGE NAVIGATION] |
**************************************/

// Default route to render the homepage
app.get('/', (req, res) => {
    res.render('index');
});

// Route to fetch and display library card details
app.get('/libraryCards', function(req, res) {  
    // Define the query to fetch library card details with formatted dates
    let query = `
        SELECT cardID, name, address, contactInformation,
               DATE_FORMAT(issueDate, '%M %e, %Y') AS issueDate,
               DATE_FORMAT(expirationDate, '%M %e, %Y') AS expirationDate 
        FROM LibraryCards;
    `;

    // Execute the query
    db.pool.query(query, function(error, rows, fields) {
        // Render the libraryCards.hbs template with the fetched data
        res.render('libraryCards', { data: rows });
    });
});

// Route to fetch and display book details
app.get('/books', function(req, res) {  
    // Define the query to fetch book details with formatted dates
    let query = `
        SELECT bookID, title, author,
               DATE_FORMAT(date, '%M %e, %Y') AS date,
               genre, description 
        FROM Books;
    `;

    // Execute the query
    db.pool.query(query, function(error, rows, fields) {
        // Render the books.hbs template with the fetched data
        res.render('books', { data: rows });
    });
});   

// Route to fetch and display checkout details
app.get('/checkouts', function(req, res) {  
    // Define the query to fetch checkout details with formatted dates
    let query = `
        SELECT checkoutID, cardID, bookID,
               DATE_FORMAT(checkoutDate, '%W, %M %e, %Y') AS checkoutDate,
               DATE_FORMAT(dueDate, '%W, %M %e, %Y') AS dueDate,
               DATE_FORMAT(returnDate, '%W, %M %e, %Y') AS returnDate 
        FROM Checkouts;
    `;

    // Execute the query
    db.pool.query(query, function(error, rows, fields) {
        // Render the checkouts.hbs template with the fetched data
        res.render('checkouts', { data: rows });
    });
});

// Route to fetch and display fine details
app.get('/fines', function(req, res) {  
    // Define the query to fetch fine details with formatted amount and dates
    let query = `
        SELECT fineID,
               FORMAT(amount, 2) AS amount,
               DATE_FORMAT(date, '%M %e, %Y') AS date,
               cardID, fineStatus 
        FROM Fines;
    `;

    // Execute the query
    db.pool.query(query, function(error, rows, fields) {
        // Render the fines.hbs template with the fetched data
        res.render('fines', { data: rows });
    });
});

// Route to fetch and display the association of cards and books
app.get('/cardHasBooks', function(req, res) {  
    // Define the query to fetch card and book associations
    let query = "SELECT * FROM Card_has_Books;";

    // Execute the query
    db.pool.query(query, function(error, rows, fields) {
        // Render the cardHasBooks.hbs template with the fetched data
        res.render('cardHasBooks', {data: rows});
    });
});

/*********************************
| BOOK ROUTES [FOR BOOK WEBPAGE] |
*********************************/

// Route to add a new book to the database
app.post('/add-book', function(req, res) {
    let data = req.body;

    let bookID = data['input-book-id'];
    let title = data['input-title'];
    let author = data['input-author'];
    let date = data['input-date'];
    let genre = data['input-genre'] || null;  // Set to NULL if not provided
    let description = data['input-description'] || null;  // Set to NULL if not provided

    // SQL query to insert the new book details into the 'Books' table
    let addQuery = `
        INSERT INTO Books (bookID, title, author, date, genre, description) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Execute the query
    db.pool.query(addQuery, [bookID, title, author, date, genre, description], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);  // Send a 'Bad Request' status if there's an error
        } else {
            res.redirect('/books');  // Redirect to the books page upon successful insertion
        }
    });
});

// Route to update the description of a book
app.post('/update-book', function(req, res) {
    let data = req.body;
    let bookID = data['book-id-update'];
    let updateDescription = data['update-description'];

    // SQL query to update the description of a book in the 'Books' table
    let updateQuery = `
        UPDATE Books 
        SET description = ? 
        WHERE bookID = ?
    `;

    // Execute the query
    db.pool.query(updateQuery, [updateDescription, bookID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/books');
        }
    });
});

// Route to search for books based on genre
app.get('/search-book', function(req, res) {
    let genre = req.query['search-genre'];

    // SQL query to fetch book details based on the provided genre
    let searchQuery = `
        SELECT bookID, title, author, 
               DATE_FORMAT(date, '%M %e, %Y') AS date, 
               genre, description 
        FROM Books 
        WHERE genre = ?
    `;

    // Execute the query
    db.pool.query(searchQuery, [genre], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('books', { data: rows });  // Render the books page with the fetched data
        }
    });
});

// Route to delete a book from the database
app.post('/delete-book', function(req, res) {
    let bookID = req.body['book-id'];

    // SQL query to delete a book from the 'Books' table based on the provided bookID
    let deleteQuery = `
        DELETE FROM Books 
        WHERE bookID = ?
    `;

    // Execute the query
    db.pool.query(deleteQuery, [bookID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/books');
        }
    });
});

/*************************************************
| LIBRARY CARD ROUTES [FOR LIBRARY CARD WEBPAGE] |
*************************************************/

// Route to add a new library card to the database
app.post('/add-library-card-form', function(req, res){
    let data = req.body;

    // SQL query to insert the new library card details into the 'LibraryCards' table
    let insertQuery = `
        INSERT INTO LibraryCards (name, address, contactInformation, issueDate, expirationDate) 
        VALUES (?, ?, ?, ?, ?)
    `;

    // Execute the query
    db.pool.query(insertQuery, [data['input-name'], data['input-address'], data['input-contact'], data['input-issue-date'], data['input-expiration-date']], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);  // Send a 'Bad Request' status if there's an error
        } else {
            res.redirect('/libraryCards');  // Redirect to the library cards page upon successful insertion
        }
    });
});

// Route to delete a library card from the database
app.post('/delete-libraryCard/', function(req, res) {
    let cardID = req.body['card-id'];

    // SQL query to delete a library card from the 'LibraryCards' table based on the provided cardID
    let deleteQuery = `
        DELETE FROM LibraryCards 
        WHERE cardID = ?
    `;

    // Execute the query
    db.pool.query(deleteQuery, [cardID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/libraryCards');
        }
    });
});

// Route to update the details of a library card
app.post('/update-libraryCard/', function(req, res) {
    let data = req.body;
    let cardID = data['card-id-update'];
    let updateAddress = data['update-address'];
    let updateContact = data['update-contact'];
    let updateExpirationDate = data['update-expiration-date'];

    // SQL query to update the details of a library card in the 'LibraryCards' table
    let updateQuery = `
        UPDATE LibraryCards 
        SET address = ?, 
            contactInformation = ?, 
            expirationDate = ? 
        WHERE cardID = ?
    `;

    // Execute the query
    db.pool.query(updateQuery, [updateAddress, updateContact, updateExpirationDate, cardID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/libraryCards');
        }
    });
});

// Route to search for a library card based on its cardID
app.post('/search-libraryCard/', function(req, res) {
    let cardID = req.body['search-card-id'];

    // SQL query to fetch library card details based on the provided cardID
    let searchQuery = `
        SELECT cardID, name, address, contactInformation, 
               DATE_FORMAT(issueDate, '%M %e, %Y') AS issueDate, 
               DATE_FORMAT(expirationDate, '%M %e, %Y') AS expirationDate 
        FROM LibraryCards 
        WHERE cardID = ?
    `;

    // Execute the query
    db.pool.query(searchQuery, [cardID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Render the `libraryCards.hbs` template with the searched result
            res.render('libraryCards', { data: rows });
        }
    });
});

/*********************************
| FINE ROUTES [FOR FINE WEBPAGE] |
**********************************/

// Route to add a new fine to the database
app.post('/add-fine/', function(req, res) {
    let amount = req.body['input-amount'];
    let date = req.body['input-date'];
    let cardID = req.body['input-card-id'];
    let status = req.body['input-status'];

    // SQL query to insert the new fine details into the 'Fines' table
    let insertQuery = `
        INSERT INTO Fines (amount, date, cardID, fineStatus) 
        VALUES (?, ?, ?, ?)
    `;

    // Execute the query
    db.pool.query(insertQuery, [amount, date, cardID, status], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);  // Send a 'Bad Request' status if there's an error
        } else {
            res.redirect('/fines');  // Redirect to the fines page upon successful insertion
        }
    });
});

// Route to update the status of a fine
app.post('/update-fine', function(req, res) {
    let fineID = req.body['fine-id-update'];
    let newFineStatus = req.body['update-fine-status'];

    // SQL query to update the status of a fine in the 'Fines' table
    let updateQuery = `
        UPDATE Fines 
        SET fineStatus = ? 
        WHERE fineID = ?
    `;

    // Execute the query
    db.pool.query(updateQuery, [newFineStatus, fineID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/fines');
        }
    });
});

// Route to search for fines based on fineID or cardID
app.post('/search-fine/', function(req, res) {
    let fineID = req.body['search-fine-id'];
    let cardID = req.body['search-card-id'];
    let searchQuery;

    if(fineID) {
        // SQL query to fetch fine details based on the provided fineID
        searchQuery = `
            SELECT fineID, 
                   FORMAT(amount, 2) AS amount, 
                   DATE_FORMAT(date, '%M %e, %Y') AS date, 
                   cardID, fineStatus 
            FROM Fines 
            WHERE fineID = ?
        `;

        // Execute the query
        db.pool.query(searchQuery, [fineID], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                // Render the `fines.hbs` template with the searched result
                res.render('fines', {data: rows});
            }
        });
    } else if (cardID) {
        // SQL query to fetch fine details based on the provided cardID
        searchQuery = `
            SELECT fineID, 
                   FORMAT(amount, 2) AS amount, 
                   DATE_FORMAT(date, '%M %e, %Y') AS date, 
                   cardID, fineStatus 
            FROM Fines 
            WHERE cardID = ?
        `;

        // Execute the query
        db.pool.query(searchQuery, [cardID], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                // Render the `fines.hbs` template with the searched result
                res.render('fines', {data: rows});
            }
        });
    } else {
        // If neither fineID nor cardID were provided, redirect to the fines page
        res.redirect('/fines');
    }
});

/*******************************************
| CHECKOUTS ROUTES [FOR CHECKOUTS WEBPAGE] |
*******************************************/

// Route to add a new checkout entry to the database
app.post('/add-checkout', function(req, res) {
    let cardID = req.body['input-card-id'];
    let bookID = req.body['input-book-id'];
    let checkoutDate = req.body['input-checkout-date'];
    let dueDate = req.body['input-due-date'];

    // SQL query to insert the new checkout details into the 'Checkouts' table
    let insertQuery = `
        INSERT INTO Checkouts (cardID, bookID, checkoutDate, dueDate) 
        VALUES (?, ?, ?, ?)
    `;

    // Execute the query
    db.pool.query(insertQuery, [cardID, bookID, checkoutDate, dueDate], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);  // Send a 'Bad Request' status if there's an error
        } else {
            res.redirect('/checkouts');  // Redirect to the checkouts page upon successful insertion
        }
    });
});

// Route to update the return date of a checkout entry
app.post('/update-checkout', function(req, res) {
    let checkoutID = req.body['checkout-id-update'];
    let returnDate = req.body['update-return-date'];

    // SQL query to update the return date of a checkout in the 'Checkouts' table
    let updateQuery = `
        UPDATE Checkouts 
        SET returnDate = ? 
        WHERE checkoutID = ?
    `;

    // Execute the query
    db.pool.query(updateQuery, [returnDate, checkoutID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/checkouts');
        }
    });
});

// Route to search for checkout entries based on checkoutID, cardID, or bookID
app.get('/search-checkouts', function(req, res) {
    let checkoutID = req.query['search-checkout-id'];
    let cardID = req.query['search-card-id'];
    let bookID = req.query['search-book-id'];

    // SQL query to fetch checkout details based on the provided checkoutID, cardID, or bookID
    let searchQuery = `
        SELECT checkoutID, cardID, bookID, 
               DATE_FORMAT(checkoutDate, '%W, %M %e, %Y') AS checkoutDate, 
               DATE_FORMAT(dueDate, '%W, %M %e, %Y') AS dueDate, 
               DATE_FORMAT(returnDate, '%W, %M %e, %Y') AS returnDate 
        FROM Checkouts 
        WHERE checkoutID = ? or cardID = ? or bookID = ?
    `;

    // Execute the query
    db.pool.query(searchQuery, [checkoutID, cardID, bookID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Render the `checkouts.hbs` template with the searched result
            res.render('checkouts', { data: rows });
        }
    });
});

/*****************************************************
| CARD-HAS-BOOKS ROUTES [FOR CARD-HAS-BOOKS WEBPAGE] |
*****************************************************/

// Route to search associations between cards and books based on cardID or bookID
app.get('/search-card-book', function(req, res) {
    let cardID = req.query['search-card-id'];
    let bookID = req.query['search-book-id'];

    // SQL query to fetch associations from the 'Card_has_Books' table based on the provided cardID or bookID
    let searchQuery = `
        SELECT * 
        FROM Card_has_Books 
        WHERE cardID = ? OR bookID = ?
    `;

    // Execute the query
    db.pool.query(searchQuery, [cardID, bookID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);  // Send a 'Bad Request' status if there's an error
        } else {
            // Render the `cardHasBooks.hbs` template with the searched result
            res.render('cardHasBooks', { data: rows });
        }
    });
});

/***********
| LISTENER |
***********/

// Receives incoming requests on the specified PORT
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});