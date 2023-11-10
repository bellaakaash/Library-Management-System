// Get the objects we need to modify
let updateBookForm = document.getElementById('update-book-form-ajax');

// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBookID = document.getElementById("mySelect");
    let inputDescription = document.getElementById("descriptionUpdate");

    // Get the values from the form fields
    let bookIDValue = inputBookID.value;
    let descriptionValue = inputDescription.value;

    // Put our data we want to send in a JavaScript object
    let data = {
        bookID: bookIDValue,
        description: descriptionValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update the row in the table
            updateRow(xhttp.response, bookIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
        alert("Book description updated successfully");
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

function updateRow(data, bookID) {
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("books-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate through rows
        // Rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == bookID) {

            // Get the location of the row where we found the matching book ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of description value (assuming it's the 6th column)
            let td = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign description to our value we updated to
            td.innerHTML = parsedData[0].description;
        }
    }
}