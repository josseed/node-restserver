require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// enable public folder
app.use(express.static(path.resolve(__dirname, '../public')));

//configuration global of rutes
app.use(require('./routes/index'));




mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;

    console.log('data base online');
});

app.listen(process.env.PORT, () => {
    console.log('listen the port:', process.env.PORT);
});