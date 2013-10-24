/*
 *  Init
 * */
exports.init = function (link) {
    // console.log(M.app.server);
    // TODO
    link.send(200, { op: "init", data: link.data });
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
