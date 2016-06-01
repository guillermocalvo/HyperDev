// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery and Underscore
// Add other scripts at the bottom of index.html

$(function() {
  
  var state = {
    ixWord: 0,
    word: '',
    speed: 200,
    WORD_WRAPAROUND_DELAY: 2000,
    dtLastDisplayRun: Date.now(),
    lastRenderedLetter: '',
    highDefAvailable: false
  }

  updateWord();
  updateSpeed();
  preloadAlphabet();
  setInterval(displayLoop, 100);
  
  $('#answerForm').submit(function(ev){
     // Check if words match and display friendly output.
     // Always move on to the next work.
     ev.preventDefault();
    
    // New word!
    clearDisplay();
    updateWord();
    
    var answer = $('#answer').val() || "(nothing)";
    //clear the form
    $('#answer').val('');
     
    //render the output
    var isCorrect = answer.trim().toLowerCase() === state.word.toLowerCase();
    $('#results').prepend(
       '<div class="result">The word was <span class="target-word">'
       + state.word +
       '</span>, you guessed <span class="submitted-word' + (isCorrect ? ' correct' : '') + '">'
       + answer +
       '<span></div>'
     );
  });
  $('#slider').on("input change", updateSpeed);
  
  function preloadAlphabet() {
    // Cache all the images on the page in the form of hidden <img> tags.
    // This encourages the browser to use the data it already has rather than
    // checking for updated images when we modify the display area.
    // Once they've loaded, mark that our high res images are available.
    var hidden = $('<div style="display:none">');
    [false, true].forEach(function(useHighDef){
      for(var ix = 'a'.charCodeAt(); ix <= 'z'.charCodeAt(); ix++) {
          hidden.append('<img src="' + getImageUrl(String.fromCharCode(ix), useHighDef) + '">');
      }
    });
    $(window).load(function(){
      state.highDefAvailable = true;
      $('#displayscreen').html('');
    });
    $('body').append(hidden);
  }
  
  function updateWord() {
    $.ajax({
      url: '/word',
      cache: false
    }).then(function (data) {
      state.word = data;
      state.ixWord = 0;
      state.lastRenderedLetter = '';
    });
  }
  
  function getImageUrl(letter, useHighDef) {
    var bucketUrl = 'https://s3.amazonaws.com/hyperweb-editor-assets/us-east-1%3Ac5591fd6-6b87-43e4-bff2-a61fdd5fc960%2F';
    var lowerLetter = letter.toLowerCase();
    if(useHighDef){
      // http://www.lifeprint.com/asl101/fingerspelling/abc-gifs/
      return bucketUrl + lowerLetter + '.gif';
    }
    
    //low res lifeprint
    return bucketUrl + lowerLetter + '_small.gif';
  }
  
  function clearDisplay(){
    $('#displayscreen').css('background-image','none');
  }
  
  function renderNextLetter(dtLastDisplayRun) {
    // each tick, determine what to do next and take just that step.
    //as a stub, let's just loop through the state.word.
    var reNotAlphabetical = /[^a-zA-Z]/
    while(state.ixWord < state.word.length && state.word[state.ixWord].match(reNotAlphabetical)){
      state.ixWord++;
    }
    
    if(state.ixWord >= state.word.length){
      // Go blank for a bit, and start over next time around.
      state.ixWord = 0;
      clearDisplay();
      return dtLastDisplayRun + state.WORD_WRAPAROUND_DELAY;
    }
    
    var letter = state.word[state.ixWord].toLowerCase();
    var isRepeatedLetter = letter === state.lastRenderedLetter;

    state.lastRenderedLetter = letter;
    var url = getImageUrl(letter, state.highDefAvailable);
    $('#displayscreen').css({
      'background-image': 'url("' + url + '")',
      'background-position-x': isRepeatedLetter ? '20%' : '50%'
    });

    state.ixWord++;
    return dtLastDisplayRun;
  }
  
  function displayLoop() {
    //event loop guts!
    var dtNow = Date.now();
    if(state.dtLastDisplayRun + state.speed > dtNow) {
      //skip this loop.
      return;
    }
    state.dtLastDisplayRun = dtNow;

    //render the next letter!
    state.dtLastDisplayRun = renderNextLetter(state.dtLastDisplayRun);

  }
  
  function updateSpeed() {
    var slider = $('#slider');
    var maxSpeed = slider.attr('max');
    var val = slider.val();
    var target = maxSpeed - val;
    var msSpeed = target * 10;
    state.speed = msSpeed;
  }
});
