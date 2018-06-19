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
	image: './assets/trap.png'
}

var NUM = {
	points: 30,
	nums: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
}

var THRESHOLD_ROACH = 100;
var THRESHOLD_TRAP = 350;
var THRESHOLD_NUM = 500;

var MISS_SCORE = 50;
var TIMEOUT_PENALTY = 50;
var scoreBox = document.getElementById('score-box');
var maxScoreBox = document.getElementById('max-score');
var topScoreBox = document.getElementById('top-score');
scoreBox.innerHTML = 'Score: ' + 0;
maxScoreBox.innerHTML = 'Max score: ' + 0;
topScoreBox.innerHTML = 'Top score: ' + 0;

var score = 0;
var maxScore = 0;
var topScore = 0;
var currentSquares = [];

var SHOW_FLY = 1, SHOW_ROACH = 2, SHOW_TRAP = 3, SHOW_NUM = 4;
var showState = 0;

var numArr = [ undefined, document.getElementById('num1'), document.getElementById('num2'), 
				document.getElementById('num3'), document.getElementById('num4'), document.getElementById('num5'), 
				document.getElementById('num6'), document.getElementById('num7'), document.getElementById('num8'), 
				document.getElementById('num9') ];

var startBlinker = document.getElementById('blinker');

var timeout = 2000, gameOverBool = true, keyPressed = false;

function keydownFunction(event) { 
	var key = parseInt(event.keyCode);
	if (key > 47 && key < 58) {
		key -= 48;
	} else if (key > 95 && key < 106) {
		key -= 96;
	}
	keyPress(key); 
}; // register the keypress event

document.onkeydown = keydownFunction;

function tick() { // generates a random object on a random square
	if (!keyPressed) { // if no key was pressed,
		if (stickyTrapMiss()) { // and it wasn't a sticky trap that spawned,
			score -= TIMEOUT_PENALTY; // points are deducted
		}
	}
	scoreBox.innerHTML = 'Score: ' + score;
	if (score < 0) {
		gameOver();
		return;
	}
	keyPressed = false;
    if (adjustState()) {
    	showPopup();
        return;
    }
    spawn();
    if (showState == SHOW_NUM) {
        timeout = timeout - 10;
    }
    setTimeout(tick, timeout);
    // equivalently you can write 
    // if ( !adjustState() ) {
    //     spawn();
    //     if (showState == SHOW_NUM) {
    //         timeout = timeout - 10;
    //     }
    //     setTimeout(tick, timeout);
    // }
} 
// in adjustState, you can now call the function that shows the information popup, whenever a state is changed.
// either starting a timer to a function that will close the popup and restart the game (by calling tick)
// or restarting the game (by calling tick) when the popup is closed

function gameStart() {
	startBlinker.style.visibility = 'hidden';
	timeout = 2000; // takes the game back to original speed
	score = 0; maxScore = 0; showState = 1;
    scoreBox.innerHTML = 'Score: ' + score; // reset score box
    maxScoreBox.innerHTML = 'Max score: ' + score;
    gameOverBool = false;

	keyPressed = true; // when game starts, it ticks for a new fly, but no key has been pressed yet, if keypressed isn't true, game would deduct the penalty
	showPopup();
}

function keyPress(key) {
	if (gameOverBool) {
        if (key === 0) {
            gameStart();
		}	
		return;
	}	
	if (key < 1 || key > 9) {
		return;
	}
    keyPressed = true;
	var index = indexOfKeyPress(key);
	if (index != -1) {
        var currentSquare = currentSquares[index];
    	if (currentSquare.whacks == 2) { // to know if spawn is a cockroach, which needs 2 whacks
    		currentSquare.whacks = 1;
            var numDiv = numArr[currentSquare.square];
            var imagesArr = numDiv.getElementsByTagName('img'); // changes 2nd whack image
            var image = imagesArr[0];
            image.src = ROACH.images[1];
    	} else {
    		score += currentSquare.points;
    		if (maxScore < score) {
    			maxScore = score;
    		}
    		if (maxScore > topScore) {
    			topScore = maxScore;
    		}
			numArr[currentSquare.square].innerHTML = ''; // - clear the content of the current square
			currentSquares.splice(index, 1); // removes square from array
        }
    } else {
    	score -= MISS_SCORE; // deduct score
    }
	scoreBox.innerHTML = 'Score: ' + score;
	maxScoreBox.innerHTML = 'Max score: ' + maxScore;
	topScoreBox.innerHTML = 'Top score: ' + topScore;
}

function stickyTrapMiss() { // for when if only traps spawn and no key is pressed. miss score won't deduct
	// function searches for positive points inside currentSquares and returns a boolean
	for (var i = 0; i < currentSquares.length; i++) {
		if (currentSquares[i].points > 0) {
			return true;
		}
	}
	return false;
}

