const readline = require('readline-sync');

function createPlayer() {
  return {
    move: null,
  };
}

function createComputer() {
  let playerObject = createPlayer();
  let computerObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    },
  };
  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, or scissors:');
        choice = readline.question();
        if (['rock', 'paper', 'scissors'].includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
    },
  };
  return Object.assign(playerObject, humanObject);
}

/*
function createMove() {
  return {
    // possible state: type of move (paper, rock, scissors)
  };
}

function createRule() {
  return {
    // possible state? not clear whether Rules need state
  };
}

// Since we don't yet know where to put `compare`, let's define
// it as an ordinary function.
let compare = function(move1, move2) {
  // not yet implemented
};
*/

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  score: {human: 0, computer: 0},
  moveHistory: {human: [], computer: []},

  displayWelcomeMessage() {
    console.log('Welcome to Rock, Paper, Scissors!');
  },
  displayGoodbyeMessage() {
    if (this.score.human > 4) {
      console.log('You have won the match! You are the Grand Champion!');
    } else console.log('Computer has won the match. Better luck next time, champ.');
    console.log('Thanks for playing Rock, Paper, Scissors. Goodbye!');
  },
  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    console.log(`You chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}`);
    if ((humanMove === 'rock' && computerMove === 'scissors') ||
      (humanMove === 'paper' && computerMove === 'rock') ||
      (humanMove === 'scissors' && computerMove === 'paper')) {
      this.score.human += 1;
      console.log('You Win!');
    } else if ((humanMove === 'rock' && computerMove === 'paper') ||
             (humanMove === 'paper' && computerMove === 'scissors') ||
             (humanMove === 'scissors' && computerMove === 'rock')) {
      this.score.computer += 1;
      console.log('Computer Wins!');
    } else {
      console.log("It's a tie");
    }
  },
  displayScore() {
    console.log(`Player: ${this.score.human}, Computer: ${this.score.computer}`);
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.human.choose();
      this.moveHistory.human.push(this.human.move);
      this.computer.choose();
      this.moveHistory.computer.push(this.computer.move);
      console.log(this.moveHistory);
      this.displayWinner();
      this.displayScore();
      if (this.score.human > 4 || this.score.computer > 4) break;
    }
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();