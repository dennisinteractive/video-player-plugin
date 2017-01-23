# Custom events and Event listeners
Events that you can hook into and how to use them

```javascript
    var myVideo = new Player({
        videoId: 'pPWKJTo2GXw',
        onStateChange: {
          playing: function() {
            console.log('PLAYING!');
          },
          paused: function() {
            console.log('PAUSED!');
          },
          ended: function() {
            console.log('ENDED!');
          }
        },
        _onPlayerReady: function() {
          var heading = document.querySelector('.main-heading');
          heading.className += ' ready';
        },
      });

```

## Options used in this example
- onStateChange
- _onPlayerReady