var SocketIO = require("socket.io");
var io;
var clients = {};

/*
 *  Init
 * */
exports.init = function (link) {
    init(link.data.options, function (err, data) {
        // handle error
        if (err) { return link.send(400, err); }

        // send success response
        link.send(200, data);
    });
};

/*
 *  Listen
 * */
exports.listen = function (link) {

    // call listen function
    listen(link.data.options, function (err, data) {

        // handle error
        if (err) { return link.send(400, err); }

        // send success response
        link.send(200, data);
    });
};

/*
 *  Emit
 * */
exports.emit = function (link) {

    // call emit function
    emit(link.data.options, function (err, data) {

        // handle error
        if (err) { return link.send(400, err); }

        // send success response
        link.send(200, data);
    });
};


/*
 *  init ()
 *  This function set the io variable
 *
 * */
function init (options, callback) {

    // options must be an object
    options = options || {};

    // callback must be a function
    callback = callback || function () {};

    if (io && !options.force) {
        return callback();
    }

    // Socket.io server listens to our app
    io = SocketIO.listen(M.app.server);

    callback();
}

/*
 *  emit (object, function)
 *  Emit some event and data
 *
 *  options:
 *   - event: the event name
 *   - data:  data that must be emited
 *
 *  callback:
 *   - callback function
 * */
function emit (options, callback) {

    // options must be an object
    options = options || {};

    // callback must be a function
    callback = callback || function () {};

    // init io, if it is not inited
    if (!io) { init(); }

    // emit that event and data
    io.sockets.emit(options.event, options.data);
    callback();
}

/*
 *  listen (object, function)
 *  Listen on some event and callback the socket
 *
 *  options:
 *   - event: the event name that listen to
 *
 *  callback: the function that must be fired
 *            on that event
 *
 * */
function listen (options, callback) {

    // options must be an object
    options = options || {};

    // callback must be a function
    callback = callback || function () {};

    // init io, if it is not inited
    if (!io) { init(); }

    // listen on that event
    if (options.event) {
        if (options.client) {
            options.client.on(options.event, callback);
        } else {
            io.sockets.on(options.event, callback);
        }
    }
}

/*
 *  sendMessage (object)
 *  Send message to clients
 *
 *  message: an object containing
 *      - type (string)
 *      - session (session id): which clinet should recive this message; all if undefined
 *      - data (object)
 *
 * */
function sendMessage (message) {

    // no message no fun
    if (!message) { return; }

    // one specific client
    if (message.session) {
        clients[message.session].emit(message.type);
    }
    // all clients
    else {
        for (var sid in clients) {
            clients[sid].emit(message.type);
        }
     }
}

/*
 *  The events interface:
 *   - sockets.init
 *   - sockets.emit
 * */
M.on("sockets.init", init);
M.on("sockets.emit", emit);
M.on("sockets.send", sendMessage);

// start listening for clients
listen({ event: "connection" }, function (client) {
    clients["sid"] = client;
});

