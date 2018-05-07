$(document).ready(function () {

    var database = firebase.database();

    database.ref().on("value", function (snapshot) {
        var data = snapshot.val() || {};
        $("#newTrainsAdded").empty();

        var keys = Object.keys(data);

        for (var i = 0; i < keys.length; i++) {
            var trainSchedule = data[keys[i]];
            console.log(trainSchedule);

            var tr = $("<tr>");
            $("#newTrainsAdded").append(tr);

            var tdTrainName = $("<td>");
            tdTrainName.text(trainSchedule.trainName);
            tr.append(tdTrainName);

            var tdDestination = $("<td>");
            tdDestination.text(trainSchedule.destination);
            tr.append(tdDestination);

            var tdFrequency = $("<td>");
            tdFrequency.text(trainSchedule.frequency);
            tr.append(tdFrequency);

            var tFrequency = trainSchedule.frequency;

            var firstTime = trainSchedule.trainTime;
            console.log("first time", firstTime);

            // FIRST TIME 
            // HAVE TO PUSH BACK 1 YEAR TO MAKE SURE IT COMES BEFORE CURRENT TIME
            var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
            console.log(firstTimeConverted);

            // CURRENT TIME
            var currentTime = moment();
            console.log("CURRENT TIME: " + currentTime.format("hh:mm"));

            // DIFFERENCE BETWEEN THE CURRENT TIME AND THE CONVERTED TIME
            var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);

            // REMAINDER OF TIME 
            var tRemainder = diffTime % tFrequency;
            console.log(tRemainder);

            // MINUTES UNTIL NEXT TRAIN
            var tMinutesTillTrain = tFrequency - tRemainder;
            console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

            // NEXT TRAIN TIME
            var nextTrain = currentTime.add(tMinutesTillTrain, "minutes").format("hh:mm");

            var tdNextArrival = $("<td>");
            tdNextArrival.text(nextTrain);
            tr.append(tdNextArrival);

            var tdMinutesAway = $("<td>");
            tdMinutesAway.text(tMinutesTillTrain);
            tr.append(tdMinutesAway);
        }
    });

    // WHEN SUBMIT BUTTON IS CLICKED, THE INPUT WILL BE CAPTURED
    $("#addTrainButton").on("click", function (event) {
        event.preventDefault();

        // CAPTURE USER INPUTS AND STORE THEM INTO VARIABLES
        var trainName = $("#trainNameInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var trainTime = $("#trainTimeInput").val().trim();
        var frequency = $("#frequencyInput").val().trim();

        // TESTING TO CONFIRM USER INPUTS ARE RECEIVED CORRECTLY
        console.log(trainName);
        console.log(destination);
        console.log(trainTime);
        console.log(frequency);

        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
        })

        // CLEAR TEXTBOX INPUT 
        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#trainTimeInput").val("");
        $("#frequencyInput").val("");
    });

});