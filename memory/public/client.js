// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery and Underscore
// Add other scripts at the bottom of index.html

function Card(number, board) {
  this.color = "card" + number + board.theme;
  this.content = ko.observable(this.color + " hidden");
  this.hidden = true;
  this.paired = false;
   
  var self = this;
    
  function clearBoard() {
    board.hideTimeout = null;
    board.secondCard.clicked(board.secondCard, null, true);
    board.firstCard.clicked(board.firstCard, null, true);
    board.message("Try to find two cards with the same image...");
  }
   
  this.clicked = function (element, event, force) {
    
    if (board.startTime() === null) {
      board.startTime(moment());
      board.elapsedInterval = setInterval(function () {
        board.elapsed(moment().subtract(board.startTime()).format("ss"));
      }, 800);
    }
    
    force = force === undefined ? false : force;
    
    if (self.paired) {
      return;
    }
    if (!force && !self.hidden && board.shownCount === 1) {
      return;
    }
    if (!force && board.shownCount === 2) {
      if (board.hideTimeout) {
        clearTimeout(board.hideTimeout);
        clearBoard();
      }
    }

    if (self.hidden) {
      self.hidden = false;
      self.content(self.color);
      board.shownCount += 1;
       
      if (board.shownCount === 1) {
        board.firstCard = self;
        board.message("Ok, now guess the other card with the same image...");
      }
      if (board.shownCount === 2) {
        board.secondCard = self;
        if (self.color === board.firstCard.color) {
          self.content(self.color + " paired");
          self.paired = true;
          board.firstCard.content(board.firstCard.color + " paired");
          board.firstCard.paired = true;
          board.shownCount = 0;
          board.pairsLeft -= 1;
          if (board.pairsLeft === 0) {
            clearInterval(board.elapsedInterval);
            board.elapsedInterval = null;
            board.message("You WIN! And in just " +
            "<span class=\"time\">" + board.elapsed() + " seconds</span>!<br/>" +
            "Refresh the page to restart :)");
          } else {
            board.message("Very good! Now try to find another pair...");
          }
        } else {
          board.message("Oh no! The images do not match... try again!");
          board.hideTimeout = setTimeout(clearBoard, 5000);
        }
      }
    } else {
      self.hidden = true;
      self.content(self.color + " hidden");
      board.shownCount -= 1;
      if (board.firstCard === self) {
        board.firstCard = board.secondCard;
        board.secondCard = null;
      }
      if (board.secondCard === self) {
        board.secondCard = null;
      }
    }
  };
}
 
function generateCards(board) {
  var cards = [];
  for (var i = 0; i < 16; i++) {
    cards.push(new Card((Math.floor(i / 2) + 1), board));
  }
  return _.shuffle(cards);
}
 
function BoardModel(theme) {
  this.theme = theme;
  
  this.startTime = ko.observable(null);
  this.cards = ko.observableArray(generateCards(this));
  this.shownCount = 0;
  this.firstCard = null;
  this.secondCard = null;
  this.message = ko.observable("Try to find two cards with the same image...");
  this.pairsLeft = 8;
  
  this.hideTimeout = null;
  this.elapsedInterval = null;
  
  this.elapsed = ko.observable("00.0");
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
 
$(function() {
  var theme = getParameterByName("theme");
  window.model = new BoardModel(theme);
  ko.applyBindings(window.model);
});
