/*
  Simon Game - Free Code Camp Zipline
*/

/* USER STORIES
User Story: As a user, I am presented with a random series of button presses.
User Story: As a user, each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.
User Story: As a user, I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.
User Story: As a user, if I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.
User Story: As a user, I can see how many steps are in the current series of button presses.
Bonus User Story: As a user, if I want to restart, I can hit a button to do so, and the game will return to a single step.
Bonus User Story: As a user, I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.
Bonus User Story: As a user, the tempo of the game speeds up incrementally on the 5th, 9th and 13th step.
Bonus User Story: As a user, I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.
*/

// jQuery
$('#element0').on('click', function() {
  simonGame.processUserClick(0);
});
$('#element1').on('click', function() {
  simonGame.processUserClick(1);
});
$('#element2').on('click', function() {
  simonGame.processUserClick(2);
});
$('#element3').on('click', function() {
  simonGame.processUserClick(3);
});
$('#play').on('click', function() {
  simonGame.displaySeries();
});
$('#reset').on('click', function() {
  simonGame.restartGame();
});
$('#new').on('click', function() {
  simonGame.restartGame();
  simonGame.displaySeries();
});

$('#info-btn').on('click', function() {
  $('#info-panel').toggle();
});
$('#info-panel').on('click', function() {
  $('#info-panel').toggle();
});

// Speed mode slider
$('#speed-toggle').toggles({
  width: 40,
  height: 35,
  text: {
    on: 'ON',
    off: 'OFF'
  }
});

// Toggle the speed mode (1 is on, 0 is off)
$('#speed-toggle').on('toggle', function (e, active) {
  if (active) {
    simonGame.toggleSpeedMode(1);
  } else {
    simonGame.toggleSpeedMode(0);
  }
});

// Hard mode slider
$('#hard-toggle').toggles({
  width: 40,
  height: 35,
  text: {
    on: 'ON',
    off: 'OFF'
  }
});

// Toggle the hard mode (1 is on, 0 is off)
$('#hard-toggle').on('toggle', function (e, active) {
  if (active) {
    simonGame.toggleHardcoreMode(1);
  } else {
    simonGame.toggleHardcoreMode(0);
  }
});


// select view elements
var displayFeedback = document.getElementById('feedback');
var displayStage = document.getElementById('stage');

// sounds
var sound = new Audio();

