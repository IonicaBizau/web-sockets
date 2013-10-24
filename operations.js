var SocketIO = require("socket.io");
var io;

/*
 *  Init
 * */
exports.init = function (link) {
    init();
};

/*
 *  Listen
 * */
exports.listen = function (link) {
    // TODO
    link.send(200, { op: "listen" });
};

/*
 *  Emit
 * */
exports.emit = function (link) {
    // TODO
    link.send(200, { op: "emit" });
};


function init () {
    // Socket.io server listens to our app
    io = SocketIO.listen(M.app.server);
}
M.on("sockets.init", init);

function emit (options, callback) {
    options = options || {};
    callback = callback || function () {};
    if (!io) { init(); }
    io.sockets.emit(options.event, options.data);
}
M.on("sockets.emit", emit);

function listen (options, callback) {
    options = options || {};
    callback = callback || function () {};
    if (!io) { init(); }
    io.sockets.on(options.event, function (socket) {
        callback(socket);
    });
}
M.on("sockets.listen", listen);
