(function(window, document) {

  const KEY_ARROW_RIGHT = 39;
  const KEY_ARROW_LEFT = 37;
  const KEY_ARROW_UP = 38;
  const KEY_SPACE = 32;

  function Game() {
    this.Container_constructor();
    this.addEventListener('added', this.onAddedToStage.bind(this));
  }

  const game = createjs.extend(Game, createjs.Container);

  game.asteroidTimeout = null;
  game.timeToAsteroid = 5000;

  game.bindEvents = function() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  };

  game.init = function() {
    this.score = 0;
    this.scoreText.text = this.score;

    this.ship = new Ship();
    this.ship.rotation = -90;
    this.ship.x = this.stage.canvas.width * 0.5;
    this.ship.y = this.stage.canvas.height * 0.5;
    this.gameElements.addChild(this.ship);

    this.lasers = [];
    this.isAllowedToShoot = true;

    this.asteroids = [];
    this.addAsteroid();

    this.scoreText.alpha = 1;

    createjs.Ticker.paused = false;
  };

  game.reset = function() {
    clearTimeout(this.asteroidTimeout);
    this.asteroidTimeout = null;
    this.timeToAsteroid = 5000;

    this.gameElements.removeAllChildren();

    this.rotateRight = false;
    this.rotateLeft = false;
    this.moveForward = false;
    this.isShooting = false;

    this.scoreText.alpha = 0;
  };

  game.gameOver = function() {
    createjs.Ticker.paused = true;

    this.reset();

    let body = `your score is ${this.score}, click to play again`;
    let text = new createjs.Text(body, '20px Arial', '#ffffff');
    text.x = Math.round((this.stage.canvas.width / 2) - (text.getMeasuredWidth() / 2));
    text.y = Math.round(this.stage.canvas.height / 2) - text.getMeasuredHeight();
    this.addChild(text);

    document.addEventListener('click', onClick = function(event) {
      document.removeEventListener('click', onClick);
      this.removeChild(text);
      this.init();
    }.bind(this));
  };

  game.update = function(event) {
    if(!event.paused) {
      if(this.rotateRight) {
        this.ship.rotation += 3;
      }

      if(this.rotateLeft) {
        this.ship.rotation -= 3;
      }

      if(this.moveForward) {
        this.ship.accelerate();
      }

      if(this.isShooting && this.isAllowedToShoot) {
        this.createLaser(this.ship.x, this.ship.y, this.ship.rotation);
        this.isAllowedToShoot = false; 
        setTimeout(() => { this.isAllowedToShoot = true; }, 200);
      }

      if(this.outOfBounds(this.ship)) {
        let newCoordinates = this.getNewLocationInBounds(this.ship);
        this.ship.x = newCoordinates.x;
        this.ship.y = newCoordinates.y;
      }

      this.asteroids.forEach((asteroid) => {
        if(this.outOfBounds(asteroid)) {
          let newCoordinates = this.getNewLocationInBounds(asteroid);
          asteroid.x = newCoordinates.x;
          asteroid.y = newCoordinates.y;
        }

        if(utils.getDistance(this.ship, asteroid) < this.ship.radius + asteroid.radius) {
          this.gameOver();
        }

        asteroid.update();
      });

      for(let i = 0; i < this.lasers.length; i++) {
        let laser = this.lasers[i];

        if(!laser) {
          console.log(laser);
        }

        for(let j = 0; j < this.asteroids.length; j++) {
          let asteroid = this.asteroids[j];
            
          if(utils.getDistance(laser, asteroid) < asteroid.radius) {
            let {x, y, radius} = asteroid;

            this.gameElements.removeChild(laser);
            this.lasers.splice(i, 1);
            laser = null;
            i--;

            this.gameElements.removeChild(asteroid);
            this.asteroids.splice(j, 1);
            asteroid = null;

            if(radius > 20) {
              let numAsteroids = Math.ceil(radius / 20);

              for(let k = 0; k < numAsteroids; k++) {
                this.createAsteroid(x, y, radius * 0.75);
              }
            }

            this.score += Math.round((100 - radius) / 20 * 100);
            this.scoreText.text = this.score;
            this.timeToAsteroid -= 2;

            break;
          }
        }

        if(laser) {
          if(this.outOfBounds(laser)) {
            this.gameElements.removeChild(laser);
            this.lasers.splice(i, 1);
          }

          laser.update();
        }
      }

      this.ship.update();
      this.stage.update();
    }
  };

  game.addAsteroid = function() {
    this.createAsteroid();
    this.asteroidTimeout = setTimeout(this.addAsteroid.bind(this), this.timeToAsteroid);
  };

  game.createAsteroid = function(x, y, radius) {
    let asteroid = new Asteroid(radius);
    let width = asteroid.radius * 2;
    let posX = asteroid.velocityX > 0 ? 0 - width : this.stage.canvas.width + width;
    let posY = asteroid.velocityY > 0 ? 0 - width : this.stage.canvas.height + width;

    asteroid.x = x || posX;
    asteroid.y = y || posY;

    this.asteroids.push(asteroid);
    this.gameElements.addChild(asteroid);
  };

  game.createLaser = function(x, y, angle) {
    let laser = new Laser(x, y, angle);
    this.lasers.push(laser);
    this.gameElements.addChild(laser);
  };

  game.outOfBounds = function({x, y, radius}) {
    let width = radius * 2;

    return (x - width > this.stage.canvas.width) ||
      (x + width < 0) ||
      (y - width > this.stage.canvas.height) ||
      (y + width < 0);
  };

  game.getNewLocationInBounds = function({x, y, radius}) {
    let width = radius * 2;

    if(x - width > this.stage.canvas.width) {
      x = 0;
    } else if(x + width < 0) {
      x = this.stage.canvas.width;
    }

    if(y - width > this.stage.canvas.height) {
      y = 0;
    } else if(y + width < 0) {
      y = this.stage.canvas.height;
    }

    return {x: x, y: y};
  };

  game.onKeyDown = function(event) {
    switch(event.keyCode) {
      case KEY_ARROW_RIGHT:
        this.rotateRight = true;
        break;
      case KEY_ARROW_LEFT:
        this.rotateLeft = true;
        break;
      case KEY_ARROW_UP:
        this.moveForward = true;
        break;
      case KEY_SPACE:
        this.isShooting = true;
        break;
    }
  };

  game.onKeyUp = function(event) {
    switch(event.keyCode) {
      case KEY_ARROW_RIGHT:
        this.rotateRight = false;
        break;
      case KEY_ARROW_LEFT:
        this.rotateLeft = false;
        break;
      case KEY_ARROW_UP:
        this.moveForward = false;
        break;
      case KEY_SPACE:
        this.isShooting = false;
        break;
    }
  };

  game.onAddedToStage = function() {
    this.removeEventListener('added', this.onAddedToStage.bind(this));
    this.gameElements = new createjs.Container();
    this.addChild(this.gameElements);

    this.scoreText = new createjs.Text(this.score, '20px Arial', '#ffffff');
    this.scoreText.x = 10;
    this.scoreText.y = 10;
    this.addChild(this.scoreText);

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener('tick', this.update.bind(this));

    this.bindEvents();
    this.init();
  };

  window.Game = createjs.promote(Game, 'Container');
  
}(window, document));
