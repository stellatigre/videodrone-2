var getQueryParameters = function(str) {
    return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}

var videoIDs = ["ggLTPyRXUKc", "ZC5U9Pwd0kg", "A9grEa_zSIc"];
var params = getQueryParameters(window.location.search);
var IDs = params.ids.split(",");
var frames = Array.prototype.slice.call(document.querySelectorAll('google-youtube'));
frames.forEach(function (element, i) {
    //element.videoId = videoIDs.pop();
    //element.videoId = IDs.pop();
    element.videoId = IDs[i];
    element.mute();
    // dumb hack to get around mute not working as i expect, plz fix this 
    setTimeout(function () { element.mute(); }, 1420);
    setTimeout(function () { element.mute(); }, 2420);
    setTimeout(function () { element.mute(); }, 4420);
})