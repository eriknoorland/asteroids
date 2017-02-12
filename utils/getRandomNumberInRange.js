(function(window) {

  /**
   * Returns a random number between min and max
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   */
  function getRandomNumberInRange(min, max) {
    return (Math.random() * (max - min)) + min;
  }

  window.utils = window.utils || {};
  window.utils.getRandomNumberInRange = getRandomNumberInRange;

}(window));
