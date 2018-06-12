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

// if a wrong square is hit at any time, -50 points.

// game gets faster and faster until all of player's points are lost.

// while points <100, spawn fly only
// while points <500, spawn fly and cockroach only. set interval to increase spawn rate every x seconds
// while points <1000, spawn fly, cockroach and trap only. set interval to increase spawn rate every x seconds


var FLY = {
	points: 10,
	image: './assets/fly.gif'
}

var ROACH = {
	points: 20,
	image: ['./assets/roach.gif', './assets/roach1.gif']
}

var TRAP = {
	points: -50,
	image: './assets/trap.jpg'
}

var THRESHOLD_ROACH = 500;
var THRESHOLD_TRAP = 1000;

var MISS_SCORE = 50;
var TIMEOUT_PENALTY = 50;
var scoreBox = document.getElementById('score-box');
scoreBox.innerHTML = 'Score: ' + 0;
var score = 0;

var currentSquare = {
	square: 1,
	occupier: undefined
};

// assign individual squares ids
var num7 = document.getElementById('num7');
var num8 = document.getElementById('num8');
var num9 = document.getElementById('num9');
var num4 = document.getElementById('num4');
var num5 = document.getElementById('num5');
var num6 = document.getElementById('num6');
var num1 = document.getElementById('num1');
var num2 = document.getElementById('num2');
var num3 = document.getElementById('num3');

// create img tag
var image = document.createElement('img');

var numArr = [ undefined, num1, num2, num3, num4, num5, num6, num7, num8, num9 ];

document.getElementById('start-button').addEventListener('click', gameStart);

var timeout = 2000, showRoach = false, showTrap = false, keyPressed = false;

document.onkeydown = function(event) { 
						var key = parseInt(event.keyCode);
						if (key > 48 && key < 58) {
							key -= 48;
						} else if (key > 96 && key < 106) {
							key -= 96;
						}
						keyPress(key); 
					}; // register the keypress event

function tick() { // this function generates a random object on a random square
	if (!keyPressed) { // if no key was pressed, timeout penalty is deducted
		score -= TIMEOUT_PENALTY;
	}
	numArr[currentSquare.square].innerHTML = ''; // - clear the content of the current square
	scoreBox.innerHTML = 'Score: ' + score;

	if (score < 0) {
		gameOver();
		return;
	}
	keyPressed = false;
	var randomNum = Math.floor(Math.random() * 9) + 1;// - generate a random number between 1 and 9
	var newSquare = numArr[randomNum]; // 'assign' the index of array element using randomNum
    newSquare.appendChild(image); // append img tag to newSquare
    image.src = FLY.image; // - add the fly image to that square
	currentSquare.square = randomNum; // - update currentSquare with the new info
	currentSquare.occupier = FLY;

	setTimeout(tick, timeout);
}

// if no keypress is detected on tick, it logs score and clears square then exits function, 
// then tick sets keypress to false again to generate new bug, then calls itself again. 
// and if keypress detected, keypress function is called instead, and the score logs there.

function gameStart() {
	score = 0;
	scoreBox.innerHTML = 'Score: ' + score; // reset score box

	keyPressed = true; // when game starts, it ticks for a new fly, but no key has been pressed yet, if keypressed isn't true, game would deduct the penalty
	tick();
}

function keyPress(key) {
	console.log("key pressed: " + key + " and current square: " + currentSquare.square);
	// if (keyPressed) {
	// 	return; // if a key was already pressed, exit the function
	// }
	keyPressed = true;
	if (key == currentSquare.square) { // if key matches square
		score += currentSquare.occupier.points; // add to score
		numArr[currentSquare.square].innerHTML = ''; // - clear the content of the current square
	} else {
		score -= MISS_SCORE; // deduct score
	}
	scoreBox.innerHTML = 'Score: ' + score;
}

function gameOver() {
	alert("Game Over");
}

