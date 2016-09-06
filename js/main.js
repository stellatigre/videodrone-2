var gui = _videodrone.gui,
    config = _videodrone.config,
    layerValues = new _utils.guiValueContainer();

// load from a set of default videos if 3 aren't specified in query string
var query  = utils.getQueryParameters(decodeURIComponent(window.location.search));
var videos = !query.ids.length === 3 ? query.ids.split(",") : config.videoDefaults;
// each frame is a web component element for youtube videos
var frames = Array.from(document.querySelectorAll('google-youtube'));

frames.forEach(function (element, i) {
    element.videoId = layerValues[i].videoId = videos[i];
    element.addEventListener("google-youtube-ready", () => {
        console.log(`video player for layer ${i} ready`);
        element._player.setLoop(true)                           // why doesn't this work ?
        element.mute();
    });
    element.addEventListener("google-youtube-state-change", function (value) {
        // .play() on end (which is represented by 0) to actually loop
        if (value.detail.data === 0) this.play();
    });
});

var inputs = gui.makeInterface(config.inputHandles, layerValues);
gui.setUpdateEvents(inputs, frames);
