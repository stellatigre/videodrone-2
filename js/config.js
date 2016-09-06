_videodroneConfig = {
    inputHandles: {
        ids: [],
        opacity: [],
        blend: [],
        speed: [],
        flip : {
            x: [],
            y: []
        },
        filters: {
            saturation: []
            contrast: [],
            brightness: [],
            hue: [],
            blur: []
        }
    },

    defaultLayerSettings: {
        videoId: "",
        opacity : 0.69,
        blendMode : "screen",
        playSpeed : 1,
        flip: {
            x: false,
            y: false
        },
        filters : {
            hue : 0,
            blur : 0,
            contrast : 1,
            saturation : 1,
            brightness : 1,
        }
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
        "A9grEa_zSIc"
    ];
}
