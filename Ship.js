(function(window) {
  'use strict';

  function Ship() {
    this.Container_constructor();
    this.render();
  }

  const ship = createjs.extend(Ship, createjs.Container);

  ship.radius = 15;
  ship.velocityX = 0;
  ship.velocityY = 0;
  ship.thrust = 0;

  Ship.MAX_VELOCITY = 2;
  Ship.MAX_THRUST = 0.8;

  ship.render = function() {
    const width = this.radius * 0.7;
    const height = this.radius;

    this.ship = new createjs.Shape();
    this.ship.graphics.setStrokeStyle(2);
    this.ship.graphics.beginStroke('#ffffff');
    this.ship.graphics.moveTo(this.x + height, this.y);
    this.ship.graphics.lineTo(this.x - height, this.y + width);
    this.ship.graphics.lineTo(this.x - height, this.y - width);
    this.ship.graphics.closePath();
    this.ship.graphics.endStroke();
    this.addChild(this.ship);

    this.booster = new createjs.Shape();
    this.booster.graphics.setStrokeStyle(2);
    this.booster.graphics.beginStroke('#ffffff');
    this.booster.graphics.moveTo(this.x - height - 6, this.y);
    this.booster.graphics.lineTo(this.x - height, this.y - 3);
    this.booster.graphics.lineTo(this.x - height, this.y + 3);
    this.booster.graphics.closePath();
    this.booster.graphics.endStroke();
    this.booster.alpha = 0;
    this.addChild(this.booster);
  };

  ship.accelerate = function() {
    const angle = utils.toRadians(this.rotation);

    this.thrust += 0.1;

    if(this.thrust >= Ship.MAX_THRUST) {
      this.thrust = Ship.MAX_THRUST;
    }

    this.velocityX += Math.cos(angle) * this.thrust;
    this.velocityY += Math.sin(angle) * this.thrust;

    this.velocityX = Math.min(Ship.MAX_VELOCITY, Math.max(-Ship.MAX_VELOCITY, this.velocityX));
    this.velocityY = Math.min(Ship.MAX_VELOCITY, Math.max(-Ship.MAX_VELOCITY, this.velocityY));
  };

  ship.update = function() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    if(this.thrust > 0) {
      this.booster.alpha = 1;
      this.thrust -= 0.1
    } else {
      this.booster.alpha = 0;
      this.thrust = 0;
    }
  };

  window.Ship = createjs.promote(Ship, 'Container');

}(window));
