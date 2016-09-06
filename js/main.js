var gui;

function getQueryParameters (str) {
    return (str || document.location.search).replace(/(^\?)/, '').split("&")
                .map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
}

// modifying CSS values with dat.gui is hard because it won't initialize numerical controls normally,
// based on element.style.property returning a string representation of the number, so this is here,
// and it polls on a setInterval to update stuff from dat.gui to the FX.  doesn't seem impact performance much
var guiDataWrapper = function () {
    for (var i = 1; i <= 3; i++) {
        this[i] = {
            videoId: "",
            opacity : 0.69,
            blendMode : "screen",
            playSpeed : 1,
            flipX : false,
            flipY : false,
            filters : {
                hueRotate : 0,
                blur : 0,
                contrast : 1,
                saturation : 1,
                brightness : 1,
            }
        }
    }
};

var opts = new guiDataWrapper();

function updateLayerFilter(layer, filters) {
    layer.style.webkitFilter = "hue-rotate(0deg) blur(0px) contrast(1) saturate(1) brightness(1)"
        .replace("hue-rotate(0", "hue-rotate(" + filters.hueRotate)
        .replace("brightness(1", "brightness(" + filters.brightness)
        .replace("saturate(1", "saturate(" + filters.saturation)
        .replace("contrast(1", "contrast(" + filters.contrast)
        .replace("blur(0", "blur(" + filters.blur);
}

function makeDatGUI() {
    gui = new dat.GUI();
    var flipX = [];                             // arrays so we can establish seperate event handlers
    var flipY = [];                             // for the flip X and flip Y controls
    var idFields = [];
    for (var i = 1; i <= 3; i++) {
        var v = gui.addFolder('video ' + i);
        idFields[i-1] = v.add(opts[i], 'videoId').name("video id / url");
        v.add(opts[i], 'opacity', 0, 1).name("opacity");
        v.add(opts[i], 'blendMode',
            ["screen", "multiply", "soft-light", "hard-light", "hue", "overlay",
             "difference", "luminosity", "color-burn", "color-dodge"]
        ).name("blend mode");

        v.add(opts[i], 'playSpeed', [0.25, 0.5, 1, 1.25, 1.5, 2]).name("play speed");
        v.open();

        var flipModes = v.addFolder('flip mode');                                               // all transform effects go here
        flipX[i-1] = flipModes.add(opts[i], 'flipX').name("vertical");
        flipY[i-1] = flipModes.add(opts[i], 'flipY').name("horizontal");

        var filters = v.addFolder('filters');                                                   // filters all go under this
        filters.add(opts[i].filters, 'saturation', 0, 5).step(0.1).name("saturation");
        filters.add(opts[i].filters, 'contrast', 0, 5).step(0.1).name("contrast");
        filters.add(opts[i].filters, 'brightness', 0, 5).step(0.1).name("brightness");
        filters.add(opts[i].filters, 'hueRotate', 0, 360).step(1).name("hue");
        filters.add(opts[i].filters, 'blur', 0, 20).step(1).name("blur");
    }

    idFields.forEach(function (element, i) {                                                    // these events handle
        element.onFinishChange(function (value) {                                               // live video loading
            if (/youtube\.com\/watch\?v=*/.test(value) === true) {                              // try to support full links
                value = /watch\?v=([a-zA-Z0-9-_]*)/.exec(value)[1];
            }
            else if (/youtu\.be/.test(value) === true) {
                value = /\.be\/([a-zA-Z0-9-_]*)/.exec(value)[1];
            }
            frames[i]._player.loadVideoById(value)
        })
    })
    flipX.forEach(function (element, i) {                                                       // these didn't work in
        element.onChange(function (value) {                                                     // the above for loop
            frames[i].classList.toggle("flipX");                                                // but they work great
        })                                                                                      // like this, so
    });
    flipY.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].classList.toggle("flipY");
        })
    })
}

var videoDefaults = ["ggLTPyRXUKc", "ZC5U9Pwd0kg", "A9grEa_zSIc"];
var params = getQueryParameters(decodeURIComponent(window.location.search));        // get our parameters from the URL

if (params.ids === undefined) {
    var IDs = videoDefaults;            // default to a set i think looks cool if no IDs, will change, probably
} else {
    var IDs = params.ids.split(",");
}

// assign videos to layers and mute them when they load
var frames = Array.prototype.slice.call(document.querySelectorAll('google-youtube'));
frames.forEach(function (element, i) {
    opts[i+1].videoId = element.videoId = IDs[i];
    element.addEventListener("google-youtube-ready", function () {
        console.log("player " + i + " ready");
        element._player.setLoop(true)                               // why doesn't this work, seriously ?
        element.mute();
    });
    // actual working looping
    element.addEventListener("google-youtube-state-change", function (value) {
        if (value.detail.data === 0) {
            this.play();                                            // play on end to loop
        }
    });
});

makeDatGUI();

// move values from our value wrapper that plays nice with dat.gui to actual CSS values
var updateValues = setInterval(function () {
    for (var i = 1; i <= 3; i++) {
        frames[i-1].style.opacity = opts[i].opacity;
        frames[i-1].style.mixBlendMode = opts[i].blendMode;
        frames[i - 1]._player.setPlaybackRate(opts[i].playSpeed);
        updateLayerFilter(frames[i - 1], opts[i].filters)
    }
}, 40);                                                                     // currently updates 25 times / second
