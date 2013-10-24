/*
 *  Init
 * */
exports.init = function (link) {
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
