var bogan = require('boganipsum');

// common abstractions to get single sentences, rather than paragraphs
module.exports = {
  one: aBoganism,
  heaps: getBoganisms,
  loads: getBoganisms
};
  
// a single sentence
function aBoganism () {
  return bogan({ paragraphs: 1, sentenceMin:1, sentenceMax:1 })
    // pull the punctuation off by default
    .slice(0,-1);
}

// returns an array of sentences
function getBoganisms(n) {
  var boganisms = Array(n);
  for (var i=0; i<n; i++) {
    boganisms[i] = aBoganism();
  }
  return boganisms;
}
