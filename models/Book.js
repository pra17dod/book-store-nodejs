const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    like: {
        type: Array,
        of: mongoose.Schema.Types.ObjectId,
        required: false,
    }
});

module.exports = mongoose.model("Book", bookSchema);