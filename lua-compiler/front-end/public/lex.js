function lex() {
  "use strict";
  
  var $this = $(this);
  var text = $this.text();
  $this.text('').children().remove();
  
  var $whitespace = $('<span>').addClass('ignored');
  
  while (text !== '') {
    if (
      replace(/^"[^"]*"/, 'string token') ||
      replace(/^--[^\r\n]*/, 'comment') ||
      replace(/^-?\d+/, 'number token')||
      replace(/^(==|<=|>=|!=|=|\(|\)|,|and|or)/, 'op token')||
      replace(/^(for|if|elseif|else|end|do|then)\b/, 'keyword token') ||
      replace(/^[a-z][a-z0-9_]*\b/, 'ident token')
      ) {
        // `replace` has side effects 
    } else {
      var ch = text.charAt(0);
      $whitespace.append($('<span>').addClass(selector(ch)).text(ch));
      text = text.substr(1);
    }
  }
  appendWhitespace();
  
  function appendWhitespace(){
    if($whitespace.children().length > 0) {
      $this.append($whitespace);
      $whitespace = $('<span>').addClass('ignored');
    }
  }
  
  function replace(re, rclass) {
    if(!re.test(text)) { return false; }
    appendWhitespace();
    var sContent = re.exec(text)[0];
    text = text.substr(sContent.length);
    $this.append($('<span>').addClass(rclass).text(sContent));
    return true;
  }
  
  function selector(ch) {
    return ({'\r': 'carriage-return', '\n': 'line-feed', '\t': 'tab', ' ': 'space'})[ch] || 'other';
  }
}