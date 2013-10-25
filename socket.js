M.wrap('github/IonicaBizau/web-sockets/dev/socket.js', function (require, module, exports) {
var Bind = require("github/jillix/bind");
var Events = require("github/jillix/events");

module.exports = function init (conf) {

    // get self (the module)
    var self = this;

    // call events
    Events.call(self, config);

    // run the binds
    for (var i = 0; i < config.binds.length; ++i) {
        Bind.call(self, config.binds[i]);
    }

    // the public methods
    var methods = [
        "init",
        "emit",
        "listen"
    ];

    // create the methods
    for (var i = 0; i < methods.length; ++i) {
        (function (meth) {
            self[meth] = function (options, callback) {
                self.link(meth, {data: options}, callback);
            };
        })(method[i])
    }
};

return module; });
