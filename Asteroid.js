(function(window) {
  'use strict';

  function Asteroid(radius) {
    this.Shape_constructor();
    this.radius = radius || utils.getRandomNumberInRange(10, 50);
    this.velocityX = utils.getRandomNumberInRange(-1, 1);
    this.velocityY = utils.getRandomNumberInRange(-1, 1);
    this.rotationVelocity = utils.getRandomNumberInRange(-0.5, 0.5);
    this.render();
  }

  const asteroid = createjs.extend(Asteroid, createjs.Shape);

  asteroid.render = function() {
    const numPoints = utils.getRandomNumberInRange(5, 13);
    
    this.graphics.setStrokeStyle(2);
    this.graphics.beginStroke('#ffffff');

    for(let i = 0; i < numPoints; i++) {
      const angle = (Math.PI * 2) / numPoints * i;
      const offsetRadius = utils.getRandomNumberInRange(this.radius * 1.25, this.radius * 0.75);
      const x = Math.cos(angle) * offsetRadius;
      const y = Math.sin(angle) * offsetRadius;
      this.graphics.lineTo(x, y);
    }

    this.graphics.closePath();
    this.graphics.endStroke();
  };

  asteroid.update = function() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.rotation += this.rotationVelocity;
  };

  window.Asteroid = createjs.promote(Asteroid, 'Shape');

}(window));
