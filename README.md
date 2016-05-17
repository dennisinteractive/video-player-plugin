# video-player-plugin
Video player plugin that uses the Youtube api

## Usage
```javascript
  var myVideo = new Player({
    videoId: '9FiNW55mPxw'
  });
```

## Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
videoId | string | null | Sets ID of video to be displayed.
width | int | 800 | Sets width of video.
height | int | 600 | Sets height of video.
autoPlay | int | null | Autoplay video on page load. Takes 1 or 0. Use 0 to turn autoPlay off.
controls | int | null | Show/ hide vide controls. Takes 1 or 0. Use 0 to turn controls off.
relatedVideos | int | null | Show/ hide vide controls. Takes 1 or 0. Turned off by default.