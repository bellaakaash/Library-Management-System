// Get the objects we need to modify
let addBookForm = document.getElementById('add-books-form-ajax');

// Modify the objects we need
addBookForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();
    e.stopPropagation();

    // Get form fields we need to get data from
    let inputBookID = document.getElementById("input-bookID");
    let inputTitle = document.getElementById("input-title");
    let inputAuthor = document.getElementById("input-author");
    let inputDate = document.getElementById("input-date");
    let inputGenre = document.getElementById("input-genre");
    let inputDescription = document.getElementById("input-description");
    

    // Get the values from the form fields
    let bookIDValue = inputBookID.value;
    let titleValue = inputTitle.value;
    let authorValue = inputAuthor.value;
    let dateValue = inputDate.value;
    let genreValue = inputGenre.value;
    let descriptionValue = inputDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        bookID: bookIDValue,
        title: titleValue,
        author: authorValue,
        date: dateValue,
        genre: genreValue,
        description: descriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-books-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBookID.value = '';
            inputTitle.value = '';
            inputAuthor.value = '';
            inputDate.value = '';
            inputGenre.value = '';
            inputDescription.value = '';

            alert("Book added successfully");
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from Books
addRowToTable = (data) => {
    // Get a reference to the current table on the page
    let currentTable = document.getElementById("books-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Get the date in a user-friendly format
    let dateParts = newRow.date.split("-");
    let formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let authorCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let genreCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");

    // Create a delete cell and button
    let deleteCell = document.createElement("TD");
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteBook(newRow.bookID);

        alert("Book deleted successfully");
    };
    deleteCell.appendChild(deleteButton);

    // Fill the cells with correct data
    idCell.innerText = newRow.bookID;
    titleCell.innerText = newRow.title;
    authorCell.innerText = newRow.author;
    dateCell.innerText = formattedDate;
    genreCell.innerText = newRow.genre;
    descriptionCell.innerText = newRow.description;

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(authorCell);
    row.appendChild(dateCell);
    row.appendChild(genreCell);
    row.appendChild(descriptionCell);
    row.appendChild(deleteCell); // Add the delete cell to the row

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.bookID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find the drop-down menu, create a new option, fill data in the option (title, bookID),
    // then append the option to the drop-down menu so newly created rows via AJAX will be found in it without needing a refresh.
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.title;
    option.value = newRow.bookID;
    selectMenu.add(option);
}