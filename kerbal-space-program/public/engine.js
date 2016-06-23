function Engine() {
  this.delta = 10;
  this.timeMultiplier = 600;
  this.landingThreshold = 0.001; // If you are under this value with respect to the surface, you landed, otherwise... x_x
  
  var handler = null;
  this.run = function (level) {
    if (handler) {
      throw "You ain't gonna run an engine twice! Stop it first";
    }
    handler = setInterval(this.runStep.bind(this, level), this.delta);
  };
  
  this.stop = function () {
    clearInterval(handler);
    handler = null;
  };
  
  this.runStep = function (level) {
    this.updatePlayer(level.player, level.satellites);
    this.updateSatellites(level.satellites);
    //this.checkWin(level.success.bind(level));
  };
  
  this.updatePlayer = function (player, satellites) {
    if (player.status === "landed") { player.velocity = origin; return; }
    player.position = this.updateVector(player.position, player.velocity);
    player.velocity = this.updateVector(player.velocity, this.getGravitationalField(player, satellites));
    player.status = this.updatePlayerStatus(player.position, satellites);
    if (player.status === "landed") { player.velocity = origin; }
  };
  
  this.updateSatellites = function (satellites) {
    satellites.forEach(function (satellite) {
      satellite.position = this.updateVector(satellite.position, satellite.velocity);
    }.bind(this));
    satellites.forEach(function (satellite) {
     satellite.velocity = this.updateVector(satellite.velocity, this.getGravitationalField(satellite, satellites));
    }.bind(this));
  };
  
  this.updateVector = function(currentVector, changeVector) {
    return new Vector(
      currentVector.x + this.timeMultiplier*changeVector.x,
      currentVector.y + this.timeMultiplier*changeVector.y
    );
  };
  
  this.getGravitationalField = function (object, satellites) {
    var position = object.position;
    var field = new Vector(0, 0);
    
    satellites.forEach(function (satellite) {
      if (satellite !== object) {
        var G = 6.67408e-20;
        var Rhat = new Vector(position.x - satellite.position.x, position.y - satellite.position.y);
        Rhat.normalize();
        
        var r2 = Math.pow(position.distance(satellite.position), 2);
        field.x += -satellite.mass * Rhat.x / r2 * G;
        field.y += -satellite.mass * Rhat.y / r2 * G;
      }
    }.bind(this));
    return field;
  };
  
  this.updatePlayerStatus = function (position, satellites) {
    var status = "travelling";
    satellites.forEach(function (satellite) {
      var distance = position.distance(satellite.position);
      if ((distance - satellite.radius) <= this.landingThreshold) {
        status = "landed";
      }
    }.bind(this));
    return status;
  };
  
  this.checkWin = function (success) {
    if(success()) {
      console.log("you won!");
      this.stop();
    }
  };
}