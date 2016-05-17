(function() {

  this.Player = function() {

    var defaults = {
        width: 600,
        height: 400,
        playerId: 'video-player',
        videoId: null,
        playButton: null,
        pauseButton: null,
        autoPlay: null
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
        height: this_.options.height,
        width: this_.options.width,
        playButton: this_.options.playButton,
        pauseButton: this_.options.pauseButton,
        playerVars: {
          autoplay: this_.options.autoPlay
        },
        events: {
        }
      });

      // Load custom controls
      this_.controls();
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
  Player.prototype._onReady = function() {};
  
  // Controls
  Player.prototype.controls = function() {
    var this_ = this;

    // Play button
    var playButton = this.options.playButton;
    if(playButton) {
      document.querySelector(playButton).addEventListener('click', function() {
        this_.player.playVideo();
      });
    }

    // Pause video
    var pauseButton = this.options.pauseButton;
    if(pauseButton) {
      document.querySelector(pauseButton).addEventListener('click', function() {
        this_.player.pauseVideo();
      });
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