/*
 *  Init
 * */
module.exports = function init (link) {
    // TODO
    link.send(200, { op: "init" });
};

/*
 *  Listen
 * */
module.exports = function listen (link) {
    // TODO
    link.send(200, { op: "listen" });
};

/*
 *  Emit
 * */
module.exports = function emit (link) {
    // TODO
    link.send(200, { op: "emit" });
};
