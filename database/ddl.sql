/*
    Filename: ddl.sql
    Author: Akaash Bella, Raahi Vaidya
    Date: August 10, 2023
    Language: SQL
    Description:
        This file contains SQL statements related to Data Definition Language (DDL) operations 
        for the Library Management System's database. It defines tables, constraints, and provides 
        initial data insertion commands. The file helps in setting up the database schema and initial structure.
*/

SET FOREIGN_KEY_CHECKS = 0;

-- Creating the MemberCards table with appropriate columns and constraints
CREATE OR REPLACE TABLE LibraryCards (
  -- Primary Key cardID with auto-increment feature
  cardID INT PRIMARY KEY AUTO_INCREMENT,
  -- Member related information fields
  name VARCHAR(50) NOT NULL,
  address VARCHAR(100) NOT NULL,
  contactInformation VARCHAR(50) NOT NULL,
  -- Issue and expiration date fields for the card
  issueDate DATE NOT NULL,
  expirationDate DATE NOT NULL
);

-- Inserting initial data into the LibraryCards table
INSERT INTO LibraryCards (name, address, contactInformation, issueDate, expirationDate) VALUES
('John Doe', '123 Main St, Portland, OR 97201', 'john.doe@email.com', '2022-01-01', '2025-01-01'),
('Jane Smith', '456 Oak Ave, Portland, OR 97202', 'jane.smith@email.com', '2022-04-04', '2025-04-04'),
('Mike Johnson', '789 Elm St, Portland, OR 97203', 'mike.johnson@email.com', '2023-03-17', '2026-03-17'),
('Sarah Miller', '111 Pine Rd, Portland, OR 97204', 'sarah.miller@email.com', '2023-02-05', '2026-02-05'),
('Brian Lee', '222 Birch Ln, Portland, OR 97205', 'brian.lee@email.com', '2023-05-10', '2026-05-10'),
('Emily Davis', '333 Cedar Blvd, Portland, OR 97206', 'emily.davis@email.com', '2022-06-20', '2025-06-20'),
('Robert Wilson', '444 Maple Dr, Portland, OR 97207', 'robert.wilson@email.com', '2023-07-15', '2026-07-15'),
('Amanda Taylor', '555 Walnut Ct, Portland, OR 97208', 'amanda.taylor@email.com', '2022-08-25', '2025-08-25'),
('James White', '666 Spruce Way, Portland, OR 97209', 'james.white@email.com', '2023-10-12', '2026-10-12'),
('Anna Brown', '777 Fir Ter, Portland, OR 97210', 'anna.brown@email.com', '2022-12-05', '2025-12-05');


-- Creating the Books table with appropriate columns and constraints
CREATE OR REPLACE TABLE Books (
  -- Primary Key bookID
  bookID VARCHAR(50) PRIMARY KEY,
  -- Book related information fields
  title VARCHAR(100) NOT NULL,
  author VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  genre VARCHAR(50),
  description TEXT
);

-- Inserting initial data into the Books table
INSERT INTO Books (bookID, title, author, date, genre, description) VALUES
('TLT', 'The Lightning Thief', 'Rick Riordan', '2005-06-28', 'Fantasy', 'A fantasy novel based on Greek mythology. It follows the adventures of Percy Jackson as he discovers that he is a demigod, the son of Poseidon.'),
('ITA', 'Into Thin Air', 'Jon Krakauer', '1997-05-06', 'Non-Fiction', 'A non-fiction book that chronicles the disastrous 1996 Mount Everest expedition. Jon Krakauer, a journalist and mountaineer, provides a firsthand account of the events that unfolded.'),
('BAC', 'Born a Crime', 'Trevor Noah', '2016-11-15', 'Autobiography', 'An autobiography by Trevor Noah, it details his experiences growing up in South Africa during apartheid and explores themes of identity, race, and resilience.'),
('TGG', 'The Great Gatsby', 'F. Scott Fitzgerald', '1925-09-10', 'Classic', 'The Great Gatsby is a classic novel set in the Jazz Age of the 1920s. It explores themes of wealth, love, and the American Dream.'),
('TKAM', 'To Kill a Mockingbird', 'Harper Lee', '1960-07-11', 'Fiction', 'To Kill a Mockingbird is a powerful novel that addresses racial injustice and moral growth in the 1930s American South.'),
('HPSS', 'Harry Potter and the Sorcerers Stone', 'J.K. Rowling', '1997-06-26', 'Fantasy', 'The first book in the Harry Potter series, it introduces readers to the young wizard and his adventures at Hogwarts School of Witchcraft and Wizardry.'),
('HG', 'The Hunger Games', 'Suzanne Collins', '2008-09-14', 'Dystopian', 'The first book in The Hunger Games trilogy, it introduces readers to Katniss Everdeen, a girl who volunteers to participate in a deadly televised game in a dystopian future.'),
('GD', 'Good Omens', 'Neil Gaiman & Terry Pratchett', '1990-05-01', 'Fantasy', 'A comedic novel about the end of the world, an angel and a demon team up to prevent the apocalypse.'),
('LOTRF', 'The Fellowship of the Ring', 'J.R.R. Tolkien', '1954-07-29', 'Fantasy', 'The first volume of the classic fantasy trilogy The Lord of the Rings. It follows Frodo Baggins as he sets out on a perilous journey to destroy a powerful ring.'),
('DAVC', 'The Da Vinci Code', 'Dan Brown', '2003-03-18', 'Thriller', 'A mystery thriller novel that explores the possibility of a hidden secret about the Holy Grail protected by a secret society.');

