const getUserInfo = function(req, res) {
    res.send('ok');
};

const signup = function(req, res) {
    // console.log(req.body);
    res.send(req.body);
};

const login = function(req, res) {
    res.send(req.body);
};

module.exports = {
    signup,
    login,
    getUserInfo
};