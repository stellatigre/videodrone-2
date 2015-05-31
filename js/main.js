var gui, flipX, flipY;
var getQueryParameters = function (str) {
    return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}

// yeah i know jquery has it
function toggleClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.add(className);
    } else {
        v2.classList.remove(className);
    }
}

function engageFlipMode(element, mode) {
    switch (mode) {
        case "none": break;
        case "X":
            element.classList.toggle("flipX"); break;
        case "Y":
            element.classList.toggle("flipY"); break;
    }       
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
        this['v' + i].filters.contrast = 0;
        this['v' + i].filters.saturation = 0;*/
        //this['v' + i].videoId = "";
    }
};

var opts = new guiWrapper();

function makeDatGUI() { 
    gui = new dat.GUI();
    flipX = [];                         // array so we can establish seperate event handlers
    flipY = [];
    for (var i = 1; i <= 3; i++) {
        console.log(i);
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
        v.open();
    }

    // why doesn't this work in a for loop !?!? plz fix this 
    flipX[0].onChange(function (value) {
        frames[0].classList.toggle("flipX");
    });
    flipX[1].onChange(function (value) {
        frames[1].classList.toggle("flipX");
    });
    flipX[2].onChange(function (value) {
        frames[2].classList.toggle("flipX");
    });

    flipY[0].onChange(function (value) {
        frames[0].classList.toggle("flipY");
    });
    flipY[1].onChange(function (value) {
        frames[1].classList.toggle("flipY");
    });
    flipY[2].onChange(function (value) {
        frames[2].classList.toggle("flipY");
    });
}

var videoDefaults = ["ggLTPyRXUKc", "ZC5U9Pwd0kg", "A9grEa_zSIc"];
var params = getQueryParameters(window.location.search);

if (params.ids === undefined) {
    var IDs = videoDefaults;            // default to a set i think looks cool if no IDs, will change
} else {
    var IDs = params.ids.split(",");
}

var frames = Array.prototype.slice.call(document.querySelectorAll('google-youtube'));
frames.forEach(function (element, i) {
    element.videoId = IDs[i];
    element.addEventListener("google-youtube-ready", function () {
        console.log("player ready");
        element.mute();
    });
});


// &gui=no in URL to disable gui
if (params.gui !== "no") {
    makeDatGUI();
}
/*frames.forEach(function (e,i) {
    opts['v' + i].videoId = e.videoId;
})*/

var updateValues = setInterval(function () {
    /*frames.forEach(function (element, i) {
        console.log(element.style.opacity);
        element.style.opacity = opts['v' + i].opacity;
        element.style.mixBlendMode = opts['v' + i].blendMode;
        element._player.setPlaybackRate(opts['v' + i].playSpeed);
        if (opts['v' + i].videoId != element.videoId) {
            element.videoId = opts['v' + i].videoId;
        };
    });*/
    v1.style.opacity = opts.v1.opacity;
    v1.style.mixBlendMode = opts.v1.blendMode;
    v1._player.setPlaybackRate(opts.v1.playSpeed);
    //v1.videoId = opts.v1.videoId;

    v2.style.opacity = opts.v2.opacity;
    v2.style.mixBlendMode = opts.v2.blendMode;
    v2._player.setPlaybackRate(opts.v2.playSpeed);

    //v2.videoId = opts.v2.videoId;

    v3.style.opacity = opts.v3.opacity;
    v3.style.mixBlendMode = opts.v3.blendMode;
    v3._player.setPlaybackRate(opts.v3.playSpeed);
    //v3.videoId = opts.v3.videoId;
}, 33);
