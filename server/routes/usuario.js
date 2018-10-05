const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');

const app = express();
const Usuario = require('../models/usuario');
const { checkToken, checkAdminRole } = require('../middlewares/auth');

//app.get('/usuario', function(req, res) {
// for use of middlewares
app.get('/usuario', checkToken, (req, res) => {



    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    //Usuario.find({google: true})
    Usuario.find({ status: true }, 'nombre email role status google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: count
                })
            })

        })
});

app.post('/usuario', [checkToken, checkAdminRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });



});

app.put('/usuario/:id', [checkToken, checkAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'status']);
    // new: true | return the new values of the user, without this, return the olds values
    // runValidators: true | run the validators of the model
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.delete('/usuario/:id', [checkToken, checkAdminRole], (req, res) => {

    let id = req.params.id;
    // let body = _.pick(req.body, ['status']);
    let cambiaEstado = {
        status: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {



        //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        };
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });

});


module.exports = app;