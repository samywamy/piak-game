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
	images: ['./assets/roach.gif', './assets/roach1.gif']
}

var TRAP = {
	points: -20,
	image: './assets/trap.jpg'
}

var NUM = {
	points: 30,
	nums: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
}

var THRESHOLD_ROACH = 100;
var THRESHOLD_TRAP = 200;
var THRESHOLD_NUM = 500;

var MISS_SCORE = 50;
var TIMEOUT_PENALTY = 50;
var scoreBox = document.getElementById('score-box');
scoreBox.innerHTML = 'Score: ' + 0;
var score = 0;

var currentSquares = [];

var numArr = [ undefined, document.getElementById('num1'), document.getElementById('num2'), 
				document.getElementById('num3'), document.getElementById('num4'), document.getElementById('num5'), 
				document.getElementById('num6'), document.getElementById('num7'), document.getElementById('num8'), 
				document.getElementById('num9') ];

document.getElementById('start-button').addEventListener('click', gameStart);

var timeout = 2000, gameOverBool = false, keyPressed = false;


function keydownFunction(event) { 
	var key = parseInt(event.keyCode);
	if (key > 48 && key < 58) {
		key -= 48;
	} else if (key > 96 && key < 106) {
		key -= 96;
	}
	keyPress(key); 
}; // register the keypress event

document.onkeydown = keydownFunction;

function tick() { // generates a random object on a random square
	if (!keyPressed) { // if no key was pressed, timeout penalty is deducted
		score -= TIMEOUT_PENALTY;
	}
	scoreBox.innerHTML = 'Score: ' + score;
	if (score < 0) {
		gameOver();
		return;
	}
	keyPressed = false;
	spawn();
	if (showState == SHOW_NUM) {
		timeout = timeout - 10; // <--- you can do dis!? so coooool
	}
	setTimeout(tick, timeout);
}

function gameStart() {
	score = 0; showState = 1;
    scoreBox.innerHTML = 'Score: ' + score; // reset score box
    gameOverBool = false;

	keyPressed = true; // when game starts, it ticks for a new fly, but no key has been pressed yet, if keypressed isn't true, game would deduct the penalty
	tick();
}

function keyPress(key) {
	if (gameOverBool) {
		return;
	}
    keyPressed = true;
	var index = indexOfKeyPress(key);
	if (index != -1) {
        var currentSquare = currentSquares[index];
    	if (currentSquare.whacks == 2) {
    		currentSquare.whacks = 1;
            var numDiv = numArr[currentSquare.square];
            var imagesArr = numDiv.getElementsByTagName('img');
            var image = imagesArr[0];
            image.src = ROACH.images[1];
    	} else {
    		score += currentSquare.points;
			numArr[currentSquare.square].innerHTML = ''; // - clear the content of the current square
			currentSquares.splice(index, 1); // removes square from array
        }
    } else {
    	score -= MISS_SCORE; // deduct score
    }
	scoreBox.innerHTML = 'Score: ' + score;
}

function indexOfKeyPress(key) {
    // function finds key in currentSquares. return index of the key 
    for (var i = 0; i < currentSquares.length; i++) {
    	if (currentSquares[i].key == key) {
    		return i;
    	}
    }
    return -1;
}


function gameOver() {
	gameOverBool = true;
    alert("Game Over");
    // maybe add a global boolean to tell you game is over, so you can use that in order to not receive keypresses anymore.
    // or maybe remove the keypress listener and add it only when the game starts, idk

}

function spawn() {
	adjustState();
    clearAllSquares();

    var numOfSpawns = Math.floor(Math.random() * 3) + 1;
    for (var i = 0; i < numOfSpawns; i++) {
        var randomSpawn = Math.floor(Math.random() * showState); // randomly picks a spawn taking into consideration the showState
        spawnArr[randomSpawn] ();
    }
}

