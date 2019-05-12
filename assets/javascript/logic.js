// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAmTWSidUrpy4ITp5HtGJiB9SQusrV1U1g",
    authDomain: "firemomenthw.firebaseapp.com",
    databaseURL: "https://firemomenthw.firebaseio.com",
    projectId: "firemomenthw",
    storageBucket: "firemomenthw.appspot.com",
    messagingSenderId: "1031198431819",
    appId: "1:1031198431819:web:a065aa08a660c978"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Reference to firebase's database
var database = firebase.database();

//Run Time
setInterval(function (startTime) {
    $("#timer").html(moment().format('hh:mm a'))
}, 1000);

//On click event that doesn't refresh page 
$("#add-train").on("click", function () {
    event.preventDefault();

    // Setting vars equal to inputs and Storing and retrieving the most recent train information
    var train = $("#trainName-input").val().trim();
    var destination = $("#Destination-input").val().trim();
    var frequency = $("#Frequency-input").val().trim();
    var firstTime = $("#FirstTrainTime-input").val().trim();
    var trainObject = {
        TrainInput: train,
        DestinationInput: destination,
        FrequencyInputcy: frequency,
        FirstTimeTrainInput: firstTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    //Push trainObject to database
    database.ref().push(trainObject);
    console.log(trainObject.TrainInput);
    console.log(trainObject.DestinationInput);
    console.log(trainObject.FrequencyInputcy);
    console.log(trainObject.FirstTimeTrainInput);
    console.log(trainObject.dateAdded);

    
    //Set values on the inputs as empty strings
    $("#trainName-input").val("");
    $("#Destination-input").val("");
    $("#Frequency-input").val("");
    $("#FirstTime-input").val("");

});

// Firebase watcher + initial loader 
database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
    var train = childSnapshot.val().TrainInput;
    var destination = childSnapshot.val().DestinationInput;
    var frequency = childSnapshot.val().FrequencyInputcy;
    var firstTime = childSnapshot.val().FirstTimeTrainInput;
  
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
  
    //Set current time
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm a"));
  
    //Set Timer text in #timer with moment.js
    $("#timer").text(currentTime.format("hh:mm a"));
  
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in Time: " + diffTime);
  
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log("Remainder: " + tRemainder);
  
    //Minutes til the train arrives
    var minutesAway = frequency - tRemainder;
    console.log("Minutes til train arrives: " + minutesAway);
  
    //Time the train comes at
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
    console.log("Arrival Time: " + moment(nextArrival).format("hh:mm a"));
  

    //adds back updated information
    $("#train-table > tbody").append("<tr><td>" + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
    frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

});
  
  // Update minutes away by triggering change in firebase children
  function timeUpdater() {
    //Empty Tbody
    $("#train-table > tbody").empty();
    
    //Change values of the object to inputs
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
    var train = childSnapshot.val().TrainInput;
    var destination = childSnapshot.val().DestinationInput;
    var frequency = childSnapshot.val().FrequencyInputcy;
    var firstTime = childSnapshot.val().FirstTimeTrainInput;
  
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
  
    // Moment JS maths stuff, defining currentTime, difference between times in minutes, minutes from the station, and when it arrives.
    // Current Time
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm a"));
    // $("#timer") text current time
    $("#timer").text(currentTime.format("hh:mm a"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + diffTime);
  
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log("Remainder: " + tRemainder);
  
    //Minutes til the train arrives
    var minutesAway = frequency - tRemainder;
    console.log("Minutes till train arrives: " + minutesAway);
  
    //determine Next Train Arrival             
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
    console.log("Arrival Time: " + moment(nextArrival).format("hh:mm a"));
  
   //want to push to table to add new train 
    //add new table row
    //add new train information into row
    // Add each train's data into the table row
    $("#train-table > tbody").append("<tr><td>" + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
    frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
  
    })
  };
  
  setInterval(timeUpdater, 6000);
  
  
  