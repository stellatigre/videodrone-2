var gui;

function getQueryParameters (str) {
    return (str || document.location.search).replace(/(^\?)/, '').split("&")
                .map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
}

var guiDataWrapper = function () {
    for (var i = 0; i <= 2; i++) {
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


function updateFilter(layer, filters) {
    layer.style.webkitFilter =
        `hue-rotate(${filters.hueRotate}deg)
         brightness(${filters.brightness})
         saturate(${filters.saturation})
         contrast(${filters.contrast})
         blur(${filters.blur})`
}

function makeDatGUI() {
    gui = new dat.GUI();
    
    var flipModes = [],
        idFields = [];
        
    for (var i = 0; i <= 2; i++) {
        var v = gui.addFolder('video ' + i);
        idFields[i] = v.add(opts[i], 'videoId').name("video id / url");
        v.add(opts[i], 'opacity', 0, 1).name("opacity");
        v.add(opts[i], 'blendMode',
            ["screen", "multiply", "soft-light", "hard-light", "hue", "overlay",
             "difference", "luminosity", "color-burn", "color-dodge"]
        ).name("blend mode");

        v.add(opts[i], 'playSpeed', [0.25, 0.5, 1, 1.25, 1.5, 2]).name("play speed");
        v.open();

        flipModes[i] = v.add(opts[i], 'flipMode', ['', 'X', 'Y', 'Z']).name('flip mode');

        var filters = v.addFolder('filters');                                                   // filters all go under this
        filters.add(opts[i].filters, 'saturation', 0, 10).step(0.1).name("saturation");
        filters.add(opts[i].filters, 'contrast', 0, 10).step(0.1).name("contrast");
        filters.add(opts[i].filters, 'brightness', 0, 10).step(0.1).name("brightness");
        filters.add(opts[i].filters, 'hueRotate', 0, 360).step(1).name("hue");
        filters.add(opts[i].filters, 'blur', 0, 20).step(1).name("blur");
    }

    idFields.forEach((element, i) => {                                                    // these events handle
        element.onFinishChange((value) => {                                               // live video loading
            if (/youtube\.com\/watch\?v=*/.test(value) === true) {                              // try to support full links
                value = /watch\?v=([a-zA-Z0-9-_]*)/.exec(value)[1];
            }
            else if (/youtu\.be/.test(value) === true) {
                value = /\.be\/([a-zA-Z0-9-_]*)/.exec(value)[1];
            }
            frames[i]._player.loadVideoById(value)
        })
    })
    filterValues.forEach((element, i) => {
        element.__controllers.forEach((controller, n) => {
            controller.onChange((value) => { updateFilter(frames[i], opts[i].filters) });
        });
    });
    
    var flipEnum = {
        ""  : "rotate3d(0, 0, 0, 180deg)",
        "X" : "rotate3d(1, 0, 0, 180deg)",
        "Y" : "rotate3d(0, 1, 0, 180deg)",
        "Z" : "rotate3d(0, 0, 1, 180deg)"
    }
    flipModes.forEach((element, i) => {
        element.onChange((value) => { frames[i].style.transform = flipEnum[value] });
    });
}

var videoDefaults = ["ggLTPyRXUKc", "ZC5U9Pwd0kg", "A9grEa_zSIc"];
var params = getQueryParameters(decodeURIComponent(window.location.search));        // get our parameters from the URL

if (params.ids === undefined) {
    var IDs = videoDefaults;            // default to a set i think looks cool if no IDs, will change, probably
} else {
    var IDs = params.ids.split(",");
}

// assign videos to layers and mute them when they load
var frames = Array.from(document.querySelectorAll('google-youtube'));

frames.forEach((element, i) => {
    opts[i].videoId = element.videoId = IDs[i];
    element.addEventListener("google-youtube-ready", () => {
        console.log("player " + i + " ready");
        element._player.setLoop(true);                               // why doesn't this work, seriously ?
        element.mute();
    });
    // actual working looping
    element.addEventListener("google-youtube-state-change", (value) => {
        if (value.detail.data === 0) {
            this.play();                                            // play on end to loop
        }
    });
});

makeDatGUI();

// move values from our value wrapper that plays nice with dat.gui to actual CSS values
var updateValues = setInterval(function () {
    for (var i = 0; i <= 2; i++) {
        frames[i].style.opacity = opts[i].opacity;
        frames[i].style.mixBlendMode = opts[i].blendMode;
        frames[i]._player.setPlaybackRate(opts[i].playSpeed);
        updateLayerFilter(frames[i], opts[i].filters)
    }
}, 40);                                                                     // currently updates 25 times / second


