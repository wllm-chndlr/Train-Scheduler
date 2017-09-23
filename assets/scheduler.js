// Initialize Firebase
var config = {
   apiKey: "AIzaSyC9pUbAbOxMKw00beMmZ4U5geqmqdfAibY",
   authDomain: "train-scheduler-8273c.firebaseapp.com",
   databaseURL: "https://train-scheduler-8273c.firebaseio.com",
   projectId: "train-scheduler-8273c",
   storageBucket: "",
   messagingSenderId: "382534588053"
 };
 firebase.initializeApp(config);

// Assign Firebase database to a variable
var database = firebase.database();

// Update current time display every second
var datetime = null,
date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('HH:mm:ss' + '<br>' + 'M/D/Y'));
};

$(document).ready(function(){
  datetime = $('#current-time-display')
  update();
  setInterval(update, 1000);
});

// Button for adding train details
$("#submit-train-details").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstDeparture = $("#time-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  // Current time
  var currentTime = moment(currentTime).format("HH:mm:ss, M/D/Y");

  // First departure (pushed back 1 year to make sure it comes before current time)
  var firstDepartureConverted = moment(firstDeparture, "HH:mm").subtract(1, "years");

  // Difference between the times
  var diffTime = moment().diff(moment(firstDepartureConverted), "minutes");

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;

  // Minutes until next train
  var tMinutesTillTrain = frequency - tRemainder;

  // Arrival time of next train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var nextTrainConverted = moment(nextTrain).format("HH:mm");

  // Creates local temporary object for holding train data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstDeparture: firstDeparture,
    frequency: frequency,
    tMinutesTillTrain: tMinutesTillTrain,
    nextTrainConverted: nextTrainConverted,
    timeOfInquiry: currentTime
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Notification that train details have been added
  Materialize.toast('Train details successfully added', 3000, 'orange rounded');

  // Clear all the text boxes after submission
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
  
  Materialize.updateTextFields();
  
});

// Firebase watcher + initial loader + order
database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
  
  // Store the snapshot.val() in a variable for convenience
  var trainz = snapshot.val();

  // Append train details to the table
  $("tbody").append($('<tr>')
    .append($('<td>')
      .text(trainz.trainName)
    )
    .append($('<td>')
      .text(trainz.destination)
    )
    .append($('<td>')
      .text(trainz.firstDeparture)
    )
    .append($('<td>')
      .text(trainz.frequency)
    )
    .append($('<td>')
      .text(trainz.nextTrainConverted)
    )
    .append($('<td>')
      .text(trainz.tMinutesTillTrain)
    )
    .append($('<td>')
      .text(trainz.timeOfInquiry)
    )
  ); 
  
// Error handler
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});