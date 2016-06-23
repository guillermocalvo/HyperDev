$(function(){
  document.level = Levels[0];
  document.renderer = new Renderer();
  document.engine = new Engine();
  
  document.engine.run(document.level);
  document.renderer.sceneFrame();
});


function Vector(x, y) {
  this.x = x;
  this.y = y;
}
var origin = new Vector(0, 0);
Vector.prototype.normalize = function() {
  var scaled = this.scale(1 / this.distance());
  this.x = scaled.x;
  this.y = scaled.y;
};
Vector.prototype.distance = function(other) {
  if(!other) { other = origin; }
  return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
};
Vector.prototype.minus = function(other) {
  if(!other) { other = origin; }
  return new Vector(this.x - other.x, this.y - other.y);
};
Vector.prototype.add = function(other) {
  if(!other) { other = origin; }
  return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.scale = function(scale) {
  return new Vector(this.x * scale, this.y * scale);
};

function Player(position0, vel0){
   this.position = position0;
   this.velocity = vel0;
}
function Satellite(position0, mass /* kg */, radius /* km */, velocity0, color) {
  this.position = position0;
  this.mass = mass;
  this.radius = radius;
  this.velocity = velocity0;
  this.color = color;
}
function Level(name, player, satellites, success, budget) {
  this.name = name;
  this.player = player;
  this.satellites = satellites;
  this.success = success;
  this.budget = budget;
}