(function() {

  this.Player = function() {

    var defaults = {
        videoId: null,
        playerId: this.videoId,
        playerClass: 'custom-player',
        width: 480,
        height: 270,
        autoPlay: null,
        controls: null,
        relatedVideos: 0,
        showInfo: null,
        wrap: null,
        wrapClass: 'custom-player-wrapper',
        playButton: null,
        playButtonText: 'Play',
        pauseButton: null,
        pauseButtonText: 'Pause',
        mute: null
    };
  
    // Add our defaults above into a global array of options
    if (arguments[0] && typeof arguments[0] === 'object') {
      this.options = extendDefaults( defaults, arguments[0] );
    }

    // Global vars
    this.wrap = this.options.wrap;
    this.playButton = this.options.playButton;
    this.playButtonText = this.options.playButtonText;
    this.pauseButton = this.options.pauseButton;
    this.pauseButtonText = this.options.pauseButtonText;
    mute = this.options.mute;
    var usingDataAttr = false;

    // Run Player.init()
    this.init();

  };

  Player.prototype.init = function() {
    var this_ = this;

    if( !usingDataAttr ) {
      generateEl( 'div', this_.options.playerClass, this_.options.videoId );
    } else {
      playerData.id = this_.options.videoId;
    }

    // Generate the wrapper
    if ( this.wrap ) {
      this.wrapper = document.createElement( 'div' );
      this.wrapper.className = this_.options.wrapClass;
      this.customPlayer = document.getElementById( this_.options.videoId );
      this.wrapper.appendChild( this.customPlayer.cloneNode( true ) );
      this.customPlayer.parentNode.replaceChild( this.wrapper, this.customPlayer );
    }

    var callback = function() {
      this_.player = new YT.Player(this_.options.videoId, {
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
      if ( this_.playButton || this_.pauseButton ) {
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

    if ( this_.wrap ) {
      var controls = document.querySelector( '.' + customControls ),
          wrapper = document.querySelector( '.custom-player-wrapper' );

      wrapper.appendChild( controls );
    }

    // Play button
    if ( this_.playButton ) {
      var playButtonEl;
      playButtonEl = document.createElement( 'button' );
      playButtonEl.innerHTML = this.playButtonText;
      playButtonEl.className = this.playButton;
      document.querySelector( '.' + customControls ).appendChild( playButtonEl );

      document.querySelector( '.' + this.playButton ).addEventListener( 'click', function() {
        this_.player.playVideo();
      });
    }

    // Pause video
    if ( this_.pauseButton ) {
      var pauseButtonEl;
      pauseButtonEl = document.createElement( 'button' );
      pauseButtonEl.innerHTML = this.pauseButtonText;
      pauseButtonEl.className = this.pauseButton;
      document.querySelector( '.' + customControls ).appendChild( pauseButtonEl );

      document.querySelector( '.' + this.pauseButton ).addEventListener( 'click', function() {
        this_.player.pauseVideo();
      });
    }

  };

  // Events
  Player.prototype._onPlayerReady = function( event ) {
    if ( mute === '1') {
      event.target.mute();
    }
  };
  Player.prototype._onStateChange = function( event ) {};


  // Private Methods

  // Build the necessary markup
  // and inject it into the document if needed
  function generateEl( el, className, id ) {

    var docFrag, element;

    docFrag = document.createDocumentFragment();

    element = document.createElement( el );
    if ( className ) {
      element.className = className;
    }
    if ( id ) {
      element.id = id;
    }

    docFrag.appendChild( element );

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

  var playerData = document.querySelector( '[data-video-id]' );
  if ( playerData ) {
    var usingDataAttr = true;
    // If it exists create a new Player
    // and populate it with the rest of the data attributes
    var options = playerData.dataset,
        newPlayer = new Player(options);
  }

})();
