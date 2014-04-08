// bind and events dependencies
var Bind = require("github/jillix/bind")
  , Events = require("github/jillix/events")
  ;

/**
 *  Web Sockets
 *  Mono module implementation for web sockets.
 *
 * */
module.exports = function init (config) {

    // create the socket
    var socket = io.connect(config.origin || location.origin.substring(5));

    // get self (the module)
    var self = this;

    // store config in self.config
    self.config = config;

    // process config
    processConfig.call(self);

    // run the binds
    for (var i = 0; i < config.binds.length; ++i) {
        Bind.call(self, config.binds[i]);
    }

    /**
     *  self.socketInit (object, function);
     *  Inits the socket in the page. This is called automatically!
     *
     *  options: an object containing anything
     *
     *  callback: a function that is called when the socket it inited
     *
     * */
    self.socketInit = function (options, callback) {

        // call the server operation
        self.link("init", {data: options}, function (err, data) {

            // first time when initing the websocket
            if (!err && data === "REFRESH") {
                location.reload();
            }

            callback (err, data);
        });
    };

    /**
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

        // validate options
        if (!options || options.constructor !== Object) {
            throw new Error ("Options must be a string or an object");
        }

        // validate callback
        if (!callback || callback.constructor !== Function) {
            throw new Error ("Callback must be a function");
        }

        // emit event passing options and callback
        self.socket.emit(options.event || options, options, callback);
    }

    /**
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

        // listen for events from server
        self.socket.on(options.event, callback);
    };

    /**
     *  self.serverSend (options);
     *  Call the sendMessage from the server
     *
     *  message: an object containing
     *      - type (string): client, session, group, or all
     *      - session (session id): which clinet should recive this message; all if undefined
     *      - data (object)
     * */
    self.serverSend = function (options) {

        // emit a server event
        self.clientEmit("sockets.server.send", options);
    };

    /**
     *  self.serverEmitGlobal (options);
     *  Emits a global event using M.emit()
     *
     *  options:
     *   - event: the event name that is emited
     *   - data: data to be emited
     * */
    self.serverEmitGlobal = function (options) {

        // global server event
        self.clientEmit("sockets.server.emitGlobal", options);
    };

    /**
     *  This automatically inits the socket in the page
     *
     * */
    self.socketInit({}, function (err) {

        // handle error
        if (err) { return self.emit("error", err); }

        // set socket object
        self.socket = socket;

        // emit ready
        self.emit("ready", self.config, socket);
    });

    // call events
    Events.call(self, config);
};

/**
 *  Process config
 *
 * */
function processConfig () {

    // get self (the module)
    var self = this;

    // binds
    self.config.binds = self.config.binds || [];

    // `options` is an object
    self.config.options = self.config.options || {};
}
