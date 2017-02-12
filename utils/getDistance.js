(function(window) {

  /**
   * Returns the distance between two coordinates
   * @param {Object} coordinate1 {x, y}
   * @param {Object} coordinate2 {x, y}
   * @return {Number}
   */
  function getDistance({x: x1, y: y1}, {x: x2, y: y2}) {
    let distX = x1 - x2;
    let distY = y1 - y2;

    return Math.sqrt((distX * distX) + (distY * distY));
  }

  window.utils = window.utils || {};
  window.utils.getDistance = getDistance;

}(window));
