$(function() {
 var auto_refresh = setInterval(function(){
  $.get('/webhooks', function(output) {
    var content="";
    if(output.length!==0){
      output.forEach(function(update) {
        content+='<li>' + update + '</li>';
      });
      $('ul#updates').html(content);
      content="";
    } else {
      $('ul#updates').html("None yet");
    }
  });
 }, 3000);
});