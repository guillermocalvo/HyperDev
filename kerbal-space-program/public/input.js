function Action(point0, rocket){
  var svg = document.getElementById('scene');
  var p0 = document.level.player.position.minus(origin);
  
  function getWorldPoint(x, y){
    var point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    var ctm = rocket.getScreenCTM();
    var inverse = ctm.inverse();
    var p = point.matrixTransform(inverse);
    return new Vector(p.x, p.y);
  }
  this.updateEnd = function updateEnd(x, y){
    var p = getWorldPoint(x, y);
    this.shape.setAttributeNS(null, "x2", p.x);
    this.shape.setAttributeNS(null, "y2", p.y);
    var strokeWidth = Math.abs(getWorldPoint(0, 0).x - getWorldPoint(3, 3).x);
    this.shape.setAttributeNS(null, 'stroke-width', strokeWidth);
    this.shape.setAttributeNS(null, "stroke", 'white');
  };
  this.remove = function remove(){
    svg.removeChild(this.shape);
  };
  this.endUpdate = function endUpdate(x, y){
    var p = getWorldPoint(x, y);
    var player = document.level.player;
    
    var delta = player.position.minus(p);
    
    player.velocity = player.velocity.add(delta.scale(1/50000.0));
    player.position = player.position.add(player.velocity);
    player.status = "travelling";
    
  };
  
  this.shape = document.createElementNS("http://www.w3.org/2000/svg", "line");
  this.shape.setAttributeNS(null, "x1", p0.x);
  this.shape.setAttributeNS(null, "y1", p0.y);
  this.updateEnd(point0.x, point0.y);
  svg.appendChild(this.shape);
}

$(function(){
  "use strict";
  var currentAction;
  
  document.addEventListener('mousedown', function(event) {
    if(currentAction !== undefined) {
      currentAction.remove();
      currentAction = undefined;
    }
    if (event.target.id === 'rocket'){
      var rocket = event.target;
      currentAction = new Action(new Vector(event.pageX, event.pageY), rocket);
    }
  });
  
  document.addEventListener('mousemove', function(event){
    if (currentAction !== undefined){
      currentAction.updateEnd(event.pageX, event.pageY);
    }
  });
  
  document.addEventListener('mouseup', function(event){
    if (currentAction !== undefined){
      currentAction.endUpdate(event.pageX, event.pageY);
      currentAction.remove();
      currentAction = undefined;
    }
  });
});