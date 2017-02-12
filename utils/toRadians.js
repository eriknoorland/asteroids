(function(window) {

  /**
   * Converts the value from degrees to radians
   * @param {Number} value
   * @return {Number}
   */
  function toRadians(value) {
    return value * Math.PI / 180;
  }

  window.utils = window.utils || {};
  window.utils.toRadians = toRadians;

}(window));
