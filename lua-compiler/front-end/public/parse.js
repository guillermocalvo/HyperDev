function parse() {
  "use strict";
  
  var $root = $(this);
  var $tokens = $root.children().clone();
  $root.children().remove();
  
  parseBlock($root);
  
  function parseBlock($this){
    $this = ast($this, 'body');
    while (true) {
      var $tok = peekToken();
      if ($tok.length === 0) {
        return; // EOF
      } else if(testKeyword($tok, 'for')) {
        parseFor($this);
      } else if(testKeyword($tok, 'if')) {
          parseIf($this);
      } else if(testKeyword($tok, 'end', 'elseif', 'else')) {
          return; // end of block
      } else if($tok.hasClass('ident')) {
        parseFunctionCall($this);
      } else{
          err($this, "ERROR: Unknown token - ", $tok);
      }
    }
  }
  
  function ast($this, className) {
    var $stmt = $("<div>").addClass('ast').addClass(className);
    $this.append($stmt);
    return $stmt;
  }
  
  function peekToken() {
    return $tokens.filter('.token').first();
  }
  
  function testKeyword() {
    var rg = $.makeArray(arguments);
    var $this = rg.shift();
    if(!$this.hasClass('keyword')) {
      return false;
    }
    return rg.indexOf($this.text()) !== -1;
  }
  
  function err($this, text, $tok) {
    $this.append($('<span>').addClass('parseError').text(text).append($tok));
    throw [text, $tok];
  }
  
  function parseFunctionCall($this) {
    $this = ast($this, 'function');
    parseLhs($this); // TODO: arbitrary expressions [[ HERE ]](...)
    expect($this, 'op', '(');
    parseExpr($this); // TODO: commas in function calls
    expect($this, 'op', ')');
  }
  
  function parseLhs($this){
    $this = ast($this, 'lhs');
    var $tok = nextToken($this);
    if(!$tok.hasClass('ident')) {
      err($this, 'Expected identifier, found ', $tok);
    }
    $this.append($tok);
  }
  
  function nextToken($this) {
    while (true) {
      var $el = $tokens.shift();
      if ($el.length === 0) {
        err($this, 'Unexpected end of file!');
      } else if (!$el.hasClass('token')) {
        $this.append($el);
      } else {
        return $el;
      }
    }
  }
  
  function expect($this, expectedClass, expectedText) {
    var $tok = nextToken($this);
    if(!$tok.hasClass(expectedClass)) {
      err($this, 'Unexpected token - expected ' + expectedClass + ' ' + expectedText + ', found ', $tok);
    } else if ($tok.text() !== expectedText) {
      err($this, 'Unexpected value - expected ' + expectedText + ', found ', $tok);
    } else {
      $this.append($tok);
    }
  }
  
  function parseExpr($this) {
    // BUG: this parses with right-associative precedence
    $this = ast($this, 'expr');
    var $tok = nextToken($this);
    if ($tok.hasClass('op') && $tok.text() == '(') {
      parseParen($this, $tok);
    } else {
      $this.append(ast($this, 'expr').append($tok));
    }
    tryParseOp($this);
  }
  
  function parseParen($this, $tok) {
    $this = ast($this, 'expr');
    $this.append($tok);
    parseExpr($this);
    expect($this, 'op', ')');
  }
  
  function tryParseOp($this) {
    var $tok = peekToken();
    if ($tok === undefined) {
      return;
    } else if(!$tok.hasClass('op')) {
      // not an op
      return;
    } else if(['(', ')', ','].indexOf($tok.text()) !== -1){
      // not an op; '(' should have been parseParen
      return;
    }
      
    var $prev = $this.children().last();
    $prev.remove();
    var $next = ast($this, 'expr');
    $next.append($prev);
    $next.append(nextToken($next));
    parseExpr($next);
  }
  
  function parseFor($this) {
     $this = ast($this, 'for');
     expect($this, 'keyword', 'for');
     parseLhs($this);
     expect($this, 'op', '=');
     parseExpr($this);
     expect($this, 'op', ',');
     parseExpr($this);
     expect($this, 'op', ',');
     parseExpr($this);
     expect($this, 'keyword', 'do');
     parseBlock($this);
     expect($this, 'keyword', 'end');
  }
  
  function parseIf($this) {
    $this = ast($this, 'if');
    expect($this, 'keyword', 'if');
    parseExpr($this);
    expect($this, 'keyword', 'then');
    parseBlock($this);
    
    while(testKeyword(peekToken(), 'elseif')) {
      parseElseIf($this);
    }
    if(testKeyword(peekToken(), 'else')) {
      var $else = ast($this, 'else');
      expect($else, 'keyword', 'else');
      parseBlock($else);
    }
    expect($this, 'keyword', 'end');
  }
  
  function parseElseIf($this) {
    $this = ast($this, 'elseif');
    expect($this, 'keyword', 'elseif');
    parseExpr($this);
    expect($this, 'keyword', 'then');
    parseBlock($this);
  }
}