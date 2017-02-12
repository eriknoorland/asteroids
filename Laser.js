(function(window) {
  'use strict';

  function Laser(x, y, angle) {
    this.Shape_constructor();
    angle = utils.toRadians(angle);
    this.radius = 1;
    this.x = x;
    this.y = y;
    this.velocityX = Math.cos(angle) * 6;
    this.velocityY = Math.sin(angle) * 6;
    this.render();
  }

  const laser = createjs.extend(Laser, createjs.Shape);
  laser.hits = 0;

  laser.render = function() {
    this.graphics.beginFill('#ffffff');
    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();
  };

  laser.update = function() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  };

  window.Laser = createjs.promote(Laser, 'Shape');

}(window));
