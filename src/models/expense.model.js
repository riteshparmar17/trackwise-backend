const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
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
        category: {
            type: String,
            require: true,
            enum: [
                'Fuel',
                'Maintenance',
                'Insurance',
                'Parking',
                'Toll',
                'Registraction',
                'Cleaning',
                'Other'
            ]
        },
        vendor: {
            type: String,
            trim: true,
            required: true,
            maxLength: 150
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        taxAmount: {
            type: Number,
            default: 0,
            min: 0
        },
        preTaxAmount: {
            type: Number,
            default: 0,
            min: 0
        },
        notes: {
            type: String,
            trim: true,
            default: '',
            maxlength: 1000
        },
        receipt: {
            publicId: {
                type: String,
                default: ''
            },
            url: {
                type: String,
                default: ''
            },
            originalName: {
                type: String,
                default: ''
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Expense', expenseSchema);