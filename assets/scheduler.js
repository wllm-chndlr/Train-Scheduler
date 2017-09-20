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

var database = firebase.database();

// Variables and function to update time display every second
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

// $("#current-time-display").text(moment().format("HH:mm"));
$("<img>").addClass("responsive-img");
 
// Button for adding train details
$("#submit-train-details").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstDeparture = $("#time-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  var currentTime = moment(currentTime).format("HH:mm:ss, M/D/Y");
  console.log(currentTime);

  var firstDepartureConverted = moment(firstDeparture, "HH:mm").subtract(1, "years");
  console.log(firstDepartureConverted);

  var diffTime = moment().diff(moment(firstDepartureConverted), "minutes");
  console.log(diffTime);

  var tRemainder = diffTime % frequency;
  console.log(tRemainder);

  var tMinutesTillTrain = frequency - tRemainder;
  console.log("NEXT ARRIVAL: " + tMinutesTillTrain);

  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var nextTrainConverted = moment(nextTrain).format("HH:mm");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));  


  // Creates local "temporary" object for holding train data
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

  // Alert
  Materialize.toast('Train details successfully added', 3000, 'orange rounded');

  // Clears all of the text boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var trainz = snapshot.val();

  // Console.loging the last user's data
  // console.log(trainz.trainName);
  // console.log(trainz.destination);
  // console.log(trainz.firstDeparture);
  // console.log(trainz.frequency);

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
  
// Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});