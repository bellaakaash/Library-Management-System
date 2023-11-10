/*
    Filename: dml.sql
    Author: Akaash Bella, Raahi Vaidya
    Date: August 10, 2023
    Language: SQL
    Description:
        This file contains SQL statements related to Data Manipulation Language (DML) operations 
        for the Library Management System's database. It provides commands for inserting, updating, 
        and deleting records across various tables. The SQL statements are parameterized with placeholders 
        to ensure dynamic and safe data operations.
*/

-- Add a new book entry
INSERT INTO Books (bookID, title, author, date, genre, description) VALUES (?, ?, ?, ?, ?, ?);

-- Add a new library card
INSERT INTO LibraryCards (name, address, contactInformation, issueDate, expirationDate) 
VALUES (?, ?, ?, ?, ?);

-- Add a new fine
INSERT INTO Fines (amount, date, cardID, fineStatus) VALUES (?, ?, ?, ?);

-- Add a new checkout
INSERT INTO Checkouts (cardID, bookID, checkoutDate, dueDate) VALUES (?, ?, ?, ?);

-- Update book description by bookID
UPDATE Books SET description = ? WHERE bookID = ?;

-- Update library card details by cardID
UPDATE LibraryCards SET 
  address = ?, 
  contactInformation = ?, 
  expirationDate = ?
WHERE cardID = ?;

-- Update fine details by fineID
UPDATE Fines SET date = ?, fineStatus = ? WHERE fineID = ?;

-- Update checkout details by checkoutID
UPDATE Checkouts SET returnDate = ? WHERE checkoutID = ?;

-- Delete a book by bookID
DELETE FROM Books WHERE bookID = ?;

-- Delete a library card by cardID
DELETE FROM LibraryCards WHERE cardID = ?;

-- Search for specific library card details by cardID
SELECT cardID, name, address, contactInformation, 
       DATE_FORMAT(issueDate, '%M %e, %Y') AS issueDate, 
       DATE_FORMAT(expirationDate, '%M %e, %Y') AS expirationDate 
FROM LibraryCards 
WHERE cardID = ?;

-- Search for specific book details by bookID
SELECT bookID, title, author, 
       DATE_FORMAT(date, '%M %e, %Y') AS date, 
       genre, description 
FROM Books 
WHERE bookID = ?;

-- Search for specific checkout details by checkoutID
SELECT checkoutID, cardID, bookID, 
       DATE_FORMAT(checkoutDate, '%W, %M %e, %Y') AS checkoutDate, 
       DATE_FORMAT(dueDate, '%W, %M %e, %Y') AS dueDate, 
       DATE_FORMAT(returnDate, '%W, %M %e, %Y') AS returnDate 
FROM Checkouts 
WHERE checkoutID = ?;

-- Search for specific fine details by fineID
SELECT fineID, 
       FORMAT(amount, 2) AS amount, 
       DATE_FORMAT(date, '%M %e, %Y') AS date, 
       cardID, fineStatus 
FROM Fines 
WHERE fineID = ?;

-- Search for books by genre
SELECT bookID, title, author, 
       DATE_FORMAT(date, '%M %e, %Y') AS date, 
       genre, description 
FROM Books 
WHERE genre = ?;

-- Search for fines by fineID or cardID
SELECT fineID, 
       FORMAT(amount, 2) AS amount, 
       DATE_FORMAT(date, '%M %e, %Y') AS date, 
       cardID, fineStatus 
FROM Fines 
WHERE fineID = ? OR cardID = ?;

-- Search for checkouts by checkoutID, cardID, or bookID
SELECT checkoutID, cardID, bookID, 
       DATE_FORMAT(checkoutDate, '%W, %M %e, %Y') AS checkoutDate, 
       DATE_FORMAT(dueDate, '%W, %M %e, %Y') AS dueDate, 
       DATE_FORMAT(returnDate, '%W, %M %e, %Y') AS returnDate 
FROM Checkouts 
WHERE checkoutID = ? OR cardID = ? OR bookID = ?;

-- Search for associations between library cards and books
SELECT * FROM Card_has_Books WHERE cardID = ? OR bookID = ?;