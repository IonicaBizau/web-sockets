// dependencies and io variable
var SocketIO = require("socket.io")
  , io
  ;

/**
 *  one session might have several sockets opened
 *  this looks like:
 *   {
 *       'sid1': [clientId11, clientId12, etc.],
 *       'sid2': [clientId21, clientId22, etc.],
 *       ..
 *   }
 * */
var sessions = {};

/**
 * the connected clients
 * this looks like:
 *  {
 *      'clientId': client1,
 *      'clientId': client2,
 *      ...
 *  }
 *
 *  */
var clients = {}

/**
 *  Init
 *
 * */
exports.init = function (link) {

    // data or options missing
    if (!link.data) {
        return link.send(400, "Missing data");
    }

    // attach the log field value
    link.data.options.log = (link.params || {}).log

    // call init method
    init(link.data.options, function (err, data) {

        // handle error
        if (err) { return link.send(400, err); }

        // send success response
        link.send(200, data);
    });
};

/**
 *  Listen
 *
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

/**
 *  Emit
 *
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


/**
 *  init
 *  This function inits the io variable
 *
 * */
function init (options, callback) {

    // options must be an object
    options = options || {};

    // callback must be a function
    callback = callback || function () {};

    // io is already set and no force is true
    if (io && !options.force) {
        return callback();
    }

    // set the io variable
    io = SocketIO.listen(M.app.server, {log: Boolean(options.log)});

    // start listening for clients
    listenForClients();

    // on the client side "REFRESH" response from init operation is special
    callback(null, "REFRESH");
}

/**
 *  emit (object, function)
 *  Emit some event and data
 *
 *  Arguments
 *    options:
 *     - event: the event name
 *     - data:  data that must be emited
 *
 *    callback:
 *     - callback function
 *
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

/**
 *
 *  listen (object, function)
 *  Listen on some event and callback the socket
 *
 *  Arguments
 *    options:
 *     - event: the event name that listen to
 *     - client (optional): if provided, the event will be attached to it
 *
 *    callback: the function that must be fired
 *              on that event
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

/**
 *
 *  sendMessage (object)
 *  Send message to clients
 *
 *  Arguments
 *    message: an object containing
 *        - type (string): client, session, group, or all
 *        - session (session id): which clinet should recive this message; all if undefined
 *        - data (object)
 *
 * */
function sendMessage (message) {

    // no message no fun
    if (!message || !message.event) { return; }

    switch (message.type) {

        case "client":
            if (clients[message.dest]) {
                clients[message.dest].emit(message.event, message.data);
            }
            break;

        case "session":
            for (var i in sessions[message.dest]) {
                var clientId = sessions[message.dest][i];
                if (clients[clientId]) {
                    clients[clientId].emit(message.event, message.data);
                }
            }
            break;

        case "group":
            // TODO
            break;

        case "all":
            for (var clientId in clients) {
                clients[clientId].emit(message.event, message.data);
            }
            break;
    }
}

/*
 *  The events interface:
 *   - sockets.init
 *   - sockets.emit
 *   - sockets.listen
 *   - sockets.send
 * */
M.on("sockets.init", init);
M.on("sockets.emit", emit);
M.on("sockets.listen", listen);
M.on("sockets.send", sendMessage);


/**
 * start listening for clients
 *
 * */
function listenForClients () {

    // call listen method
    listen({ event: "connection" }, function (client) {

        // add the client to the global client hash
        clients[client.id] = client;

        // sockets.server.send
        listen({
            event: "sockets.server.send",
            client: client
        }, function (options) {
            M.emit("sockets.send", options);
        });

        // sockets.server.emitGlobal
        listen({
            event: "sockets.server.emitGlobal",
            client: client
        }, function (options) {
            M.emit(options.event, options.data);
        });

        // if we have a session, add the client to thi session as well
        if (client.handshake.headers.cookie) {

            var match = client.handshake.headers.cookie.match(/_s=(.*);/);
            if (match && match[1]) {

                // get the session id and its clients
                var sid = match[1]
                  , sessionClients = sessions[sid] || []
                  ;

                // push the new client id
                sessionClients.push(client.id);

                // set the clients of the session in the sessions object
                sessions[sid] = sessionClients;
            }
        }
    });
}

