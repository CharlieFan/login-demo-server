const errorMaker = function(msg = '', code = 500) {
    let err = new Error(msg);
    err.status = code;

    return err;
};

module.exports = {
    errorMaker
};