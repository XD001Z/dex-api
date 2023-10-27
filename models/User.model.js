const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: String,
    password: String,
    registered: [{
        type: Schema.Types.ObjectId,
        ref: 'Anime',
        default: []
    }]
})

module.exports = model('User', userSchema);