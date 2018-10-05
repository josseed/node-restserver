const jwt = require('jsonwebtoken');

// ===============
// check tokens
// ===============

let checkToken = (req, res, next) => {

    let token = req.get('token'); //name of the header value  

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        };

        req.usuario = decoded.usuario;

        next();

    });


};

// ===============
// check AdminRole
// ===============

let checkAdminRole = (req, res, next) => {
    let usuario = req.usuario

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Invalid role'
            }
        });
    }

    next();
};

module.exports = {
    checkToken,
    checkAdminRole
};