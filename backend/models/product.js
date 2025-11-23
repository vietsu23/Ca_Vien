const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    price : {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    description : {
        type: String,
        // required: true,
    },
    imageUrl : {
        type: String,
        default: 'https://via.placeholder.com/150',
    },
    sale : {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('Product', productSchema);