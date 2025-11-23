const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',    
    },
    quantity: {
        type: Number,
    }
});