const { Schema, model } = require('mongoose');

const animeSchema = new Schema({
    dexNum: Number,
    name: String,
    alt: String,
    img: String,
    ratings: [Number],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: []
    }]
}, {timestamps: true});

module.exports = model('Anime', animeSchema);