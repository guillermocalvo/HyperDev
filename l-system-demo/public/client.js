var canvas = document.querySelector('canvas');
var c = new jjs.Turtle(canvas);

var stepInput = document.querySelector('input');
stepInput.oninput = run;
source.oninput = run;

function run(){
  var data = JSON.parse(source.value);
  var steps = parseInt(stepInput.value, 10);

  var i = 0;
  var initial = data.initial;
  var rules = data.rules;
  var commands = data.commands;
  var current = initial;

  function replacer(match) {
    return rules[match] || match;
  }

  while(i < steps) {
    current = current.replace(/./g, replacer);
    i += 1;
  }

  output.value = current;

  // Render
  // canvas.getContext('2d').clearRect(0, 0, 300, 300);
  c.clear("white");
  c.heading(0);
  c.moveTo(150, 150);
  c.penDown();
  current.split('').forEach(function(symbol) {
    var command = commands[symbol];
    if (command) {
      var args = command.slice();
      var method = args.shift();
      var fn = c[method];

      if (fn) {
        fn.apply(c, args);
      }
    }
  });

  updateHash();
}

function updateHash() {
  var data = {
    steps: stepInput.value,
    txt: source.value
  };
  
  hash = '#' + btoa(JSON.stringify(data));
  
  if(history.replaceState) {
    history.replaceState(null, null, hash);
  }
  else {
    location.hash = hash;
  }
}

function restore(data) {
  stepInput.value = data.steps;
  source.value = data.txt;
}

try {
  var hash = location.hash.substring(1);

  if (hash) {
    restore(JSON.parse(atob(hash)));
  }

} catch (e) {
  console.warn(e);
}

run();
