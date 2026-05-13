const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['verify', 'reset', 'refresh'],
        required: true
    },
    expires: {
        type: Date,
        required: true
    }
});

tokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Token', tokenSchema);