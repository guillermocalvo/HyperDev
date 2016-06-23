function Renderer() {
  var svg = document.getElementById('scene');
  var svgns = "http://www.w3.org/2000/svg";
  var planets = document.level.satellites.map(function(sat){
    var shape = document.createElementNS(svgns, "circle");
    svg.appendChild(shape);
    return shape;
  });
  this.playerMarker = document.createElementNS(svgns, "circle");
  svg.appendChild(this.playerMarker);
  this.playerVelocity = document.createElementNS(svgns, "line");
  svg.appendChild(this.playerVelocity);
  
  this.sceneFrame = function(){
    document.level.satellites.forEach(function(sat, ix) {
      this.updateShape(planets[ix], sat);
    }.bind(this));
    this.calcViewBox();
    this.updatePlayer(this.playerMarker, document.level.player);
    window.requestAnimationFrame(this.sceneFrame.bind(this));
  };
  
  this.calcViewBox = function(){
    var bounds = document.level.satellites.reduce(function(p, sat) {
      var r = sat.radius,
          x = sat.position.x,
          y = sat.position.y;
      
      p.x = Math.max(p.x, Math.abs(x - r), Math.abs(x + r));
      p.y = Math.max(p.y, Math.abs(y - r), Math.abs(y + r));
      return p;
    }, new Vector(
      Math.abs(document.level.player.position.x),
      Math.abs(document.level.player.position.y)
    ));
    
    this.scale = 1.05 * bounds.distance();
    var sViewBox = "" +
      ( -this.scale) + " " + ( -this.scale) + " " +
      (2*this.scale) + " " + (2*this.scale);
    svg.setAttributeNS(null, "viewBox", sViewBox);
  };
}

Renderer.prototype.updateShape = function (shape, sat){
  shape.setAttributeNS(null, "cx", sat.position.x);
  shape.setAttributeNS(null, "cy", sat.position.y);
  shape.setAttributeNS(null, "r",  sat.radius);
  shape.setAttributeNS(null, "fill", sat.color);
  return shape;
};

Renderer.prototype.updatePlayer = function (shape, player) {
  this.playerMarker.setAttributeNS(null, "cx", player.position.x);
  this.playerMarker.setAttributeNS(null, "cy", player.position.y);
  this.playerMarker.setAttributeNS(null, "r", this.scale * 0.02);
  this.playerMarker.setAttributeNS(null, "fill", 'red');
  this.playerMarker.setAttributeNS(null, "id", "rocket");
  
  this.playerVelocity.setAttributeNS(null, "x1", player.position.x);
  this.playerVelocity.setAttributeNS(null, "y1", player.position.y);
  this.playerVelocity.setAttribute("-vx", player.velocity.x);
  this.playerVelocity.setAttribute("-vy", player.velocity.y);
  var Voff = player.position.add(player.velocity);
  Voff = Voff.scale(5);
  this.playerVelocity.setAttributeNS(null, "x2", Voff.x);
  this.playerVelocity.setAttributeNS(null, "y2", Voff.y);
  this.playerVelocity.setAttributeNS(null, "stroke", "red");
  this.playerVelocity.setAttributeNS(null, "stroke-width", this.scale * 0.005);
  this.playerVelocity.setAttributeNS(null, "id", "velocityMarker");
};