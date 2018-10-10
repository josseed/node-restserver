const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

let Usuario = require('../models/usuario');
let Producto = require('../models/producto');


// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

    if (!req.files) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'no se ha seleccionado ningun archivo'
            }
        });

    }

    //validar tipo
    let tipo = req.params.tipo;
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'los tipos permitidos son: ' + tiposValidos.join(','),
                tipo
            }
        });
    }
    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let sampleFile = req.files.archivo;
    let splitNombreArchivo = sampleFile.name.split('.');

    let extension = splitNombreArchivo[splitNombreArchivo.length - 1];
    //Extensiones permitidas 

    extension = extension.toLowerCase();
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son: ' + extensionesValidas.join(','),
                extension
            }
        });
    }

    // cambiar nombre archivo
    let id = req.params.id;
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`uploads/${ tipo }/${ nombreArchivo }`, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});



function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            deleteFile(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            deleteFile(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'user dont exists'
                }
            });
        }

        deleteFile(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    });
}

function deleteFile(fileName, tipo) {
    let pathFile = path.resolve(__dirname, `../../uploads/${tipo}/${ fileName }`);

    if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile);
    }
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            deleteFile(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            deleteFile(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'product dont exists'
                }
            });
        }

        deleteFile(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });
    });
}

module.exports = app;