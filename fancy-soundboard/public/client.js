// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery and Underscore
// Add other scripts at the bottom of index.html

$(function() {

  console.log('hello world :o');

  $(".play").click(function(event){
    var audio = $(event.target).find('audio')[0];

    audio.play();
  });
});
