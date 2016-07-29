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
        playBtn: null,
        playBtnClass: 'play-btn',
        playBtnText: 'Play',
        pauseBtn: null,
        pauseBtnClass: 'pause-btn',
        pauseBtnText: 'Pause',
        mute: null,
        placement: null,
        videoContainer: null,
        onStateChange: null,
        responsive: null,
        playlist: null
    };

    // Add our defaults above into a global array of options
    if ( arguments[0] && typeof arguments[0] === 'object' ) {
      this.options = extendDefaults( defaults, arguments[0] );
    }

    if( readyState() ) {
      this.init();
    } else {
      document.addEventListener( 'DOMContentLoaded', ( this.init ).bind( this ), false);
    }

  };

  Player.prototype.init = function() {

    var mode;

    if ( this.options.element ) {
      mode = 'exists';
      this.video = this.videoExists();
    } else {
      mode = 'generate';
      this.video = this.videoGenerate();
    }

    this.appendYTDiv();

    if ( this.options.playBtn || this.options.pauseBtn ) {
      this.video = this.customControls( mode );
    }

    // Place Video on the page
    this.appendVideo( mode );
    this.YTGenerate();
    this.assignListeners();

  };

  Player.prototype.appendYTDiv = function() {

    // When using data attributes you can specify an element
    // inside the div in which to place the video.
    if ( this.options.videoContainer ) {
      this.youtubeDiv = this.video.querySelector( this.options.videoContainer );
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
          playlist: options.playlist
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
        var oldonYouTubePlayerAPIReady = window.onYouTubePlayerAPIReady;
        window.onYouTubePlayerAPIReady = function() {
          oldonYouTubePlayerAPIReady();
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

    if ( this.options.responsive ) {
      el.className += ' responsive';
    }

    return el;

  };

  Player.prototype.videoExists = function() {

    return this.options.element;

  };

  Player.prototype.appendVideo = function( mode ) {

    if ( mode === 'generate' ) {
      if ( this.options.placement ) {
        var place = document.querySelector( this.options.placement );
        place.appendChild( this.video );
      } else {
        throw 'Need to specify \'placement\' parameter';
      }
    }

  };


  // Events

  // Listeners
  Player.prototype.assignListeners = function() {

    // Add an event listener
    var matches = matchesPolyfill();
    customEventsPolyfill();

    this.video.addEventListener('click', function( event ) {
      if ( event.target.nodeName === 'BUTTON' ) {
        if ( event.target[ matches ]( '.' + this.options.playBtnClass ) ) {
          this.player.playVideo();
        } else  if ( event.target[ matches ]( '.' + this.options.pauseBtnClass ) ) {
          this.player.pauseVideo();
        }
      }
    }.bind( this ));


    var playing = new CustomEvent('video-playing', { 'detail': 'Video Playing' });
    var paused = new CustomEvent('video-paused', { 'detail': 'Video Paused' });
    var ended = new CustomEvent('video-ended', { 'detail': 'Video Ended' });

    this.customEvents = {
      playing: playing,
      paused: paused,
      ended: ended
    };

    if ( this.options.onStateChange ) {
      if ( this.options.onStateChange.playing ) {
        this.video.addEventListener( 'video-playing', ( this.options.onStateChange.playing ).bind( this ) );
      }
      if ( this.options.onStateChange.paused ) {
        this.video.addEventListener( 'video-paused', ( this.options.onStateChange.paused ).bind( this ) );
      }
      if ( this.options.onStateChange.ended ) {
        this.video.addEventListener( 'video-ended', ( this.options.onStateChange.ended ).bind( this ) );
      }
    }

  };

  // Player ready
  Player.prototype._onPlayerReady = function( event ) {

    if ( this.options.mute === 1 ) {
      event.target.mute();
    }

    if (this.options._onPlayerReady) {
      this.options._onPlayerReady.bind( this )();
    }

  };

  // Player state change
  Player.prototype._onStateChange = function( event ) {

      if ( this.options.onStateChange ) {

        switch ( event.data ) {
          case 0:
            this.video.dispatchEvent( this.customEvents.ended );
            break;
          case 1:
            this.video.dispatchEvent( this.customEvents.playing );
            break;
          case 2:
            this.video.dispatchEvent( this.customEvents.paused );
            break;
        }

      }

  };


  // Private Methods

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

    var body = document.body;
    var matches = body.matches || body.webkitMatchesSelector || body.msMatchesSelector;

    return matches.name;

  }

  function customEventsPolyfill() {

    if ( typeof window.CustomEvent === 'function' ) return false;

    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
     }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;

  }

  // Look for all elements that has `data-video-id`
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

  // Check if the DOM is loaded by looking for 'complete' or 'interactive'
  function readyState() {
    return document.readyState === 'complete' || document.readyState === 'interactive';
  }

  if( readyState() ) {
    getStandalone();
  } else {
    document.addEventListener( 'DOMContentLoaded', getStandalone, false);
  }

})();
