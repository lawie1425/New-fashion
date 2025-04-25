const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    ordersByDealer: [{
        dealerId: String,
        items: [{
            productId: String,
            name: String,
            price: Number,
            size: String,
            quantity: Number
        }],
        subtotal: Number
    }],
    total: { type: Number, required: true },
    transactionId: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', orderSchema);