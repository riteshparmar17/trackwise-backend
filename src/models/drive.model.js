const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        startKM: {
            type: Number,
            required: true,
            min: 0
        },
        endKM: {
            type: Number,
            required: false,
            min: 0
        },
        totalKM: {
            type: Number,
            default: 0,
            min: 0
        },
        purpose: {
            type: String,
            trim: true,
            maxlength: 200
        },
        notes: {
            type: String,
            trim: true,
            default: '',
            maxlength: 500
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Drive', driveSchema);