var gui, flipX, flipY;
var getQueryParameters = function (str) {
    return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}

// modifying CSS values with dat.gui is hard because it won't initialize numerical controls normally,
// based on element.style.property returning a string representation of the number, so this is here,
// and it polls on a setInterval to update stuff.  doesn't seem to noticeably impact performance
var guiWrapper = function () {
    for (var i = 1; i <= 3; i++) {
        this[i] = {};
        this[i].opacity = 0.69;
        this[i].blendMode = "screen";
        this[i].playSpeed = 1;
        this[i].flipX = false;
        this[i].flipY = false;
        this[i].filters = {};
        this[i].filters.hueRotate = 0;
        this[i].filters.blur = 0;
        this[i].filters.contrast = 1;
        this[i].filters.saturation = 1;
        this[i].filters.brightness = 1;
        //this[i].videoId = "";
    }
};

var opts = new guiWrapper();

function updateLayerFilter(layer, filters) {
    var filterBase = "hue-rotate(0deg) blur(0px) contrast(1) saturate(1) brightness(1)";
    var filterString = filterBase
        .replace("hue-rotate(0deg)", "hue-rotate(" + filters.hueRotate + "deg)")
        .replace("brightness(1)", "brightness(" + filters.brightness + ")")
        .replace("saturate(1)", "saturate(" + filters.saturation + ")")
        .replace("contrast(1)", "contrast(" + filters.contrast + ")")
        .replace("blur(0px)", "blur(" + filters.blur + "px)");

    layer.style['-webkit-filter'] = filterString;
}

function makeDatGUI() { 
    gui = new dat.GUI();
    flipX = [];                             // arrays so we can establish seperate event handlers
    flipY = [];                             // for the flip X and flip Y controls
    for (var i = 1; i <= 3; i++) {
        var v = gui.addFolder('video ' + i);
        //v.add(opts[i], 'videoId').name("video id").listen();
        v.add(opts[i], 'opacity', 0, 1).name("opacity");
        v.add(opts[i], 'blendMode',
            ["screen", "multiply", "soft-light", "hard-light", "hue", "overlay", "difference", "luminosity", "color-burn", "color-dodge"]
        ).name("blend mode");

        v.add(opts[i], 'playSpeed', [0.25, 0.5, 1, 1.25, 1.5, 2]).name("play speed");
        var flipModes = v.addFolder('flip');
        flipX[i-1] = flipModes.add(opts[i], 'flipX').name("X");
        flipY[i-1] = flipModes.add(opts[i], 'flipY').name("Y");

        var filters = v.addFolder('filters');
        filters.add(opts[i].filters, 'saturation', 0, 10).step(0.1).name("saturation");
        filters.add(opts[i].filters, 'contrast', 0, 10).step(0.1).name("contrast");
        filters.add(opts[i].filters, 'hueRotate', 0, 360).step(1).name("hue");
        filters.add(opts[i].filters, 'blur', 0, 20).step(1).name("blur");
        v.open();
    }

    flipX.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].classList.toggle("flipX");
        })
    });
    flipY.forEach(function (element, i) {
        element.onChange(function (value) {
            frames[i].classList.toggle("flipY");
        })
    })
}

var videoDefaults = ["ggLTPyRXUKc", "ZC5U9Pwd0kg", "A9grEa_zSIc"];
var params = getQueryParameters(decodeURIComponent(window.location.search));        // get our parameters from the UI

if (params.ids === undefined) {
    var IDs = videoDefaults;            // default to a set i think looks cool if no IDs, will change
} else {
    var IDs = params.ids.split(",");
}

// assign videos to layers and mute them when they load
var frames = Array.prototype.slice.call(document.querySelectorAll('google-youtube'));
frames.forEach(function (element, i) {
    element.videoId = IDs[i];
    element.addEventListener("google-youtube-ready", function () {
        console.log("player " + i + " ready");
        element.mute();
    });
});

// &gui=no in URL to disable gui
if (params.gui !== "no") {
    makeDatGUI();
}

// move values from our value wrapper that plays nice with dat.gui to actual CSS values
var updateValues = setInterval(function () {
    for (var i = 1; i <= 3; i++) {
        frames[i-1].style.opacity = opts[i].opacity;
        frames[i-1].style.mixBlendMode = opts[i].blendMode;
        frames[i - 1]._player.setPlaybackRate(opts[i].playSpeed);
        updateLayerFilter(frames[i - 1], opts[i].filters)
    }
}, 33);
