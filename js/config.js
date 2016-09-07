var filterDefaults = {
    saturation: [],
    contrast: [],
    brightness: [],
    hue: [],
    blur: []
}

_videodrone = {
    config: {
        inputHandles: {
            ids: [],
            opacity: [],
            blend: [],
            speed: [],
            flip : [],
            filters: [
                filterDefaults,
                filterDefaults,
                filterDefaults
            ],
            muted: [],
            pauseButton: []
        },

        defaultLayerSettings: {
            videoId: "",
            opacity : 0.69,
            blendMode : "screen",
            playSpeed : 1,
            flip: 'none',
            filters : {
                hue : 0,
                blur : 0,
                contrast : 1,
                saturation : 1,
                brightness : 1,
            },
            muted: false,
            paused: false,
            pauseButton: function(){}
        },

        blendModes: [
            "screen",
            "multiply",
            "soft-light",
            "hard-light",
            "hue",
            "overlay",
            "difference",
            "luminosity",
            "color-burn",
            "color-dodge"
        ],

        speeds: [0.25, 0.5, 1, 1.25, 1.5, 2],

        videoDefaults: [
            "ggLTPyRXUKc",
            "ZC5U9Pwd0kg",
            "N9wsjroVlu8"           // office space printer scene
        ]
    }
}
