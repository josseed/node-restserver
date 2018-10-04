const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}


let userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'The name is necessary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'the email is necessary']
    },
    password: {
        type: String,
        required: [true, 'the password is obligatory']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let user = this;

    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });
module.exports = mongoose.model('Usuario', userSchema);