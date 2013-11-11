M.wrap('github/IonicaBizau/web-sockets/dev/socket.js', function (require, module, exports) {
var Bind = require("github/jillix/bind");
var Events = require("github/jillix/events");

module.exports = function init (config) {

    // create the socket
    var socket = io.connect(config.origin || location.origin.substring(5));

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

    /*
     *  self.socketInit (object, function);
     *  Inits the socket in the page. This is called automatically!
     *
     *  options: an object containing anything
     *
     *  callback: a function that is called when the socket it inited
     *
     * */
    self.socketInit = function (options, callback) {
        self.link("init", {data: options}, callback);
    };

    /*
     *  self.clientEmit (object, function);
     *  Emits an event and data to the server
     *
     *  options: an object containing
     *      - event: the event name
     *      - data:  the data that goes to server side
     *
     *  callback: a function that is passed too to the emit function
     *            from socket emit function
     * */
    self.clientEmit = function (options, callback) {
        self.socket.emit(options.event, options.data, callback);
    }

    /*
     *  self.clientListen (object, function);
     *  Listen an event that comes from the server
     *
     *  options: an object containing
     *      - event: the event name
     *
     *  callback: a function that is passed too to the on function
     *
     * */
    self.clientListen = function (options, callback) {
        self.socket.on(options.event, callback);
    };

    /*
     *  self.serverSend (options);
     *  Call the sendMessage from the server
     *
     *  message: an object containing
     *      - type (string): client, session, group, or all
     *      - session (session id): which clinet should recive this message; all if undefined
     *      - data (object)
     * */
    self.serverSend = function (options) {
        self.clientEmit("sockets.server.send", options);
    };


    /*
     *  self.serverListe (options);
     *  Call the listen function from the server
     *
     *  options:
     *   - event: the event name that listen to
     * */
    self.serverListen = function (options) {
        self.clientEmit("sockets.server.listen", options);
    };

    /*
     *  This automatically inits the socket in the page
     * */
    self.socketInit({}, function (err) {

        if (err) { self.emit("error", err); }

        self.socket = socket;

        // emit ready
        self.emit("ready", self.config, socket);
    });

};

/*
 *  Process config
 * */
function processConfig () {

    // get self (the module)
    var self = this;

    // binds
    self.config.binds = self.config.binds || [];

    // `options` is an object
    self.config.options = self.config.options || {};

    // autoinit (default: true);
    if (self.config.options.autoinit !== false) {
        self.config.options.autoinit = true;
    }
}

return module; });
