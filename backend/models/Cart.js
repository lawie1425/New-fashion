const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId: String,
    items: [{
        productId: { type: String, ref: 'Product', required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        dealerId: { type: String, required: true }
    }]
});
module.exports = mongoose.model('Cart', cartSchema);