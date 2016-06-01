(function() {

  this.Player = function() {

    var defaults = {
        videoId: null,
        playerClass: 'custom-player',
        width: 480,
        height: 270,
        autoPlay: null,
        controls: null,
        relatedVideos: 0,
        showInfo: null,
        wrap: null,
        wrapClass: 'custom-player-wrapper',
        playBtn: null,
        playBtnClass: 'play-btn',
        playBtnText: 'Play',
        pauseBtn: null,
        pauseBtnClass: 'pause-btn',
        pauseBtnText: 'Pause',
        mute: null,
        placement: null,
        videoContainer: null
    };
  
    // Add our defaults above into a global array of options
    if ( arguments[0] && typeof arguments[0] === 'object' ) {
      this.options = extendDefaults( defaults, arguments[0] );
    }

    if( document.readyState === 'complete' || document.readyState === 'interactive' ) {
      this.init();
    } else {
      // Run Player.init()
      document.addEventListener( 'DOMContentLoaded', ( this.init ).bind( this ), false);
    }

  };

  Player.prototype.init = function() {

    var mode;
    if ( this.options.element ) {
      mode = 'exists';
      this.video = this.videoExists();
    /*} else if ( this.options.wrap === 1 ) {
      mode = 'wrap';
      //this.addClasses(this.wrapper, ['hello', 'world']);
      this.video = this.videoGet(); */
    } else {
      mode = 'generate';
      this.video = this.videoGenerate();
    }

    this.appendYTDiv();

    if ( this.options.playBtn || this.options.pauseBtn ) {
      this.video = this.customControls( mode );
    }

    // Place Video on the page
    this.appendVideo();
    this.YTGenerate();
    this.assignListeners();

  };

  Player.prototype.appendYTDiv = function() {

    if ( this.options.videoContainer ) {
      this.youtubeDiv = this.video.querySelector('.' + this.options.videoContainer );
    } else {
      this.youtubeDiv = document.createElement( 'div' );
      this.video.appendChild( this.youtubeDiv );
    }

  };
  

  Player.prototype.YTGenerate = function() {

    var this_ = this,
        options = this_.options;

    var callback = ( function() {
      this_.player = new YT.Player( this.youtubeDiv, {
        videoId: options.videoId,
        height: options.height,
        width: options.width,
        playerVars: {
          autoplay: options.autoPlay,
          controls: options.controls,
          rel: options.relatedVideos,
          showinfo: options.showInfo,
        },
        events: {
          onReady: ( this_._onPlayerReady ).bind( this ),
          onStateChange: ( this_._onStateChange ).bind( this )
        }
      });

    }).bind( this );

    // Test if the youtube api is loaded
    if ( 'YT' in window ) {
      if ( window.YT.loaded === 0 ) {
        if ( window.onYouTubePlayerAPIReady ) {
          var oldonYouTubePlayerAPIReady = window.onYouTubePlayerAPIReady;
        }
        window.onYouTubePlayerAPIReady = function() {
          if ( window.onYouTubePlayerAPIReady ) {
            oldonYouTubePlayerAPIReady();
          }
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
      var firstScriptTag = document.getElementsByTagName( 'script' )[0];

      tag.src = 'https://www.youtube.com/iframe_api';
      firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
    }

  };

  // Controls
  Player.prototype.customControls = function( mode ) {
    // Play button
    if ( !this.options.playBtn.nodeName ) {
      this.playBtn = this.playBtnGenerate();
    } else {
      this.playBtn = this.playBtnExists();
    }

    // Pause button
    if ( !this.options.pauseBtn.nodeName ) {
      this.pauseBtn = this.pauseBtnGenerate();
    } else {
      this.pauseBtn = this.pauseBtnExists();
    }

    // Custom Controls
    if ( this.options.playBtn || this.options.pauseBtn ) {
      var control = document.createElement( 'div' );
      control.className = 'custom-controls';

      if ( this.playBtn ) {
        control.appendChild( this.playBtn );
      }
      if ( this.pauseBtn ) {
        control.appendChild( this.pauseBtn );
      }
      // Add controls to the generated video
      this.video.appendChild( control );
    }

    return this.video;

  };
  
  // Play Button
  Player.prototype.playBtnExists = function() {

    return this.options.playBtnClass;

  };
  Player.prototype.playBtnGenerate = function() {

    var el = document.createElement( 'button' );
    el.className = this.options.playBtnClass;
    el.innerHTML = this.options.playBtnText;

    return el;

  };

  // Pause Button
  Player.prototype.pauseBtnExists = function() {

    return this.options.pauseBtnClass;

  };
  Player.prototype.pauseBtnGenerate = function() {

    var el = document.createElement( 'button' );
    el.className = this.options.pauseBtnClass;
    el.innerHTML = this.options.pauseBtnText;

    return el;

  };

  // Generate the class
  Player.prototype.videoGenerate = function() {

    var el = document.createElement( 'div' );
    el.id = this.options.videoId;
    el.className = this.options.playerClass;

    return el;

  };

  Player.prototype.videoExists = function() {

    return this.options.element;

  };

  // Player.prototype.videoGet = function() {
  //   return document.querySelector( this.options.wrapClass );
  // };

  Player.prototype.appendVideo = function() {

    document.body.appendChild( this.video );

  };

  // Events

  // Listeners
  Player.prototype.assignListeners = function() {

    this.video.addEventListener('click', function( event ) {

      if ( event.target.nodeName === 'BUTTON' ) {
        var matches = matchesPolyfill();
        if ( event.target[ matches ]( '.' + this.options.playBtnClass ) ) {
          this.player.playVideo();
        } else  if ( event.target[ matches ]( '.' + this.options.pauseBtnClass ) ) {
          this.player.pauseVideo();
        }
      }
    }.bind( this ));

  };

  // Player ready
  Player.prototype._onPlayerReady = function( event ) {

    if ( this.options.mute === 1 ) {
      event.target.mute();
    }

  };
  // Player state change
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
      if ( !selector ) { throw new selectorError( selector ); }
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

  function matchesPolyfill( el ) {

    var matches = document.body.matches || document.body.webkitMatchesSelector || document.body.msMatchesSelector;
    return matches.name;

  }

  // Look for all elements that has a data-video-id
  // and populate an array
  var getStandalone = function() {
    var playerData = document.querySelectorAll( '[data-video-id]' );
    var standaloneVideos = [];

    // Cut up the array and spit out the available videos
    [].slice.call( playerData ).forEach(function( vid ) {
      var options = JSON.parse( JSON.stringify( vid.dataset ) );
      vid.id = options.videoId;
      options.element = vid;
      standaloneVideos.push( new Player( options ) );
    });

    return standaloneVideos;
  };

  if( document.readyState === 'complete' || document.readyState === 'interactive' ) {
    getStandalone();
  } else {
    document.addEventListener( 'DOMContentLoaded', getStandalone, false);
  }

})();
