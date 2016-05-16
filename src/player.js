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

  Player.prototype.init = function() {

    var this_ = this;
    var callback = function() {

      this_.player = new YT.Player(this_.options.playerId, {
        videoId: this_.options.videoId,
        events: {
        }
      });

    };

    // Test if the youtube api is loaded
    if ("YT" in window) {
      callback();
    } else {
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      tag.onload = function() {
        YT.ready(callback);
      };
    }

  };
  Player.prototype._onReady = function() {
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