-- Creating the Checkouts table with appropriate columns, constraints and foreign key relationships
CREATE OR REPLACE TABLE Checkouts (
  -- Primary Key checkoutID with auto-increment feature
  checkoutID INT PRIMARY KEY AUTO_INCREMENT,
  -- Foreign Keys cardID and bookID linking to MemberCards and Books tables respectively
  cardID INT,
  bookID VARCHAR(50),
  -- Checkout related information fields
  checkoutDate DATE NOT NULL,
  dueDate DATE NOT NULL,
  returnDate DATE,
  FOREIGN KEY (bookID) REFERENCES Books(bookID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (cardID) REFERENCES LibraryCards(cardID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating the Fines table with appropriate columns, constraints and foreign key relationships
CREATE OR REPLACE TABLE Fines (
  -- Primary Key fineID with auto-increment feature
  fineID INT PRIMARY KEY AUTO_INCREMENT,
  -- Fine related information fields
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  date DATE NOT NULL,
  -- Foreign Key cardID linking to MemberCards table
  cardID INT,
  fineStatus VARCHAR(50),
  FOREIGN KEY (cardID) REFERENCES LibraryCards(cardID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Creating the Card_has_Books table to establish many-to-many relationship between MemberCards and Books tables
CREATE OR REPLACE TABLE Card_has_Books (
  -- Foreign Keys cardID and bookID linking to MemberCards and Books tables respectively
  cardID INT,
  bookID VARCHAR(50),
  -- Composite Primary Key (bookID, cardID)
  PRIMARY KEY (bookID, cardID),
  FOREIGN KEY (bookID) REFERENCES Books(bookID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (cardID) REFERENCES LibraryCards(cardID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Inserting initial data into the Card_has_Books table
INSERT INTO Card_has_Books (bookID, cardID) VALUES
('TLT', 3),
('ITA', 1),
('BAC', 1),
('TGG', 2),
('TKAM', 2),
('HPSS', 4),
('HG', 5),
('GD', 4),
('LOTRF', 3),
('DAVC', 5);

-- Inserting initial data into the Checkouts table
INSERT INTO Checkouts (checkoutDate, dueDate, returnDate, bookID, cardID) VALUES
(20230507, 20230521, 20230524, 'TKAM', 1),
(20230511, 20230525, NULL, 'TLT', 3),
(20230512, 20230526, NULL, 'ITA', 1),
(20230512, 20230526, NULL, 'BAC', 1),
(20230515, 20230529, NULL, 'TGG', 2),
(20230517, 20230531, NULL, 'TKAM', 2),
(20230601, 20230615, NULL, 'HPSS', 4),
(20230603, 20230617, 20230616, 'HG', 5),
(20230605, 20230619, NULL, 'GD', 4),
(20230606, 20230620, 20230618, 'LOTRF', 3),
(20230608, 20230622, NULL, 'DAVC', 5);


-- Inserting initial data into the Fines table
INSERT INTO Fines (amount, date, cardID, fineStatus) VALUES
(4.50, 20230524, 1, 'NOT PAID'),
(3.00, 20230525, 2, 'NOT PAID'),
(5.75, 20230526, 3, 'PAID'),
(2.50, 20230527, 4, 'NOT PAID'),
(6.00, 20230528, 5, 'PAID');

-- Trigger to automatically add entries to Card_has_Books
DELIMITER //
CREATE TRIGGER add_to_card_has_books
AFTER INSERT ON Checkouts
FOR EACH ROW
BEGIN
    IF NEW.returnDate IS NULL THEN
        INSERT INTO Card_has_Books (bookID, cardID)
        VALUES (NEW.bookID, NEW.cardID);
    END IF;
END;
//
DELIMITER ;

-- Trigger to automatically remove entries from Card_has_Books
DELIMITER //
CREATE TRIGGER remove_from_card_has_books
AFTER UPDATE ON Checkouts
FOR EACH ROW
BEGIN
    IF NEW.returnDate IS NOT NULL THEN
        DELETE FROM Card_has_Books
        WHERE bookID = NEW.bookID AND cardID = NEW.cardID;
    END IF;
END;
//
DELIMITER ;

SET FOREIGN_KEY_CHECKS = 1;