// Game settings and parameters
var SERIES_LENGTH = 20;
var DELAY1 = 1000;
var DELAY2 = 2000;
var SPEED = 1000;
// set the speed increase on given stages
var SPEED_MULTIPLIER = 0.85;
// set on which stages to increase the speed
var speedUp = [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
// text settings and feedback of the UI
var textFeedback = {
  correct: 'Good so far, keep going.',
  gameOver: 'Wrong, GAME OVER! You can start a new game.',
  nextRound: 'Correct! Next round.',
  round: 'Displaying round: ',
  win: 'You have WON, congratulations!',
  wrong: 'Wrong, please try again.'
}

// Create an instance of the game
var simonGame = new Game();

/*
  Game object
*/
function Game () {
  var gameActive; // track if game is active
  var gameSeries = []; // array with the game sequence
  var gameStage; // track stage of the game (round)
  var clickStage;  // track user clicks on a given guess round
  var feedback; // string with feedback for user displayed in the view
  var speedIncrease; // track the current speed increase
  var speedModeActive; // track if speed mode is active
  var hardcoreModeActive; // track if hardcore mode is active (reset the game after a single mistake)
}

/*
  Generate an array of random numbers. The range of the numbers
  is defined in generateRandomNumber method.
*/
Game.prototype.generateSeries = function () {
  for (var i = SERIES_LENGTH; i > 0; i--) {
    gameSeries.push(this.generateRandomNumber());
  }
};

/*
  Increment the gameStage
*/
Game.prototype.updateGameStage = function () {
  gameStage += 1;
};


/*
 Display the series of elements according to current gameStage.
*/
Game.prototype.displaySeries = function () {
  var tracker = 0;
  gameActive = false;
  feedback = textFeedback.round + gameStage;
  this.updateView();
  for (var i = gameStage; i > 0; i--) {
    var element = gameSeries[tracker];
    this.displayElement(element, tracker);
    tracker += 1;
  }
  // make the game active after series display is finished
  setTimeout(function() {
    gameActive = true;
  }, SPEED * speedIncrease * tracker);
}

/*
  Handle the display and sound of the current element
  in the series
*/
Game.prototype.displayElement = function (element, tracker) {
    setTimeout(function() {
      sound.src = 'http://wojtekmurawski.me/memo/sounds/animal_short' + element + '.wav';
      sound.volume = .3;
      sound.play();
      var id = '#' + element;
      $('#element' + element).effect('shake', {direction:"right", times:3, distance:1} ,50);
    }, SPEED * speedIncrease * tracker);
};

/*
  Process user click on element and updates the state of the game.
*/
Game.prototype.processUserClick = function (number) {
  // animation and sound of the clicked element
  if (gameActive) {
    this.displayElement(number);
    if (this.checkUserAnswer(number)) {
      // increase the speed
      if (speedModeActive && speedUp[gameStage]) {
        this.increaseSpeed(SPEED_MULTIPLIER);
      }
      // if last element of the current stage,
      if (gameStage === clickStage + 1 ) {
        if (gameStage === SERIES_LENGTH) {
          feedback = textFeedback.win;
          this.updateView();
        } else {
          feedback = textFeedback.nextRound;
          this.updateGameStage();
          this.resetClickStage();
          this.updateView();
          gameActive = false;
          game = this;
          setTimeout(function() {
              game.displaySeries();
              game.gameActive = true;
          }, DELAY2)
        }
      } else {
        // if not the last element update click counter
        feedback = textFeedback.correct;
        this.updateClickStage();
        this.updateView();
      }
    } else {
      // hardcore mode mistake (game over)
      if (hardcoreModeActive) {
        this.restartGame();
        feedback = textFeedback.gameOver
        this.updateView();
      // normal mode mistake (reset clicks and display current round again)
      } else {
        feedback = textFeedback.wrong
        this.resetClickStage();
        this.updateView();
        game = this;
        // display series again with a delay
        gameActive = false;
        setTimeout(function() {
            game.displaySeries();
            game.gameActive = true;
        }, DELAY2);
      }
    }
  }
};

/*
  Increment the click stage tracker
*/
Game.prototype.updateClickStage = function () {
  clickStage +=1;
};

/*
  Reset the click stage tracker
*/
Game.prototype.resetClickStage = function () {
  clickStage = 0;
};

/*
  Check if the element clicked matches a corresponding element in
  the game series array
*/
Game.prototype.checkUserAnswer = function (elementClicked) {
  if (elementClicked === gameSeries[clickStage]) {
    return true;
  } else {
    return false;
  }
};

/*
  Restart the game object.
*/
Game.prototype.restartGame = function () {
  gameActive = false;
  gameSeries = [];
  gameStage = 1;
  clickStage = 0;
  feedback = '';
  speedIncrease = 1;
  // Wire up the sliders with settings
  var speedToggle = $('#speed-toggle').data('toggles');
  speedModeActive = speedToggle.active;
  var hardToggle = $('#hard-toggle').data('toggles');
  hardcoreModeActive = hardToggle.active;
  this.generateSeries();
  this.updateView();
};

/*
  Update the DOM
*/
Game.prototype.updateView = function () {
  displayFeedback.innerHTML = feedback;
  displayStage.innerHTML = '<strong>' + gameStage + '</strong>';
};

/*
  Generate random number between 0 and 4.
*/
Game.prototype.generateRandomNumber = function () {
  return Math.floor(Math.random() * 3.99);
};

/*
  Increase the speed of the game by a given multiplier
*/
Game.prototype.increaseSpeed = function (multiplier) {
  speedIncrease = multiplier;
};

/*
  Toggle the hardcore mode
*/
Game.prototype.toggleHardcoreMode = function (toggle) {
  if (toggle === 1) {
    hardcoreModeActive = true;
  } else {
    hardcoreModeActive = false;
  }
};

/*
  Toggle the speed up mode
*/
Game.prototype.toggleSpeedMode = function (toggle) {
  if (toggle === 1) {
    speedModeActive = true;
  } else {
    speedModeActive = false;
  }
};

// display modes (for debugging)
Game.prototype.displaySpeedMode = function () {
  console.log(speedModeActive);
};

Game.prototype.displayHardMode = function () {
  console.log(hardcoreModeActive);
};
