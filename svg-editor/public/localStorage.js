 (function ($) {
  "use strict";
  $(function() {
    //deserialize from localstorage back into the form. whee!
    
    $('#controls input:not([type=radio])').each(function(){
      var input = $(this);
      
      var name = input.attr('name');
      if(localStorage.hasOwnProperty(name)){
        input.val(localStorage[name]);
        console.log("retrieved", name, input.val());
      }
    });
    
    // deserialize selected tool
    var tool = localStorage.tool;
    if (!document.getElementById(tool)) { tool = 'circle'; }
    console.log('activating tool', tool);
    $(document.getElementById(tool)).click().change();
    
    // deserialize SVG document
    $('#main').html(localStorage.editor);

    $('#controls input').change(function(e){
      var input = $(this);
      var name = input.attr('name');
      localStorage[name] = input.val();
      console.log("stored", name, input.val());
    });
    
    $(document).on('editor:dirty', function(e) {
      localStorage.editor = $('#main').html();
      console.log('stored', 'editor');
    });
  });
})(jQuery);