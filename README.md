# Youtube video player plugin
Video player plugin that uses the Youtube api

## Usage

Install with [Bower](http://bower.io): `$ bower install video-player-plugin --save`.

```javascript
  var myVideo = new Player({
    videoId: '9FiNW55mPxw'
  });
```

-- or --

```HTML
  <div class="custom-player" data-video-id="JXqTxFkZhao"></div>
```

## Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
videoId | string | null | Sets ID of video to be displayed.
extraClass | string | null | Sets any extra classes needed.
width | int | 480 | Sets width of video.
height | int | 270 | Sets height of video.
autoPlay | int | null | Autoplay video on page load. Takes 1 or 0. Use 0 to turn autoPlay off.
controls | int | null | Show/ hide the default vide controls. Takes 1 or 0. Use 0 to turn controls off.
relatedVideos | int | 0 | Show/ hide vide controls. Takes 1 or 0.
showInfo | int | null | Show/ hide video title and Youtube header on video. Takes 1 or 0.
wrap | boolean | null | Wrap Youtube video and custom controls in same div. Takes 1 or 0.
wrapClass | string | 'custom-player-wrapper' | Wrapper class name.
mute | boolean | null | Mute Youtube video. Takes 1 or 0.
playButton | string | null | Custom play button selector. Creates button and adds custom class to it.
playButtonText | string | 'Play' | Customise play button text.
pauseButton | string | null | Custom pause button selector. Creates button and adds custom class to it.
pauseButtonText | string | 'Pause' | Customise pause button text.
placement | string | null | Specify where you would like the video to appear. After body tag by default.

---
&copy; 2016, produced and maintained for [Dennis Digital][dennis], free under the [MIT License][license]


[license]:https://raw.githubusercontent.com/matt3188/video-player-plugin/master/LICENSE
[dennis]:http://www.dennis.co.uk/