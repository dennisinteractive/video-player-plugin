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
        wrap: null,
        wrapClass: 'custom-player-wrapper',
        mute: null
    };
  
    // Add our defaults above into a global array of options
    if (arguments[0] && typeof arguments[0] === 'object') {
      this.options = extendDefaults( defaults, arguments[0] );
    }

    // Global vars
    playButton = this.options.playButton;
    pauseButton = this.options.pauseButton;
    wrap = this.options.wrap;
    mute = this.options.mute;

    // Run Player.init()
    this.init();

  };

  Player.prototype.init = function() {
    var this_ = this;

    generateEl( 'div', 'custom-player', this.options.playerId );

    if( wrap ) {
      wrapper = document.createElement( 'div' );
      wrapper.className = this_.options.wrapClass;
      customPlayer = document.getElementById( this_.options.playerId );
      wrapper.appendChild( customPlayer.cloneNode( true ) );
      customPlayer.parentNode.replaceChild( wrapper, customPlayer );
    }

    var callback = function() {

      var video = document.getElementById( this_.options.playerId );

      if ( !video.hasAttribute( 'data-video-id' ) ) {
        option = this_.options;
      } else {
        option = video.dataset;

      }

      // Youtube API
      this_.player = new YT.Player(option.playerId, {
        videoId: option.videoId,
        height: option.height,
        width: option.width,
        playButton: option.playButton,
        pauseButton: option.pauseButton,
        playerVars: {
          autoplay: option.autoPlay,
          controls: option.controls,
          rel: option.relatedVideos,
          showinfo: option.showInfo,
        },
        events: {
          onReady: this_._onPlayerReady,
          onStateChange: this_._onStateChange
        }
      });
      
      // Load custom controls
      if( playButton || pauseButton ) {
        this_.customControls();
      }
    };

    // Test if the youtube api is loaded
    if ('YT' in window) {
      callback();
    } else {
      var tag = document.createElement( 'script' );

      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName( 'script' )[0];
      firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );

      tag.onload = function() {
        YT.ready( callback );
      };
    }

  };

  // Controls
  Player.prototype.customControls = function() {
    var this_ = this;
    var customControls = 'custom-controls';

    generateEl( 'div', customControls );

    if( wrap ) {
      var controls = document.querySelector( '.' + customControls ),
          wrapper = document.querySelector( '.custom-player-wrapper' );

      wrapper.appendChild( controls );
    }

    // Play button
    if( playButton ) {
      button = document.createElement( 'button' );
      button.innerHTML = 'Play';
      button.className = playButton;
      document.querySelector( '.' + customControls ).appendChild( button );

      document.querySelector( '.' + playButton ).addEventListener( 'click', function() {
        this_.player.playVideo();
      });
    }

    // Pause video
    if( pauseButton ) {
      button = document.createElement( 'button' );
      button.innerHTML = 'Pause';
      button.className = pauseButton;
      document.querySelector( '.' + customControls ).appendChild( button );

      document.querySelector( '.' + pauseButton ).addEventListener( 'click', function() {
        this_.player.pauseVideo();
      });
    }

  };


  // Events
  Player.prototype._onPlayerReady = function( event ) {
    if( mute ) {
      event.target.mute();
    }
  };
  Player.prototype._onStateChange = function( event ) {};


  // Private Methods

  // Build the necessary markup
  // and inject it into the document if needed
  function generateEl( el, className, id ) {

    var docFrag;
    var self = this;

    docFrag = document.createDocumentFragment();

    self.element = document.createElement( el );
    if( className ) {
      self.element.className = className;
    }
    if( id ) {
      self.element.id = id;
    }

    docFrag.appendChild( self.element );

    document.body.appendChild( docFrag );
  }

  // Utility method to extend defaults with user options
  function extendDefaults( source, properties ) {
    var property;
    for ( property in properties ) {
      if ( properties.hasOwnProperty( property ) ) {
        source[ property ] = properties[ property ];
      }
    }
    return source;
  }


})();
