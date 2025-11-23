const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    openedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    },
    closedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    },
    openingCash: {
        type: Number,
        required: true,
    },
    closingCash: {
        type: Number,
        required: false,
    },
    totalRevenue: {
        type: Number,
        required: false,
    },
    totalOrders: {
        type: Number,
    }
        
});

module.exports = mongoose.model('Shift', shiftSchema);
