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
        wrap: true
    };

    if (arguments[0] && typeof arguments[0] === 'object') {
      this.options = extendDefaults(defaults, arguments[0]);
    }
  };

  Player.prototype.init = function() {
    var this_ = this;

    createElement('div', 'custom-player', this.options.playerId);

    var wrap = this.options.wrap;
    if( wrap ) {
      wrapper = document.createElement('div');
      wrapper.className = 'custom-player-wrapper';
      customPlayer = document.getElementById(this_.options.playerId);
      wrapper.appendChild(customPlayer.cloneNode(true));
      customPlayer.parentNode.replaceChild(wrapper, customPlayer);
    }

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

  // Controls
  Player.prototype.customControls = function() {
    var this_ = this,
        playButton = this.options.playButton,
        pauseButton = this.options.pauseButton,
        wrap = this.options.wrap;

    createElement('div', 'custom-controls');


    if( wrap ) {
      var controls = document.querySelector('.custom-controls'),
          wrapper = document.querySelector('.custom-player-wrapper');

      wrapper.appendChild(controls);
    }


    // Play button
    if( playButton ) {
      button = document.createElement( 'button' );
      button.innerHTML = 'Play';
      button.className = playButton;
      document.querySelector('.custom-controls').appendChild( button );

      document.querySelector( '.' + playButton ).addEventListener( 'click', function() {
        this_.player.playVideo();
      });
    }

    // Pause video
    if( pauseButton ) {
      button = document.createElement( 'button' );
      button.innerHTML = 'Pause';
      button.className = pauseButton;
      document.querySelector('.custom-controls').appendChild( button );

      document.querySelector( '.' + pauseButton ).addEventListener( 'click', function() {
        this_.player.pauseVideo();
      });
    }

  };



  // Events
  Player.prototype._onPlayerReady = function( event ){};
  Player.prototype._onStateChange = function( event ){};



  // Private Methods

  // Build the necessary markup
  // and inject it into the document if needed
  function createElement( el, className, id ) {
    var docFrag;

    docFrag = document.createDocumentFragment();

    this.element = document.createElement( el );
    this.element.className = className;
    this.element.id = id;

    docFrag.appendChild( this.element );

    document.body.appendChild( docFrag );
  }

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