function spawnFLY() {
	var squareNumber = newRandomSquareNumber();
    var currentSquare = {square: squareNumber, points: FLY.points, whacks: 1, key: squareNumber}; // define a currentSquare obj as a fly square
    currentSquares.push(currentSquare);
    var image = document.createElement('img');
    image.src = FLY.image;
    numArr[squareNumber].appendChild(image);
}

function spawnROACH() {
	var squareNumber = newRandomSquareNumber();
    var currentSquare = {square: squareNumber, points: ROACH.points, whacks: 2, key: squareNumber};
	currentSquares.push(currentSquare);
    var image = document.createElement('img');
    image.src = ROACH.images[0];
    numArr[squareNumber].appendChild(image);
}

function spawnTRAP() {
	var squareNumber = newRandomSquareNumber();
    var currentSquare = {square: squareNumber, points: TRAP.points, whacks: 0, key: squareNumber};
	currentSquares.push(currentSquare);
    var image = document.createElement('img');
    image.src = TRAP.image;
    numArr[squareNumber].appendChild(image);
}

function spawnNUM() {
	var squareNumber = newRandomSquareNumber();
	var num = Math.floor(Math.random() * 9) + 1;
    var currentSquare = {square: squareNumber, points: NUM.points, whacks: 1, key: num};
	currentSquares.push(currentSquare);    
    var square = document.createElement('h1');
    square.innerHTML = num;
    numArr[squareNumber].appendChild(square);
}

var spawnArr = [spawnFLY, spawnROACH, spawnTRAP, spawnNUM];


function clearAllSquares() {
	for (var i = 0; i < currentSquares.length; i++) {
		numArr[currentSquares[i].square].innerHTML = '';
	}
    currentSquares = []; // empty the array
}

var SHOW_FLY = 1, SHOW_ROACH = 2, SHOW_TRAP = 3, SHOW_NUM = 4;
var showState = 0;

function adjustState() {
	switch (showState) {
		case SHOW_FLY:
			if (score > THRESHOLD_ROACH) {
				showState = SHOW_ROACH;
			}
		case SHOW_ROACH:
			if (score > THRESHOLD_TRAP) {
				showState = SHOW_TRAP;
			}
			break;
		case SHOW_TRAP:
			if (score > THRESHOLD_NUM) {
				showState = SHOW_NUM;
			}
			break;
	}
}

function squareAlreadyTaken(square) {
	for (var i = 0; i < currentSquares.length; i++) {
		if (currentSquares[i].square === square) {
			return true;
		}
	}
	return false;
}

function newRandomSquareNumber() {
	var nrsn = Math.floor(Math.random() * 9) + 1;
    while (squareAlreadyTaken(nrsn)) {  // danger will robinson, infinite loop
        if (nrsn === 9) {
            nrsn = 1;
        } else {
            nrsn += 1;
        }
    }
    return nrsn;
}


// thinking out loud

// for number spawn, put on its own timeline? put every object on it's own timeline?

// random spawn interval with min of x seconds, max of x seconds, and only a fixed timeout? random timeout?

// timeout gets quicker 

// objects should not disappear if they're not clicked. next object can still spawn
// more than 1 object on the screen and to fill available squares where available.
// randomised number should not be equal to the previous number
// https://stackoverflow.com/questions/40056297/random-number-which-is-not-equal-to-the-previous-number
// https://stackoverflow.com/questions/15585216/how-to-randomly-generate-numbers-without-repetition-in-javascript

// random interval
// set timeout but this increases as interval increases
// this means clear square in tick cannot be used? put it in... timout?


// functions for each object?
// functions for each level? sdmfnsdjkfsdjkfsdkjflk

// KIV to do later
// separate score and health. score only adds, health deducts and adds (when a health spawns occasionally)
// default health 1000? which is also the max health. 
// press numpad 0 to start game

// spawnFly(), spawnFlyRoach(), spawnFlyRoachTrap(), spawnFlyRoachTrapNum()
// spawnFly(), spawnRoach(), spawnTrap(), spawnNum()
// randomise the functions in gamestart depending on score at current point in game



