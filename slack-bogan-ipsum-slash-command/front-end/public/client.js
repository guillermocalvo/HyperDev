// client-side js
// run by the browser each time your view template is loaded

// protip: you can rename this to use .coffee if you prefer

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  
  function setQuotes(quotes) {
    $('ul#quotes').html('');
    quotes.forEach(function(quote) {
      $('<li></li>').text(quote).appendTo('ul#quotes');
    });
  }
  
  $.get('/quotes', setQuotes);

  $('.quotes').click(function(event) {
    event.preventDefault();
    $.get('/quotes', setQuotes);
  });

});
