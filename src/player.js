(function() {

  this.Player = function() {
    var defaults = {
        width: 600,
        height: 400,
        playerId: 'video-player',
        videoId: null,
    };

    if (arguments[0] && typeof arguments[0] === 'object') {
      this.options = extendDefaults(defaults, arguments[0]);
    }
  };
  // Private Methods

  // Utility method to extend defaults with user options
  function extendDefaults( source, properties ) {
    var property;
    for ( property in properties ) {
      if ( properties.hasOwnProperty(property) ) {
        source[property] = properties[property];
      }
    }
    return source;
  }

})();