(function() {

  this.Player = function() {

    var defaults = {
        width: 480,
        height: 270,
        playerId: 'video-player',
        videoId: null,
        playButton: null,
        pauseButton: null,
        autoPlay: null,
        controls: null,
        relatedVideos: 0,
        showInfo: null,
    };

    if (arguments[0] && typeof arguments[0] === 'object') {
      this.options = extendDefaults(defaults, arguments[0]);
    }
  };

  Player.prototype.init = function() {

    buildPlayer.call( this );

    var this_ = this;
    var callback = function() {

      this_.player = new YT.Player(this_.options.playerId, {
        videoId: this_.options.videoId,
        height: this_.options.height,
        width: this_.options.width,
        playButton: this_.options.playButton,
        pauseButton: this_.options.pauseButton,
        playerVars: {
          autoplay: this_.options.autoPlay,
          controls: this_.options.controls,
          rel: this_.options.relatedVideos,
          showinfo: this_.options.showInfo,
        },
        events: {
          onReady: this_._onPlayerReady,
          onStateChange: this_._onStateChange
        }
      });

      // Load custom controls
      this_.customControls();
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

  function buildPlayer() {

    var docFrag;

    docFrag = document.createDocumentFragment();

    this.player = document.createElement( 'div' );
    this.player.className = 'custom-player';
    this.player.id = this.options.playerId;

    docFrag.appendChild( this.player );

    document.body.appendChild( docFrag );

  }

  // Events
  Player.prototype._onPlayerReady = function( event ){};
  Player.prototype._onStateChange = function( event ){};

  // Controls
  Player.prototype.customControls = function() {
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