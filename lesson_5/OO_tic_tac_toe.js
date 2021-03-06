let readline = require("readline-sync");

class Square {
  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }

  getMarker() {
    return this.marker;
  }
}

Square.UNUSED_SQUARE = " ";
Square.HUMAN_MARKER = "X";
Square.COMPUTER_MARKER = "O";

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; ++counter) {
      this.squares[String(counter)] = new Square();
    }
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
    console.log("     |     |");
    console.log("");
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }

  displayWithClear() {
    console.clear();
    console.log("");
    console.log("");
    this.display();
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
    this.wins = 0;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

  play() {
    this.displayWelcomeMessage();
    let firstMove = this.humanFirstMove
    console.log(firstMove);
    this.board.display();
    while (true) {
      this.firstMove();
      this.board.displayWithClear();
      this.updateScore();
      this.displayScore();
      this.displayResults();
      this.board = new Board();
      this.incrementGamesPlayed();
      if (this.endMatch() || !this.playAgain()) break;
    }
    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
    console.log("");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${this.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let choice = this.computerMove(this.computer);
    
    if (!choice) {
      choice = this.computerMove(this.human);
    }
    
    if (!choice) {
      choice = this.pickCenterSquare();
    }
    
    if (!choice) {
      choice = this.randomChoice();
    }
      
    
    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }
  
  joinOr(choices, separator = ', ', conjunction = 'or') {
    if (choices.length === 1) {
      return choices[0].toString();
    }  else if (choices.length === 2) {
      return `${choices[0]} ${conjunction} ${choices[1]}`;
    } else {
      let lastChoice = choices[choices.length - 1];
      let result = choices.slice(0, -1).join(separator);
      return `${result}${separator}${conjunction} ${lastChoice}`;
    }
  }
  
  playAgain() {
    let prompt = 'Do you want to play again? y or n: ';
    let choice;
    while (true) {
      choice = readline.question(prompt);
      if (choice.toLowerCase() === 'y' || choice.toLowerCase() === 'n') break;
      else  {
        console.log("Sorry, that's not a valid choice.");
        console.log("");
      }
    }
    if (choice.toLowerCase() === 'n') return null;
    else return true;
  }
  
  randomChoice() {
    let validChoices = this.board.unusedSquares();
    let choice;
    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));
    return choice;
  }
  
  computerMove(player) {
    let almostWinRows = TTTGame.POSSIBLE_WINNING_ROWS.filter(row => {
      return this.board.countMarkersFor(player, row) === 2;
    });
    
    if (almostWinRows.length > 0) {
      let potentialWinningSpotsArray = [];
      almostWinRows.forEach(row => {
        let potentialWinningSpot = row.find(element => this.board.unusedSquares().includes(element));
        potentialWinningSpotsArray.push(potentialWinningSpot);
      });
      
      if (potentialWinningSpotsArray.length > 0) {
        let winningSpot = potentialWinningSpotsArray.find(element => element !== undefined);
        return winningSpot;
      } else return null;
    } else return null;
  }
  
  pickCenterSquare() {
    return this.board.unusedSquares().includes('5') ? '5' : null;
  }
  
  displayScore() {
    console.log(`Human Score: ${this.human.wins}`);
    console.log(`Computer Score: ${this.computer.wins}`);
  }
  
  updateScore() {
    if (this.isWinner(this.human)) {
      this.human.wins += 1;
    } else if (this.isWinner(this.computer)) {
      this.computer.wins += 1;
    }
  }
  
  endMatch() {
    if (this.human.wins === 3 || this.computer.wins === 3) {
      return true;
    }
  }
  
  humanFirstMove() {
    while (true) {
      this.humanMoves();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;
      this.board.display();
    }
  }
  
  computerFirstMove() {
    while (true) {
      this.computerMoves();
      if (this.gameOver()) break;
      this.board.display()
      
      this.humanMoves();
      if (this.gameOver()) break;
    }
  }
  
  firstMove() {
    if (TTTGame.GAMES_PLAYED % 2 === 0) {
      this.humanFirstMove();
    } else this.computerFirstMove();
  }
  
  incrementGamesPlayed() {
    TTTGame.GAMES_PLAYED += 1;
  }
}

TTTGame.POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];

TTTGame.GAMES_PLAYED = 0;
let game = new TTTGame();
game.play();