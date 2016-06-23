var enormous = 6;
var Earth = new Satellite(new Vector(0, 0), 5.972e24, 6.371393e3 * enormous, new Vector(0, 0), "blue");
var Moon = new Satellite(new Vector(3.63104e5, 0), 7.347e22, 1.737e3 * enormous, new Vector(0, 1.076), "grey");

var Levels = [
  new Level(
    "Go to space today (>100km)",
    new Player(new Vector(Earth.radius, 0),
    new Vector(0, Moon.velocity.x)),
    [Earth, Moon],
    function() {
      return this.player.position.distance(Earth.position) > (Earth.radius + 100);
    },
    1
    )
];

