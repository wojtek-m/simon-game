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
$('#0').on('click', function() {
  simonGame.processUserClick(0);
});
$('#1').on('click', function() {
  simonGame.processUserClick(1);
});
$('#2').on('click', function() {
  simonGame.processUserClick(2);
});
$('#3').on('click', function() {
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


// Game settings and parameters
var SERIES_LENGTH = 20;
var DELAY1 = 1000;
var SPEED1 = 500;

// Create an instance of the game
var simonGame = new Game();

/*
  Game object
*/
function Game () {
  this.gameActive = false;
  this.gameSeries = [];
  this.gameStage = 1;
  this.clickStage = 0;
}

/*
  Generate an array of random numbers. The range of the numbers
  is defined in generateRandomNumber method.
*/
Game.prototype.generateSeries = function () {
  for (var i = SERIES_LENGTH; i > 0; i--) {
    this.gameSeries.push(this.generateRandomNumber());
  }
};

/*
  Increment the gameStage
*/
Game.prototype.updateGameStage = function () {
  this.gameStage += 1;
};


/*
 Display the series of elements according to current gameStage.
*/
Game.prototype.displaySeries = function () {
  var tracker = 0;
  for (var i = this.gameStage; i > 0; i--) {
    var element = this.gameSeries[tracker];
    var activeElement = document.getElementById('' + element  + '');
    this.displayElement(activeElement, element, tracker);
    tracker += 1;
  }
  this.gameActive = true;
}

/*
  Handle the display and sound of the current element
  in the series
*/
Game.prototype.displayElement = function (activeElement, element, tracker) {
    setTimeout(function() {
      activeElement.innerHTML = 'XX' + element + 'XX';
      console.log(activeElement);
    }, SPEED1 * tracker);
};

/*
  Process user click on element and updates the state of the game.

*/
Game.prototype.processUserClick = function (number) {
  if (this.gameActive && this.clickStage === this.gameStage && this.clickStage > 1) {
    // TODO display positive feedback cue on the screen
    this.updateGameStage();
    this.gameActive = false;
    this.resetClickStage();
  // game is active
  } else if (this.gameActive) {
    // user clicked the correct element
    if (this.checkUserAnswer(number)) {
      // if last element of the current stage,
      if (this.gameStage === this.clickStage + 1 ) {
        this.updateGameStage();
        this.resetClickStage();
        game = this;
        setTimeout(function() {
            game.displaySeries();
        }, DELAY1)
      } else {
        // if not the last element update click counter
        this.updateClickStage();
      }
      console.log('good click');
      console.log('ClickStage: ' + this.clickStage);
      console.log('GameStage: ' + this.gameStage);
    } else {
      console.log('bad click');
      console.log('ClickStage: ' + this.clickStage);
      console.log('GameStage: ' + this.gameStage);
      // TODO display an error
      // reset click stage
    }
  } else {
    console.log('game inactive');
  }
};

// game.UpdateClickStage - increment the click stage tracker (this may
// be better to do in jQuery on the client side and pass the stage as
// a integer to CheckUserAnswer funtion)
Game.prototype.updateClickStage = function () {
  this.clickStage +=1;
};

Game.prototype.resetClickStage = function () {
  this.clickStage = 0;
};

// game CheckUserAnswer - function called on each click to check if the
// element clicked matches the element in the game series array
Game.prototype.checkUserAnswer = function (elementClicked) {
  if (elementClicked === this.gameSeries[this.clickStage]) {
    return true;
  } else {
    return false;
  }
};

// game.RestartGame - set and restart the game object
Game.prototype.restartGame = function () {
  this.gameActive = false;
  this.gameSeries = [];
  this.gameStage = 1;
  this.clickStage = 0;
  this.generateSeries();
  console.log('restart');
};
/*
  Generate random number between 0 and 4
*/
Game.prototype.generateRandomNumber = function () {
  return Math.floor(Math.random() * 3.99);
};

// game.ChangeSpeed - increases the speed of the game on certain stages
