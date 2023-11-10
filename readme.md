# Library Management System

This project provides a web interface for a Library Management System. It includes various functionalities like displaying and managing library cards, books, checkouts, fines, and associations between library cards and books.

Citation: Node and database connection setup on flip and CRUD operation on each database entity
Authors: Akaash Bella, Raahi Vaidya
Date: August 10, 2023
Originality: Adapted
Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

## Files in this Project:

### 1. **app.js**
- Language: JavaScript
- Description:
    - The main entry point for the server-side logic.
    - It sets up the server, establishes database connections, and handles route configurations.

### 2. **books.hbs**
- Language: HTML with Handlebars Templating
- Description:
    - Renders the book-related content on the web page.
    - Displays details about books, including titles, authors, dates, genres, and descriptions.

### 3. **cardHasBooks.hbs**
- Language: HTML with Handlebars Templating
- Description:
    - Renders the associations between library cards and books on the web page.
    - Provides an interface for displaying which books are associated with which library cards.

### 4. **checkouts.hbs**
- Language: HTML with Handlebars Templating
- Description:
    - Renders the checkout-related content on the web page.
    - Displays details about book checkouts, including checkout date, due date, and return date.

### 5. **fines.hbs**
- Language: HTML with Handlebars Templating
- Description:
    - Renders the fine-related content on the web page.
    - Displays details about fines, including amounts, due dates, and payment statuses.

### 6. **index.hbs**
- Language: HTML with Handlebars Templating
- Description:
    - Renders the homepage of the Library Management System.
    - Provides a welcoming interface with navigation links to various sections of the system.

### 7. **libraryCards.hbs**
- Language: HTML with Handlebars Templating
- Description:
    - Renders the library card-related content on the web page.
    - Displays details about library cards, including names, addresses, contact information, issue dates, and expiration dates.

### 8. **main.hbs**
- Language: HTML with Handlebars Templating
- Description:
    - The main layout template for the Library Management System.
    - Contains the common layout elements and structures used in other templates.

### 9. **style.css**
- Language: CSS
- Description:
    - The main stylesheet for the Library Management System.
    - Provides the styling and visual aesthetics for the web interface.

### 10. **db-connector.js**
- Language: JavaScript
- Description:
    - Responsible for connecting to the database.
    - Exports the connection for use in other parts of the application.

### 11. **ddl.sql**
- Language: SQL
- Description:
    - Contains the Data Definition Language (DDL) statements.
    - Used for creating, altering, or deleting tables and schemas.

### 12. **dml.sql**
- Language: SQL
- Description:
    - Contains the Data Manipulation Language (DML) statements.
    - Used for inserting, updating, and deleting data in the database.