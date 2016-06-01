// client-side js
// run by the browser each time your view template is loaded

// protip: you can rename this to use .coffee if you prefer

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  console.log('It\'s HAPPENINNNNNG!!!!');
});

var listContents = [];
var featureSwitches = {
  featureConsolidate: true // Consolidates ingredient amounts: see consolidateList
};

var logError = function(err) {
  // error occurred
  console.log("Error occurred compiling ingredient list: " + err);
};

var consolidateList = function() {
  // Consolidates ingredient amounts. Currently doesn't account for unit though.
  // This may be feature switched off so you don't end up with too much cinnamon.
  var consolidatedList = [];
  while (listContents.length > 0) {
    var item = listContents.pop();
    var index = consolidatedList.findIndex(function(o){return o.name == item.name});
    if (index > -1) {
      // copy stuff
      consolidatedList[index].amount = parseFloat(consolidatedList[index].amount) + parseFloat(item.amount);
    } else {
      consolidatedList.push(item);
    }
  }
  return consolidatedList;
};

var alphabetizeIngredients = function(a, b) {
  first = a.name.toLowerCase();
  second = b.name.toLowerCase();
  if (first < second) {
    return -1;
  }
  if (first > second) {
    return 1;
  }
  return 0;
};

var resolveFractions = function(amount) {
  // Note: this only resolves fractions less than 1. It doesn't account for mixed values
  // such as "1 1/2". At least, not yet.
  var division = amount.search(/(\/|\\)/);
  
  if (division > -1) {
    var values = amount.split(amount[division]);
    console.log(values);
    numerator = parseInt(values[0]);
    denominator = parseInt(values[1]);
    amount = (numerator/denominator);
  }
  return amount;
};

var processChecklistItem = function(item) {
    // The checklist text.
    var text = item;
    // Break it apart according to our format.
    var ingredients = text.split(':');
    // Trim up the name.
    var name = ingredients[1].trim();
    // A very simplistic breakdown of quantity into amount and units
    var quantity = ingredients[0].split(' ');
    var amount = resolveFractions(quantity.shift());
    var units = quantity.join(' ');
    
    return {  amount: amount, 
              units: units, 
              name: name
            };
};

var renderList = function() {
  //console.log(listContents);
  var renderList = [];
  // Should we consolidate?
  renderList = (featureSwitches.featureConsolidate) ? consolidateList(listContents) : listContents; 

  // render
  renderList.sort(alphabetizeIngredients).forEach(function(item) {
    $('<li></li>').html('<div class=ingredient>' +
                        '<input type="checkbox" />' + 
                        item.amount + " " + item.units + 
                        " " + item.name +
                        '</div>').appendTo('ul#ingredients');
  });
};

var getListSuccess = function(data) {
  // We got a checklist! Now, let's process the contents.
  for (var i = 0; i < data.checkItems.length; i++) {
    listContents.push(processChecklistItem(data.checkItems[i].name));
  }
};

var getCardsSuccess = function(data) {
  // Grab the checlists off of our cards so we can go through them.
  var lists = [];
  data.forEach(function(card) {
    lists.push.apply(lists, card.idChecklists);
  });
  
  // Use promises to process all of the lists, then render afterwards.
  var promises = [];
  lists.forEach(function(list) {
      promises.push(Trello.get('checklists/' + list, getListSuccess));
  });
  Promise.all(promises).then(renderList, logError);
};

var authenticationSuccess = function() {
  console.log('Successful authentication');
  // Get all cards on our recipe list.
  Trello.get('lists/' + trelloList + '/cards', getCardsSuccess);
};

var authenticationFailure = function() { console.log('Failed authentication'); };

// Where the magic happens: let's authorize!
Trello.authorize({
  type: 'popup',
  name: 'Getting Started Application',
  scope: {
    read: true,
    write: true },
  expiration: 'never',
  success: authenticationSuccess,
  error: authenticationFailure
});