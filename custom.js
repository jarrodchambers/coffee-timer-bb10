// Store time we started the coffee and the ID of setInterval
var g_TimeStarted, g_intervalId, g_alarm, g_counter;
var g_lid, g_lidglare, g_plunger, g_stem, g_coffeeTop, g_coffeeHeight;
var TIMERLENGTH = 240000;
// var TIMERLENGTH = 10000;

function screenReady(element, id, params) {
   if (id == "timer") {
      // Remember where the plunger started
      g_lid = element.getElementById("lid").y.baseVal.value;
      g_lidglare = element.getElementById("lidglare").y.baseVal.value;
      g_plunger = element.getElementById("plunger").y.baseVal.value;
      g_stem = element.getElementById("stem").y.baseVal.value;
      g_coffeeTop = element.getElementById("coffee").y.baseVal.value;
      g_coffeeHeight = element.getElementById("coffee").height.baseVal.value;
      if (window.innerHeight > 720) {
	     element.getElementById("clock").style.marginTop = "15%";
		 element.getElementById("press").style.marginTop = "15%";
      }
   }
}

function domReady(element, id, params) {
	  // Disable scrolling for the timer window
	  preventMove = function(evt) {
        evt.preventDefault();
 /*        window.scroll(0, 0);
         return false;*/
      };
      window.document.addEventListener('touchmove', preventMove, false);
}

function stopCountdown() {
   clearInterval(g_intervalId);
   bb.popScreen();
}

function startCountdown() {
   // Push the timer screen to the front
   bb.pushScreen("timer.html", "timer");
   // Check once per second if the timer has expired
   g_intervalId = setInterval(bodum, 1000);
   // Store the time we started - we don't trust the function to actually be called
   // once per second, so we just calculate time since start
   g_TimeStarted = new Date ( );
   g_alarm = document.createElement('audio');
   g_alarm.src = 'coffeetimer.wav';
   g_counter = 0;
}

function bodum() {
   // Get time since starting the timer
   var elapsedTime = new Date ( ) - g_TimeStarted;
   // If time is up, show 0:00, alert the user, and cancel the timer using clearInterval
   if (elapsedTime > TIMERLENGTH) {
     document.getElementById("clock").innerHTML = "0:00";
	 clearInterval(g_intervalId);
     alertUser();
   } else {
      // Calculate minutes and seconds left.  240500 ms is to correct a rounding error with the minutes
	  // that led to a display of 2:60 instead of 3:00
      var minutes = Math.floor((TIMERLENGTH + 500 - elapsedTime) / 60000);
	  var seconds = Math.round((TIMERLENGTH - elapsedTime - 60000 * minutes) / 1000);
	  if (seconds < 10) { seconds = "0" + seconds; }
	  document.getElementById("clock").innerHTML = minutes + ":" + seconds;
	  // Animate the french press icon
		 var delta = Math.floor((elapsedTime * 4.6) / 8000);
		 document.getElementById("lid").y.baseVal.value = g_lid + delta;
		 document.getElementById("lidglare").y.baseVal.value = g_lidglare + delta;
		 document.getElementById("plunger").y.baseVal.value = g_plunger + delta;
		 document.getElementById("stem").y.baseVal.value = g_stem + delta;
		 document.getElementById("coffee").y.baseVal.value = g_coffeeTop + delta;
		 document.getElementById("coffee").height.baseVal.value = g_coffeeHeight - delta;
   }
}

function alertUser () {
   var ops = {title : "Time's up!" , position : blackberry.ui.dialog.CENTER, size : blackberry.ui.dialog.FULL};
   blackberry.ui.dialog.customAskAsync("Please plunge your coffee now", ["OK"], function(selectedButtonIndex){bb.pushScreen ("button.html", "button");}, ops);
   // Play an audio alert
   g_alarm.play();
}