const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    perdiscount: {
        type: Number,
        default: 0,
    },
    sellDate: {
        type: Date,
        default: Date.now,
    },
    staff : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shift',
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash',
    }
});

module.exports = mongoose.model('Bill', billSchema);