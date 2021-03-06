var uix = 0;

function emit() {
  "use strict";
  // set up sections
  var $root = $(this);
  var $prologue, $text, $data, $bss, $epilogue;
  $root.parent().prepend(
    $('<div>').addClass('output')
      .append($prologue =$('<span>').addClass('prologue').text(IMPORT))
      .append($data = $('<span>').addClass('data').text(DATA))
      .append($bss = $('<span>').addClass('bss').text(BSS))
      .append($text = $('<span>').addClass('text').text(MAIN))
      .append($epilogue = $('<span>').addClass('epilogue').text(EXIT))
      .click(function() { $(this).select();} ));
  
  // declare all constant strings in DATA
  $('.string.token', $root).each(function() {
    var id = 'str' + (uix++).toString();
    var val = $(this).data('id', id).text();
    
    $data.append(id + ': db ' + val + ',0\n');
  });
  $data.append('\n');
  
  // allocate all variables in BSS
  var seen = {};
  $('.ident.token', $root).each(function() {
    var name = $(this).text();
    if (!(name in seen)) {
      seen[name] = true;
      $bss.append('g_' + $(this).text() + ': resw 1\n');
    }
  });
  $bss.append('\n');
  
  emitBlock($root.children());
  
  function emitBlock($nodes) {
    $nodes.filter('.ast').each(function() {
      var $node = $(this);
      if ($node.hasClass('body')){
        emitBlock($node.children());
      } else if ($node.hasClass('function')) {
        emitFunction($node);
      } else if ($node.hasClass('for')) {
        emitFor($node);
      } else if ($node.hasClass('if')) {
        emitIf($node);
      } else {
        throw $node;
      }
    });
  }
  
  function indent(a) {
    print(INDENT);
    print(a);
  }
  function print(a){
    $text.append(a);
  }
  
  function emitFunction($node) {
    // TODO: this is hardcoded to `print`
    var $expr = $node.children().filter('.expr');
    while($expr.children().filter('.expr').length > 0){
      $expr = $expr.children().filter('.expr');
    }
    
    // TODO: print complex expressions
    var $token = $expr.children().filter('.token');
    
    if ($token.length === 1) {
      if ($token.hasClass('ident')) {
        indent('puti [g_' + $token.text() + ']\n');
      } else if($token.hasClass('string')) {
        indent('puts ' + $token.data('id') + '\n');
      } else {
        throw ['wrong class: ' + $token.attr('class')];
      }
    } else {
      throw ['emitPrint', $expr, $token, 'emitPrint'];
    }
  }
  
  function emitFor($node) {
    var $children = $node.children().filter('.ast');
    
    var $lvar = $($children[0]),
        $init = $($children[1]),
        $stop = $($children[2]),
        $step = $($children[3]),
        $body = $($children[4]);
        
    var label = 'for' + (uix++);
    var exit = 'exit_' + label;
    var variable = 'g_' + $lvar.text().trim();
    
    
    emitExpr($init, 'eax=init');
    indent('mov [' + variable + '], dword eax ; init\n');
    print(label + ':\n')
    indent('mov ecx, dword [' + variable + '] ; test\n')
    
    emitExpr($stop, 'eax=stop');
    indent('mov edx, eax ; edx=stop\n');
    emitExpr($step, 'eax=step');
    indent('add eax, edx ; `for` is inclusive\n')
    indent('cmp ecx, eax ; test compare\n');
    indent('je ' + exit + ' ; test jump\n\n');
    
    emitBlock($body);
    
    print('\n');
    indent('mov ecx, dword [' + variable + '] ; inc\n');
    emitExpr($step, 'expr:step');
    indent('add ecx, eax');
    print(' ; inc\n');
    indent('mov [' + variable + '], dword ecx ; inc\n');
    indent('jmp ' + label + ' ; loop\n');
    print(exit + ':\n\n');
    
  }
  
  function emitIf($node) {
    var $children = $node.children().filter('.ast');
    var $cond = $($children[0]),
        $body = $($children[1]);
    var name = 'if' + (uix++), // unmatched cond; mutates w/ix
        ix = 0;
    var next; // this branch failed, go to next branch
    var end = 'end' + name; // matched cond & executed body - escape label
    var _begin = function(more) {
      next = more ? name + '_' + (ix++) : end;
    };
    var _end = function(more) {
      if (more) {
        indent('jmp ' + end + '\n');
        print(next + ':\n');
      }
    };
    
    _begin($children.length > 2);
    emitCond($cond, next);
    emitBlock($body);
    _end($children.length > 2);
    
    for(var i = 2; i < $children.length; i++) {
      var $alt = $($children[i]);
      $cond = $alt.children().filter('.ast').first();
      $body = $alt.children().filter('.ast').last();
      
      var more = $children.length - i !== 1;
      _begin(more);
      if ($alt.hasClass('elseif')) {
        emitCond($cond, next);
      }
      emitBlock($body);
      _end(more);
    }
    
    print(end + ':\n');
  }
  
  function emitCond($cond, labelFail) {
    print('; cond ' + labelFail + '\n');
    emitExpr($cond);
    // condition is in eax
    indent('cmp eax, dword 0\n');
    indent('je ' + labelFail + '\n; end cond ' + labelFail + '\n\n');
  }
  
  function emitExpr($node, comment) {
    comment = (comment||"");
    var $nodes = $node.children().not('.ignored');
    if($nodes.length === 1) {
      $node = $nodes.first();
      if ($node.hasClass('number')) {
        indent('mov eax, ' + $node.text());
      } else if ($node.hasClass('expr')) {
        return emitExpr($node, comment);
      } else if ($node.hasClass('ident')) {
        indent('mov eax, dword [g_' + $node.text()+ ']');
      } else { throw ['emitExpr class', $node[0]]; }
      
      if (comment) { print(' ; ' + comment); }
      print('\n');
      
    } else if ($nodes.length === 3) {
      var $lhs = $nodes.first(),
          $rhs = $nodes.last(),
          $op = $($nodes[1]);
      if($lhs.hasClass('op') && $lhs.text() == '(' &&
        $rhs.hasClass('op') && $rhs.text() == ')') {
          // actually bananas
          return emitExpr($op, comment);
        }
      var op = $op.text();
      switch(op) {
        case '==':
          emitExpr($lhs, 'lhs(==)');
          indent('push eax ; push(==)\n\n');
          emitExpr($rhs, 'rhs(==)');
          indent('cmp eax, [esp] ; (==)\n');
          indent('mov eax, 0 ; default 0\n');
          indent('mov ebx, 1 ; cmove literally can\'t even\n');
          indent('cmove eax, ebx ; if eax==[esp] then eax=1\n');
          indent('add esp, 4 ; pop(==)\n\n');
          break;
        case 'or':
          // TODO: short circuit evaluation
          emitExpr($lhs, 'lhs(or)');
          indent('push eax ; push(or)\n\n');
          emitExpr($rhs, 'rhs(or)');
          indent('or eax, [esp] ; (or)\n');
          indent('add esp, 4 ; pop(or)\n\n');
          break;
        default:
          throw ['emitExpr invalid op', op, $nodes];
      }
    } else throw ['emitExpr children', $nodes];
  }
}