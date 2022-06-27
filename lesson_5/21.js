const shuffle = require('shuffle-array');
const readline = require("readline-sync");

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  getCard() {
    return [this.suit, this.value];
  }
}

Card.SUITS = ['C', 'D', 'H', 'S'];
Card.VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

class Deck {
  constructor() {
    this.cards = [];
    Card.SUITS.forEach(element1 => {
      Card.VALUES.forEach(element2 => {
        let card = new Card(element1, element2).getCard();
        this.cards.push(card);
      });
    });
  }

  getDeck() {
    return this.cards;
  }

  shuffleDeck() {
    shuffle(this.cards);
  }

  dealOneCard(player) {
    //STUB
    // does the dealer or the deck deal?
    let dealtCard = this.cards.shift();
    player.hand.push(dealtCard);
  }

  dealTwoCards(player) {
    //STUB
    // does the dealer or the deck deal?
    for (let idx = 0; idx < 2; idx++) {
      let dealtCard = this.cards.shift();
      player.hand.push(dealtCard);
    }
  }

}


class Participant {
  constructor() {
    //STUB
    // What sort of state does a participant need?
    // Score? Hand? Amount of money available?
    // What else goes here? all the redundant behaviors from Player and Dealer?
    this.hand = [];
    this.score = 0;
  }

  isBusted() {
    //STUB
    return this.score > 21;
  }

  getScore() {
    return this.score;
  }

  calculateInitialScore() {
    this.hand.forEach(card => {
      let cardValue = card[1];
      if (cardValue === 'J' ||
          cardValue === 'Q' ||
          cardValue === 'K') {
        this.score += 10;
      } else if (cardValue === 'A') this.score += 11;
      else (this.score += Number(cardValue));
    });

    // double aces for inital deal case;
    if (this.score === 22) {
      this.score -= 10;
    }
  }

  updateScore() {
    //STUB
    let lastCardinHand = this.hand[this.hand.length - 1][1];
    while (true) {
      if (lastCardinHand === 'J' ||
          lastCardinHand === 'Q' ||
          lastCardinHand === 'K'
      ) {
        this.score += 10;
        break;
      }

      if (lastCardinHand === 'A') {
        if (this.checkAces()) {
          this.score += 1;
          break;
        } else {
          this.score += 11;
          break;
        }
      }

      this.score += Number(lastCardinHand);
      break;
    }
  }

  checkAces() {
    let previousHand = this.hand.slice(0, this.hand.length - 1);
    for (let idx = 0; idx < previousHand.length; idx++) {
      if (previousHand[idx].includes('A')) return true;
    }
    return false;
  }

  getCardValuesInHand() {
    let cardValuesInHand = [];
    this.hand.forEach(card => cardValuesInHand.push(card[1]));
    return cardValuesInHand;
  }

  resetHand() {
    this.hand = [];
  }

  resetScore() {
    this.score = 0;
  }
}

class Player extends Participant {
  constructor() {
    super();
    this.money = 5;
  }

  getMoney() {
    return this.money;
  }
}

class Dealer extends Participant {
  // Very similar to a Player; do we need this?
  constructor() {
    //STUB
    // What sort of state does a dealer need?
    // Score? Hand? Deck of cards? Bow tie?
    super();
  }
}

Dealer.MAXIMUM_SCORE = 17;

class TwentyOneGame {
  constructor() {
    //STUB
    // What sort of state does the game need?
    // A deck? Two participants?
    this.deck = new Deck();
    this.dealer = new Dealer();
    this.player = new Player();
  }

  start() {
    //SPIKE
    while (true) {
      this.displayWelcomeMessage();
      this.deck.shuffleDeck();
      this.dealCards();
      this.player.calculateInitialScore();
      this.dealer.calculateInitialScore();
      while (true) {
        this.displayCardsAndScorePlayerTurn();
        this.playerTurn();
        if (this.player.isBusted()) break;

        this.displayCardsAndScoreDealerTurn();
        this.dealerTurn();
        if (this.dealer.isBusted()) break;
        break;
      }
      this.displayResultAndExchangeMoney();
      if (!this.playAgain() ||
          this.player.getMoney() === 0 ||
          this.player.getMoney() === 10) break;
      else this.resetDeckAndClearHands();
    }
    this.displayGoodbyeMessage();
  }

