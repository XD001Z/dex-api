const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    text: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    thread: {
        type: Schema.Types.ObjectId,
        ref: "Anime"
    }
}, {timestamps: true});

module.exports = model('Comment', commentSchema);