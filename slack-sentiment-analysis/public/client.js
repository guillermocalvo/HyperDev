// client-side js
// run by the browser each time your view template is loaded

// protip: you can rename this to use .coffee if you prefer

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  getScore();
  getChannels();
  refresh();
  
  $('#channels-dropdown-list').change(function(){
    getSentiments();
  });
});

function getScore() {
  console.log("I'm running!");
  getSentiments();
}

function getSentiments() {
  $.ajax({
    method: "GET",
    url: "/sentiments",
    dataType: 'JSON'
  }).success(function(data){
    
    var messages = data;
    
    var filteredMessages = data.filter(function(message){
      return message.channel == $('#channels-dropdown-list').val().toLowerCase();
    });
    
    if (filteredMessages.length > 0) {
      messages = filteredMessages;
    }
    
    var average = getAverage(messages);
    backgroundColor(average);
    
    if (average > 0){
      $("#score").html("+" + average);
    } else if (average < 0) {
      $("#score").html(average);
    } else {
      $("#score").html("0");
    }
    assessment(average);
    
  }).error(function(){
    setTimeout(function(){
      getSentiments();
    }, 200);
  });
}

function getAverage(sentiments) {
  var recent = _.last(sentiments, 20);
  var scores = recent.map(function(sentiment){
    return sentiment.score.score;
  });
  var n = scores.length;
  var average =  _.reduce(scores, function(memo, num){ return memo + num; }, 0)/n;
  return Math.floor(average * 10) / 10 ;
}

function backgroundColor(average) {
  var div = $('body');
  
  if (average < -4 ) {
    background(div, '#1a0011');
  } else if (average < -3) {
    background(div, '#503F4A');
  } else if (average < -2){
    background(div, '#633954');
  } else if (average < -1){
    background(div, '#71345C');
  } else if (average < 0){
    background(div, '#8E296B');
  } else if (average < 1){
    background(div, '#AD1E7B');
  } else if (average < 2){
    background(div, '#C01785');
  } else if (average < 3){
    background(div, '#DE0D95');
  } else {
    background(div, '#ff4dc1');
  }
}

function background(div, color) {
  $(div).css('background-color', color);
}

function assessment(average) {
  
  if (average < -2 ) {
    $('#assessment').html("Eek.  Looks like it's been a rough day.  It might be time for a face to face.");
  } else if (average < -0.2){
    $('#assessment').html("It seems like your team is feeling pretty down.  What can you do to help?");
  } else if (average < 1){
    $('#assessment').html("Sometimes ok is ok.");
  } else if (average < 2){
    $('#assessment').html("That's the spirit!");
  } else {
    $('#assessment').html("Looking good.  I wish I could work with y'all.");
  }
}

function resizeHero() {
  $('#sentiment-data').height($(window).height());
}

function refresh() {
  $(document).ajaxComplete(function(){
    setTimeout(function(){
      getScore();
    }, 15000);
  });
}

function getChannels() {
    $.ajax({
    method: "GET",
    url: "/sentiments",
    dataType: 'JSON'
  }).success(function(data){
    var channels = data.map(function(message){
      return message.channel;
    });
    
    var uniqueChannels = (_.uniq(channels)).sort();
    
    fillChannels(uniqueChannels);
  });
}

function fillChannels(channels){
  var html = "<option value='All Channels'>All Channels</option>";
  for (i = 0; i < channels.length; i++) {
    var newHTML = "<option value='" + channels[i] + "'>#" + channels[i] + "</option>";
    html += newHTML;
    $('#channels-dropdown-list').html(html);
  }
  
}