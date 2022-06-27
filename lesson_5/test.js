class Participant {
  constructor() {
    //STUB
    // What sort of state does a participant need?
    // Score? Hand? Amount of money available?
    // What else goes here? all the redundant behaviors from Player and Dealer?
    this.hand = [];
    this.score = 0;
  }
}

class Player extends Participant {
  constructor(money) {
    super();
    this.money = money;
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
}

let player = new Player(5);

player.hand = [['H', '3'], ['C', '7'], ['D', 'A']];
player.calculateInitialScore();
console.log(player.score);