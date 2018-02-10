

// When you click the "New Articles" button to scrape for new articles
  $("#scrape-articles").on("click", function () {
    // Run a GET request to scrape for articles
    $.ajax({
      method: "GET",
      url: "/scrape",
    }).then(function () {
      document.reload();
      console.log("Scrape Complete browser!")
    });
  });

  // Grab the articles as json and display them on the page.
  $.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<li class=collection-item>" + "<div data-id='" + data[i]._id + "'>" + "<a href='" + data[i].link + "'>" + data[i].title + "</a" + "</div>" + "<a href=# class=secondary-content>" + "<i id=save-article class=material-icons right-align blue>" + "favorite" + "</i>" + "</a>" + "</li>");
    }
  });


  // Grab the saved articles as json and display them on the page
  $.getJSON("/saved", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#saved-articles").append("<li class=collection-item>" + "<div data-id='" + data[i]._id + "'>" + "<a href='" + data[i].link + "'>" + data[i].title + "</a" + "</div>" + "<a href=#modal1 id=add-note class=secondary-content modal-trigger>" + "<i class=material-icons right-align blue>" + "add_circle" + "</i>" + "</a>" + "<a href=# class=secondary-content>" + "<i id=delete-article class=material-icons right-align black>" + "delete" + "</i>" + "</a>" + "</li>");
    }
  });

  // When you click the save article (heart icon) button, saved the article as a Saved Article
  $(document).on("click", "#save-article", function () {
    // Grab the id associated with the article from the save button
    var thisId = $(this).parent().parent().attr("data-id");
    // Run a POST request to change the unsaved article to a saved article
    $.ajax({
        method: "POST",
        url: "/savearticle/" + thisId,
        data: {
          saved: true
        }
      })
      // With that done
      .then(function (data) {
        // Log the response
        console.log("Article Saved!");
      });
  });

  // When you click the delete article (trashcan icon) button, remove the article from the Saved Articles list
  $(document).on("click", "#delete-article", function () {
    // Grab the id associated with the article from the save button
    var thisId = $(this).parent().parent().attr("data-id");
    // Run a POST request to change the unsaved article to a saved article
    $.ajax({
        method: "POST",
        url: "/removearticle/" + thisId,
        data: {
          saved: false
        }
      })
      // With that done
      .then(function (data) {
        //Reload the list
        location.reload();
        // Log the response
        console.log("Article Removed!");
      });
  });

  // Grab all notes for an article as json and display them on the page.
  function getnotes() {
    $.getJSON("/getnotes/:id", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#notes-list").append("<li class=collection-item>" + "<div data-id='" + data[i]._id + "'>" + "<a href='" + data[i].link + "'>" + data[i].title + "</a" + "</div>" + "<a href=# class=secondary-content>" + "<i id=delete-note class=material-icons right-align blue>" + "delete" + "</i>" + "</a>" + "</li>");
    }
  });
};

  // Whene you click on the add note (plus icon) button, trigger the modal dialog and configure the modal dialog
  $(document).on("click", "#add-note", function () {
    // Grab the article id
    var thisId = $(this).parent().attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId,
        data: {
          // Value taken from title input
          // title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        getnotes();
        //Title of the Div
        $("#notes-div").prepend("<h3>" + "Notes" + "<h3>");
        // The title of the article
        $("#notes").append("<h4>" + "Add a note for " + data._id + "</h4>");
        // An input to enter a new title
        // $("#notes").append("<input id='titleinput' name='title' type='text' >");
        // A textarea to add a new note body
        $("#notes").append("<input id='bodyinput' name='body' placeholder='Your note goes here.' type='text'></input>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + thisId + "' id='savenote' class='btn'>Save Note</button>");
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from title input
          // title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        // $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    // $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  // When you click the delete note (trashcan icon) button, remove the note from a Saved Article
  $(document).on("click", "#delete-note", function () {
    // Grab the id associated with the article from the save button
    var thisId = $(this).parent().parent().attr("data-id");
    // Run a POST request to change the unsaved article to a saved article
    $.ajax({
        method: "POST",
        url: "/removenote/" + thisId,
      })
      // With that done
      .then(function (data) {
        //Reload the list
        location.reload();
        // Log the response
        console.log("Note Removed!");
      });
  });