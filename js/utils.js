var config = _videodrone.config;

_utils = {
    getQueryParameters: function getQueryParameters (str) {
        return (str || document.location.search).replace(/(^\?)/, '').split("&")
                    .map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
    },
    updateLayerFilter: function updateLayerFilter(layer, filters) {
      layer.style.webkitFilter =
          `hue-rotate(${filters.hue}deg) `+
          `brightness(${filters.brightness}) ` +
          `saturate(${filters.saturation}) ` +
          `contrast(${filters.contrast}) ` +
          `blur(${filters.blur}px)`;
    },
    parseVideoID: function parseVideoID(link) {
        if (/youtube\.com\/watch\?v=*/.test(link) === true) {                              // try to support full links
            return /watch\?v=([a-zA-Z0-9-_]*)/.exec(value)[1];
        }
        else if (/youtu\.be/.test(link) === true) {
            return /\.be\/([a-zA-Z0-9-_]*)/.exec(value)[1];
        }
        else return '';
    },
    // modifying CSS values with dat.gui is hard because it won't initialize numerical controls normally,
    // based on element.style.property returning a string representation of the number
    guiValueContainer: function guiValueContainer() {
        for (var i = 0; i <= 2; i++) {
            this[i] = config.defaultLayerSettings;
        }
    };
}
