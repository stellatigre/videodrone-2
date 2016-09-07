var utils  = _videodrone.utils;
var config = _videodrone.config;

_videodrone.gui = {
    makeInterface: function makeInterface(inputs, layerValues) {
        var gui = new dat.GUI();

        for (var i = 0; i <= 2; i++) {
            var data = layerValues[i];
            var v = gui.addFolder('video ' + (i+1));

            inputs.pauseButton[i] = v.add(data, 'pauseButton').name('||  pause');
            inputs.muted[i]   = v.add(data, 'muted', false).name('🔇  muted');
            inputs.ids[i]     = v.add(data, 'videoId').name("video link / id");
            inputs.opacity[i] = v.add(data, 'opacity', 0, 1).name("opacity");
            inputs.blend[i]   = v.add(data, 'blendMode', config.blendModes).name("blend mode");
            inputs.speed[i]   = v.add(data, 'playSpeed', config.speeds).name("play speed");
            inputs.flip.x[i] = v.add(data.flip, 'x').name("flip X");
            inputs.flip.y[i] = v.add(data.flip, 'y').name("flip Y");
            v.open();

            var filters = v.addFolder('filters');                                                   // filters all go under this
            filters.add(data.filters, 'saturation', 0, 5).step(0.1).name("saturation");
            filters.add(data.filters, 'contrast', 0, 5).step(0.1).name("contrast");
            filters.add(data.filters, 'brightness', 0, 5).step(0.1).name("brightness");
            filters.add(data.filters, 'hue', 0, 360).step(1).name("hue");
            filters.add(data.filters, 'blur', 0, 20).step(1).name("blur");
            inputs.filters[i] = filters;
            filters.open();
        }
        return inputs;
    },

    // make all our gui's value update events update their associated element property
    setUpdateEvents: function setUpdateEvents(inputs, frames) {
        inputs.ids.forEach((element, i) => {
            element.onFinishChange((text) => {
                frames[i]._player.loadVideoById(utils.parseVideoID(text));
            })
        })
        inputs.flip.y.forEach((element, i) => {
            element.onChange((value) => frames[i].classList.toggle("flipX"));
        });
        inputs.flip.y.forEach((element, i) => {
            element.onChange((value) => frames[i].classList.toggle("flipY"));
        });
        inputs.blend.forEach((element, i) => {
            element.onChange((value) => frames[i].style.mixBlendMode = value );
        });
        inputs.opacity.forEach((element, i) => {
            element.onChange((value) => frames[i].style.opacity = value );
        });
        inputs.speed.forEach((element, i) => {
            element.onChange((value) => frames[i]._player.setPlaybackRate(value) );
        });
        inputs.filters.forEach((element, i) => {
            element.__controllers.forEach((control, _) => {
                control.onChange(() => {
                    utils.updateLayerFilter(frames[i], layerValues[i].filters);
                });
            });
        });
        inputs.pauseButton.forEach((element, i) => {
            element.onChange((value) => {
                var paused = layerValues[i].paused === true;
                var method = paused ? 'play' : 'pause';

                layerValues[i].paused = paused == true ? false : true;
                var label  = layerValues[i].paused == true ? '▶  play' : '||  pause';

                element.name(label);
                frames[i][method]();
            });
        });
        inputs.muted.forEach((element, i) => {
            element.onChange((value) => {
                var method = value ? 'unMute' : 'mute';
                var label = method === 'mute' ? '🔇  muted' : '🔊 audio on';
                element.name(label);
                frames[i][method](value);
            });
        });
    }
}
