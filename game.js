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

var simonGame = new Game();

// Create a game object
function Game () {
  this.gameSeries = [];
  this.gameStage = 5;
  this.clickStage = 0;
}

// game.GenerateSeries - function creating an array of 20 random
// numbers in the range of 1-4
Game.prototype.generateSeries = function () {
  for (var i = 20; i > 0; i--) {
    var randomNum = Math.floor(Math.random() * 3.99);
    this.gameSeries.push(this.generateRandomNumber());
  }
};

// game.UpdateGameStage - increment the game stage tracker
Game.prototype.updateGameStage = function () {
  this.gameStage += 1;
};


// game.DisplaySeries - displays the pattern of the current stage to the user
Game.prototype.displaySeries = function () {
  var tracker = 0;

  for (var i = this.gameStage; i > 0; i--) {
    var element = this.gameSeries[tracker];
    var activeElement = document.getElementById('' + element  + '');
    this.displayElement(activeElement, element, tracker);
    tracker += 1;
  }
}

Game.prototype.displayElement = function (activeElement, element, tracker) {
    setTimeout(function() {
      activeElement.innerHTML = 'XX' + element + 'XX';
      console.log(activeElement);
    }, 2000 * tracker);
};

// game.UpdateClickStage - increment the click stage tracker (this may
// be better to do in jQuery on the client side and pass the stage as
// a integer to CheckUserAnswer funtion)
Game.prototype.updateClickStage = function () {
  this.clickStage +=1;
};

// game CheckUserAnswer - function called on each click to check if the
// element clicked matches the element in the game series array
Game.prototype.checkUserAnswer = function (elementClicked) {
  if (elementClicked === this.gameSeries[this.gameStage]) {
    return true;
  } else {
    return false;
  }
};

// game.RestartGame - set and restart the game object
Game.prototype.restartGame = function () {
  this.gameSeries = [];
  this.gameStage = 1;
  this.clickStage = 0;
};
/*
  Generate random number between 0 and 4
*/
Game.prototype.generateRandomNumber = function () {
  return Math.floor(Math.random() * 3.99);
};

// game.ChangeSpeed - increases the speed of the game on certain stages
