(function() {

  this.Player = function() {

    var defaults = {
        videoId: null,
        playerClass: 'custom-player',
        extraClass: null,
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
        mute: null,
        placement: null
    };
  
    // Add our defaults above into a global array of options
    if ( arguments[0] && typeof arguments[0] === 'object' ) {
      this.options = extendDefaults( defaults, arguments[0] );
    }

    if( document.readyState !== 'complete' ) {
      document.addEventListener('DOMContentLoaded', (this.init).bind(this), false);
    } else {
      // Run Player.init()
      this.init();
    }

  };

  Player.prototype.init = function() {

    var this_ = this;

    // If any extraClass names have been added add them
    var extraClass = this_.options.extraClass,
        classCheck = extraClass === null,
        addExtraClass = classCheck ? '' : ' ' + extraClass;

    if ( !document.getElementById( this_.options.videoId ) ) {
      this.generateEl( 'div', this_.options.videoId, this_.options.playerClass + addExtraClass );
    }

    // Generate the wrapper
    if ( this_.options.wrap ) {
      this.wrapper = document.createElement( 'div' );
      this.wrapper.className = this_.options.wrapClass;
      this.customPlayer = document.getElementById( this_.options.videoId );
      this.wrapper.appendChild( this.customPlayer.cloneNode( true ) );
      this.customPlayer.parentNode.replaceChild( this.wrapper, this.customPlayer );
    }

    var callback = (function() {
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
          onReady: (this_._onPlayerReady).bind(this),
          onStateChange: (this_._onStateChange).bind(this)
        }
      });
      
      // Load custom controls
      if ( this_.options.playButton || this_.options.pauseButton ) {
        this_.customControls();
      }
    }).bind(this);

    // Test if the youtube api is loaded
    if ('YT' in window) {
      if (window.YT.loaded === 0) {
        if (window.onYouTubePlayerAPIReady) {
          var oldonYouTubePlayerAPIReady = window.onYouTubePlayerAPIReady;
        }
        window.onYouTubePlayerAPIReady = function() {
          if (window.onYouTubePlayerAPIReady) { oldonYouTubePlayerAPIReady(); }
          callback();
        };
      } else {
        callback();
      }
    } else {
      window.YT = {
        loaded: 0
      };

      window.onYouTubePlayerAPIReady = function() {
        callback();
      };

      var tag = document.createElement( 'script' );

      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName( 'script' )[0];
      firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
    }

  };

  // Controls
  Player.prototype.customControls = function() {
    var this_ = this;
    var customControlsClass = 'custom-controls';
    var customControlsSelector = '.' + customControlsClass;

    this.videoControls = this.generateEl( 'div', null, customControlsClass );

    // Find the first custom-controls element
    // TODO: Look for multiple elements on the page
    if ( this_.options.wrap ) {
      var controls = document.querySelector( customControlsSelector ),
          wrapper = document.querySelector( '.' + this_.options.wrapClass );

      wrapper.appendChild( controls );
    }

    // Play button
    if ( this_.options.playButton ) {
      var playButtonEl;
      playButtonEl = document.createElement( 'button' );
      playButtonEl.innerHTML = this_.options.playButtonText;
      playButtonEl.className = this_.options.playButton;
      this.videoControls.appendChild( playButtonEl );

      document.querySelector( '.' + this_.options.playButton ).addEventListener( 'click', function() {
        this_.player.playVideo();
      });
    }

    // Pause video
    if ( this_.options.pauseButton ) {
      var pauseButtonEl;
      pauseButtonEl = document.createElement( 'button' );
      pauseButtonEl.innerHTML = this_.options.pauseButtonText;
      pauseButtonEl.className = this_.options.pauseButton;
      this.videoControls.appendChild( pauseButtonEl );

      document.querySelector( '.' + this_.options.pauseButton ).addEventListener( 'click', function() {
        this_.player.pauseVideo();
      });
    }

  };

  // Events
  Player.prototype._onPlayerReady = function( event ) {
    if ( this.options.mute === 1) {
      event.target.mute();
    }
  };
  Player.prototype._onStateChange = function( event ) {};


  // Private Methods

  // Build the necessary markup
  // and inject it into the document if needed
  Player.prototype.generateEl = function( el, id, className ) {
    var docFrag, element;

    docFrag = document.createDocumentFragment();
    element = document.createElement( el );

    if ( id ) {
      element.id = id;
    }
    if ( className ) {
      element.className = className;
    }

    docFrag.appendChild( element );

    if ( this.options.placement !== null ) {
      var selector = document.querySelector( this.options.placement );
      if ( !selector ) { throw new selectorError(selector); }
      selector.appendChild( docFrag );
    } else {
      document.body.appendChild( docFrag );
    }

    function selectorError( value ) {
      this.message = 'Make sure your selector is on the page';
      this.toString = function() {
        return this.value + ' ' + this.message;
      };
    }

    return element;
  };

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

  // Look for all elements that has a data-video-id
  // and populate an array
  var playerData = document.querySelectorAll( '[data-video-id]' );
  var standaloneVideos = [];

  [].slice.call(playerData).forEach(function( vid ) {
    var options = vid.dataset;
    options.element = vid;
    vid.id = vid.dataset.videoId;
    standaloneVideos.push(new Player(options));
  });

  return standaloneVideos;

})();
