const signup = function(req, res) {
    // console.log(req.body);
    res.send(req.body);
};

const getUserInfo = function(req, res) {
    res.send('ok');
};

module.exports = {
    signup,
    getUserInfo
};