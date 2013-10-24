M.wrap('github/IonicaBizau/web-sockets/dev/socket.js', function (require, module, exports) {
var Bind = require("github/jillix/bind");
var Events = require("github/jillix/events");

module.exports = function init (conf) {
    // TODO This is under developing
    //      and under testing
    var self = this;

    self.link("init", {data: "Some data"}, function (err, data) {
        console.log(err, data);
    });
};

return module; });
