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


// select view elements
var feedback = document.getElementById('feedback');

// sounds
var sound = new Audio();

// Game settings and parameters
var SERIES_LENGTH = 20;
var DELAY1 = 1000;
var DELAY2 = 2000;
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
  this.feedback = '';
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
    //var activeElement = document.getElementById('' + element  + '');
    this.displayElement(element, tracker);
    tracker += 1;
  }
  this.gameActive = true;
}

/*
  Handle the display and sound of the current element
  in the series
*/
Game.prototype.displayElement = function (element, tracker) {
    setTimeout(function() {
      sound.src = 'https://s3.amazonaws.com/freecodecamp/simonSound' + (element + 1) + '.mp3';
      sound.play();
      var id = '#' + element;
      $('#element' + element).effect('shake', {direction:"right", times:3, distance:1} ,50);
    }, SPEED1 * tracker);

};

/*
  Process user click on element and updates the state of the game.
*/
Game.prototype.processUserClick = function (number) {
  // animation and sound of the clicked element
  this.displayElement(number);
  if (this.gameActive) {
    if (this.checkUserAnswer(number)) {
      // if last element of the current stage,
      if (this.gameStage === this.clickStage + 1 ) {
        this.feedback = 'Correct! Next round.';
        this.updateView();
        this.updateGameStage();
        this.resetClickStage();
        this.gameActive = false;
        game = this;
        setTimeout(function() {
            game.displaySeries();
            game.gameActive = true;
        }, DELAY2)
      } else {
        // if not the last element update click counter
        this.feedback = 'Correct!';
        this.updateClickStage();
        this.updateView();
      }
      console.log('good click');
      console.log('ClickStage: ' + this.clickStage);
      console.log('GameStage: ' + this.gameStage);
    } else {
      console.log('bad click');
      console.log('ClickStage: ' + this.clickStage);
      console.log('GameStage: ' + this.gameStage);
      this.feedback = 'Wrong, please try again.'
      this.resetClickStage();
      this.updateView();
    }
  } else {
    console.log('game inactive');
  }
};

/*
  Increment the click stage tracker
*/
Game.prototype.updateClickStage = function () {
  this.clickStage +=1;
};

/*
  Reset the click stage tracker
*/
Game.prototype.resetClickStage = function () {
  this.clickStage = 0;
};

/*
  Check if the element clicked matches a corresponding element in
  the game series array
*/
Game.prototype.checkUserAnswer = function (elementClicked) {
  if (elementClicked === this.gameSeries[this.clickStage]) {
    return true;
  } else {
    return false;
  }
};

/*
  Restart the game object.
*/
Game.prototype.restartGame = function () {
  this.gameActive = false;
  this.gameSeries = [];
  this.gameStage = 1;
  this.clickStage = 0;
  this.feedback = '';
  this.generateSeries();
  this.updateView();
  console.log('restart');
};

/*
  Update the DOM
*/
Game.prototype.updateView = function () {
  feedback.innerHTML = this.feedback;
};

/*
  Generate random number between 0 and 4.
*/
Game.prototype.generateRandomNumber = function () {
  return Math.floor(Math.random() * 3.99);
};

// game.ChangeSpeed - increases the speed of the game on certain stages
