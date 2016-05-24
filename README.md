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
playerId | string | 'video-player' | Sets ID of video wrapper.
videoId | string | null | Sets ID of video to be displayed.
width | int | 800 | Sets width of video.
height | int | 600 | Sets height of video.
autoPlay | int | null | Autoplay video on page load. Takes 1 or 0. Use 0 to turn autoPlay off.
controls | int | null | Show/ hide vide controls. Takes 1 or 0. Use 0 to turn controls off.
relatedVideos | int | 0 | Show/ hide vide controls. Takes 1 or 0.
showInfo | int | null | Show/ hide video title and Youtube header on video. Takes 1 or 0.
wrap | boolean | null | Wrap Youtube video and custom controls in same div. Takes 1 or 0