// 1) var points = -1; is never used, and ,
// 2) if the function never finds any positive points it also needs to return something

function indexOfKeyPress(key) {
    // function finds key in currentSquares. return index of the key
    var idx = -1;
    for (var i = 0; i < currentSquares.length; i++) {
    	if (currentSquares[i].key == key) {
            if (currentSquares[i].points > 0) {
                return i;
            } else {
                idx = i;
            }
    	}
    }
    return idx;
}
// to address the issue of sticky trap landing on a num's square
// if no key is found, the function will still return -1 as before
// if a key is found, it will check the points, if they are positive, it will just immediately return that index,
// if the points are negative, we remember the index i in the var index and keep looking
// if we never find another index with the same key and positive points,
// that means the index of the negative points will be returned


function gameOver() {
	gameOverBool = true;
    alert("Game Over");
    startBlinker.style.visibility = '';
}

function spawn() {
    clearAllSquares();

    var numOfSpawns = Math.floor(Math.random() * 3) + 1; // randomly generates 1-3 spawns each time
    for (var i = 0; i < numOfSpawns; i++) {
        var randomSpawn = Math.floor(Math.random() * showState); // randomly picks spawns taking into consideration the showState
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
    randomImageFlip(numArr[squareNumber]);
}

function spawnROACH() {
	var squareNumber = newRandomSquareNumber();
    var currentSquare = {square: squareNumber, points: ROACH.points, whacks: 2, key: squareNumber};
	currentSquares.push(currentSquare);
    var image = document.createElement('img');
    image.src = ROACH.images[0];
    numArr[squareNumber].appendChild(image);
    randomImageFlip(numArr[squareNumber]);
}

function spawnTRAP() {
	var squareNumber = newRandomSquareNumber();
	numArr[squareNumber].style.transform = ''; // resets a flipped square
    var currentSquare = {square: squareNumber, points: TRAP.points, whacks: 0, key: squareNumber};
	currentSquares.push(currentSquare);
    var image = document.createElement('img');
    image.src = TRAP.image;
    numArr[squareNumber].appendChild(image);
}

function spawnNUM() {
	var squareNumber = newRandomSquareNumber();
	numArr[squareNumber].style.transform = ''; // resets a flipped square
	var num = Math.floor(Math.random() * 9) + 1;
	var currentSquare = {square: squareNumber, points: NUM.points, whacks: 1, key: num};
	currentSquares.push(currentSquare);    
	numArr[squareNumber].innerHTML = num;
}

var spawnArr = [spawnFLY, spawnROACH, spawnTRAP, spawnNUM];


function clearAllSquares() {
	for (var i = 0; i < currentSquares.length; i++) {
		numArr[currentSquares[i].square].innerHTML = '';
	}
    currentSquares = []; // empty the array
}

function adjustState() {
	switch (showState) {
		case SHOW_FLY: // spawns fly only
			if (score > THRESHOLD_ROACH) {
				showState = SHOW_ROACH;
				return true;
			}
			break;
		case SHOW_ROACH: // spawns fly and roach
			if (score > THRESHOLD_TRAP) {
				showState = SHOW_TRAP;
				return true;
			}
			break;
		case SHOW_TRAP: // spawns fly and roach and num
			if (score > THRESHOLD_NUM) {
				showState = SHOW_NUM;
				return true;
			}
			break;
	}
	return false;
}

function squareAlreadyTaken(square) { // prevents spawning on an already occupied square
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

function randomImageFlip(square) {
	var rif = Math.floor(Math.random() * 5) + 1;
	if (rif == 2) {
		square.style.transform = 'scaleY(-1)'; // flips the image
	} else if (rif == 3) {
		square.style.transform = 'rotate(90deg)';
	} else if (rif == 4) {
		square.style.transform = 'rotate(-90deg)';
	} else if (rif == 5) {
		square.style.transform = 'rotate(180deg)';
	} else {
		square.style.transform = '';
	}
}	


function showPopup() {
	// tick();
	// return;
    var popup;
	if (showState == SHOW_FLY) {
		popup = document.getElementById('modal-fly');
	} else if (showState == SHOW_ROACH) {
        popup = document.getElementById('modal-roach');
	} else if (showState == SHOW_TRAP) {
        popup = document.getElementById('modal-trap');
	} else if (showState == SHOW_NUM) {
        popup = document.getElementById('modal-num');
	}
    popup.classList.toggle('modal');
    popup.classList.toggle('modal-open');
	setTimeout( function() { hidePopup(popup); } , 2500);
}

function hidePopup(popup) {
    popup.classList.toggle('modal-open');
    popup.classList.toggle('modal');
	tick();
}



