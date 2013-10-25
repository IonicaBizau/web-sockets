M.wrap('github/IonicaBizau/web-sockets/dev/socket.js', function (require, module, exports) {
var Bind = require("github/jillix/bind");
var Events = require("github/jillix/events");

module.exports = function init (config) {

    // get self (the module)
    var self = this;

    // store config in self.config
    self.config = config;

    // process config
    processConfig.call(self);

    // call events
    Events.call(self, config);

    // run the binds
    for (var i = 0; i < config.binds.length; ++i) {
        Bind.call(self, config.binds[i]);
    }

    // the public methods
    var methods = [
        "socketInit",
        "socketEmit",
        "socketListen"
    ];

    // create the methods
    for (var i = 0; i < methods.length; ++i) {
        (function (meth) {
            self[meth] = function (options, callback) {
                self.link(meth, {data: options}, callback);
            };
        })(methods[i])
    }

    // emit ready
    self.emit("ready", self.config);
};

/*
 *  Process config
 * */
function processConfig () {

    // get self (the module)
    var self = this;

    // binds
    self.config.binds = self.config.binds || [];
}

return module; });
