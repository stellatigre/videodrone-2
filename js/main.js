var gui, flipX, flipY;
var getQueryParameters = function (str) {
    return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}

// modifying CSS values with dat.gui is hard because it won't initialize numerical controls normally,
// based on element.style.property returning a string representation of the number, so this is here,
// and it polls on a setInterval to update stuff.  doesn't seem to noticeably impact performance
var guiWrapper = function () {
    for (var i = 1; i <= 3; i++) {
        this['v' + i] = {};
        this['v' + i].opacity = 0.69;
        this['v' + i].blendMode = "screen";
        this['v' + i].playSpeed = 1;
        this['v' + i].flipX = false;
        this['v' + i].flipY = false;
        this['v' + i].filters = {};
        /*this['v' + i].filters.hueRotate = 0;
        this['v' + i].filters.blur = 0;
        this['v' + i].filters.contrast = 1;
        this['v' + i].filters.saturation = 1;*/
        //this['v' + i].videoId = "";
    }
};

var opts = new guiWrapper();

function makeDatGUI() { 
    gui = new dat.GUI();
    flipX = [];                             // arrays so we can establish seperate event handlers
    flipY = [];                             // for the flip X and flip Y controls
    for (var i = 1; i <= 3; i++) {
        var v = gui.addFolder('video ' + i);
        //v.add(opts['v' + i], 'videoId').name("video id").listen();
        v.add(opts['v' + i], 'opacity', 0, 1).name("opacity");
        v.add(opts['v' + i], 'blendMode',
            ["screen", "multiply", "soft-light", "hard-light", "hue", "overlay", "difference", "luminosity", "color-burn", "color-dodge"]
        ).name("blend mode");

        v.add(opts['v' + i], 'playSpeed', [0.25, 0.5, 1, 1.25, 1.5, 2]).name("play speed");
        var flipModes = v.addFolder('flip');
        flipX[i-1] = flipModes.add(opts['v' + i], 'flipX').name("X");
        flipY[i-1] = flipModes.add(opts['v' + i], 'flipY').name("Y");

        //var filters = v.addFolder('filters');
        //filters.add(opts['v' + i], 'saturation', 0, 10).step(0.1).name("play speed");
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
var params = getQueryParameters(decodeURIComponent(window.location.search));

if (params.ids === undefined) {
    var IDs = videoDefaults;            // default to a set i think looks cool if no IDs, will change
} else {
    var IDs = params.ids.split(",");
}

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

var updateValues = setInterval(function () {
    for (var i = 1; i <= 3; i++) {
        frames[i-1].style.opacity = opts['v' + i].opacity;
        frames[i-1].style.mixBlendMode = opts['v' + i].blendMode;
        frames[i-1]._player.setPlaybackRate(opts['v' + i].playSpeed);
    }
}, 33);
