const mongoose = require('mongoose');

const lookupSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        type: {
            type: String,
            required: true,
            enum: ['purpose', 'category', 'vendor']
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        }
    },
    {
        timestamps: true
    }
);

lookupSchema.index(
    {
        user: 1,
        type: 1,
        name: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model('Lookup', lookupSchema);