  dealCards() {
    this.deck.dealTwoCards(this.player);
    this.deck.dealTwoCards(this.dealer);
  }

  playerTurn() {
    let choice;
    while (true) {
      let prompt = 'hit or stay: ';
      choice = readline.question(prompt);
      if (choice === 'hit') {
        this.deck.dealOneCard(this.player);
        this.player.updateScore();
        this.displayCardsAndScorePlayerTurn();
        if (this.player.isBusted()) break;
      } else if (choice === 'stay') break;
      else console.log('Sorry, invalid input. Please try again');
    }
  }

  displayCardsAndScorePlayerTurn() {
    console.log(`Player has: ${this.joinAnd(this.player.getCardValuesInHand())}`);
    console.log(`Dealer has: ${this.dealer.getCardValuesInHand()[0]} and Unknown`);
    console.log(`Player score is: ${this.player.getScore()}`);
    console.log('');
  }

  dealerTurn() {
    while (this.dealer.getScore() < Dealer.MAXIMUM_SCORE) {
      this.deck.dealOneCard(this.dealer);
      this.dealer.updateScore();
      this.displayCardsAndScoreDealerTurn();
      if (this.dealer.isBusted()) break;
    }
  }

  displayCardsAndScoreDealerTurn() {
    console.log(`Dealer has: ${this.joinAnd(this.dealer.getCardValuesInHand())}`);
    console.log(`Dealer score is: ${this.dealer.getScore()}`);
    console.log('');
  }

  displayWelcomeMessage() {
    console.log('Welcome to Twenty One!');
    console.log('');
  }

  displayGoodbyeMessage() {
    if (this.player.getMoney() === 10) console.log(`Woohoo! You doubled your money!`);
    else if (this.player.getMoney() > 5) console.log(`Let's Go! You won ${this.player.getMoney() - 5} dollar(s)!`);
    else if (this.player.getMoney() < 5) console.log(`Darn! You lost ${5 - this.player.getMoney()} dollar(s)!`);
    else if (this.player.getMoney() === 5) console.log(`You didn't win or lose any money! Did you even play??`);
    if (this.player.getMoney() === 0) console.log(`Oh no! You lost all your money!`);
    console.log('Thanks for playing!');
  }

  displayResultAndExchangeMoney() {
    while (true) {
      if (this.player.isBusted()) {
        console.log('Player Busts, Dealer Wins! Better luck next time!');
        this.player.money -= 1;
        break;
      } else if (this.dealer.isBusted()) {
        console.log('Dealer Busts, Player Wins! Congratulations!');
        this.player.money += 1;
        break;
      } else {
        console.log(`Player Score: ${this.player.getScore()}`);
        console.log(`Dealer Score: ${this.dealer.getScore()}`);
      }
      if (this.player.getScore() > this.dealer.getScore()) {
        console.log('Player Wins! Congratulations!');
        this.player.money += 1;
      } else if (this.player.getScore() === this.dealer.getScore()) {
        console.log('Its a tie!');
      } else {
        console.log('Dealer Wins! Better luck next time!');
        this.player.money -= 1;
      }
      break;
    }
  }

  joinAnd(cardValues, separator = ', ',) {
    if (cardValues.length === 1) {
      return cardValues[0].toString();
    }  else if (cardValues.length === 2) {
      return `${cardValues[0]} and ${cardValues[1]}`;
    } else {
      let lastChoice = cardValues[cardValues.length - 1];
      let result = cardValues.slice(0, -1).join(separator);
      return `${result}${separator}and ${lastChoice}`;
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

  resetDeckAndClearHands() {
    this.deck = new Deck();
    this.player.resetHand();
    this.player.resetScore();
    this.dealer.resetHand();
    this.dealer.resetScore();
  }
}

let game = new TwentyOneGame();
game.start();

