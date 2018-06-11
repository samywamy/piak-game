// game loads with a popup with a start button.
// familiarize player with controls By making them press all keys on the numpad (optional)

// game starts

// a fly appears on a random square. Alert: Smash the fly!
// player has to press the corresponding key the bug is on.
// each fly gives 10 points.

// when points reach 100, cockroach is unlocked. Alert: Smash the cockroach twice!
// each cockroach takes 2 hits to kill but gives 20 points.
// game gets faster

// when points reach 500, sticky trap is unlocked. Alert: Don't touch the sticky trap!
// if player hits a sticky trap, 50 points are taken away.

// when points reach 1000, numbers are unlocked. Alert: Enter the NUMBER shown!
// random number from 1-9 appears on random square.
// player has to hit the NUMBER on the numpad and not the position.
// gives 30 points

// if a wrong square is hit at any time, -20 points.

// game gets faster and faster until all of player's points are lost.

var FLY = {
	points: 10;
	image: './assets/fly.gif';
}

var ROACH = {
	points: 20;
	image: ['./assets/roach.gif', './assets/roach1.gif'];
}

var TRAP = {
	points: -50;
	image: './assets/trap.jpg'
}

var THRESHOLD_ROACH = 500;
var THRESHOLD_TRAP = 1000;

var MISS_SCORE = 20;

var score = 0;

var currentSquare = {square: 0, occupier: undefined};

var num7 = document.getElementById('num7');
var num8 = document.getElementById('num8');
var num9 = document.getElementById('num9');
var num4 = document.getElementById('num4');
var num5 = document.getElementById('num5');
var num6 = document.getElementById('num6');
var num1 = document.getElementById('num1');
var num2 = document.getElementById('num2');
var num3 = document.getElementById('num3');


// while points <100, spawn fly only
// while points <500, spawn fly and cockroach only. set interval to increase spawn rate every x seconds
// while points <1000, spawn fly, cockroach and trap only. set interval to increase spawn rate every x seconds














