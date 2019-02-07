

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyCW0W0b9OD3NlrsO7hSm4I1R8PKuLvpLMM",
		authDomain: "train-scheduler-a03f8.firebaseapp.com",
		databaseURL: "https://train-scheduler-a03f8.firebaseio.com",
		projectId: "train-scheduler-a03f8",
		storageBucket: "",
		messagingSenderId: "781128937300"
	};
	firebase.initializeApp(config);
	console.log("database reference = " + firebase.database().ref());

/* ================================================================ */
// $("").on("",function() {});
$("#add-train-btn").on("click",function(clickedObject) {
	clickedObject.preventDefault(); //stop the page reload madness!

// 1. begin by collecting user input...

	var trainInput = $("#train-name-input").val().trim();
	var destinationInput = $("#destination-input").val().trim();
	var timeInput = $("#time-input").val().trim();	
	var frequencyInput = $("#frequency-input").val().trim();
	frequencyInput = parseInt(frequencyInput);

// 2. store user input in a a local variable object...

	var trainObject = {name: trainInput, destination: destinationInput, time: timeInput, frequency: frequencyInput};

// 3. write the object to the database...

	firebase.database().ref().push(trainObject);

// 4. clear the form inputs on the page...

	$("#train-name-input").val("");
	$("#destination-input").val(""); 
	$("#time-input").val(""); 
	$("#frequency-input").val("");

});

/* ================================================================ */
// firebase.database().ref().on("child-added", function(snapshot, prevChildKey) {});        
firebase.database().ref().on("child_added", function(childSnapshot) {


// 1. begin by storing firebase data in local variables for manipulation...

	var trainOutput = childSnapshot.val().name;
	var destinationOutput = childSnapshot.val().destination;
	var frequencyOutput = childSnapshot.val().frequency;
	var timeOutput = childSnapshot.val().time;
	
	
// 2. perform calculations on existing data to produce new data...

	//moment() is already an object
	var currentTime = moment().valueOf(); //outputs the number of milliseconds since unix epoch

	//need to convert timeOutput to moment() object
	timeOutput = moment(timeOutput, "HHmm").valueOf(); //outputs the number of milliseconds since unix epoch

	//now we need totalTime in minutes
	var totalTime = currentTime - timeOutput; //outputs 25893705 milliseconds
	totalTime = moment.duration(totalTime).asMinutes(); //453.2553 minutes

	//now we want to divide total minutes by frequency interval minutes to get remainder in minutes
	var freqRemainder = totalTime % frequencyOutput; //3.255299999999977 minutes
	
	//now we want the balance of time left in the current frequency interval
	var freqBalance = frequencyOutput - freqRemainder; //26.744700000000023 minutes

	//now we want to add minutes to current timestamp
	//var nextArrival = currentTime + freqBalance;
	// moment().add(3, 'hours');

	var nextArrival = moment(currentTime).add(freqBalance, "minutes");

	nextArrival = nextArrival.format("HH:mm"); 

	freqBalance = Math.ceil(freqBalance);


  // 3. output the data to the page...

  currentTime = moment(currentTime).format("HH:mm [hrs]"); 
  $("#current-time").text(currentTime);

var newRow = $("<tr>").append(
    $("<td>").text(trainOutput),
    $("<td>").text(destinationOutput),
    $("<td>").text(frequencyOutput),
    $("<td>").text(nextArrival),
    $("<td>").text(freqBalance),
  );

$("#train-table > tbody").append(newRow);

  

});

