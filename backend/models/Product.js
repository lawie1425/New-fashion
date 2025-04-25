const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, required: true },
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true },
    feedback: {
        customer: [{
            userId: { type: String, required: true },
            comment: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5, required: true },
            date: { type: Date, default: Date.now }
        }]
    }
});

module.exports = mongoose.model('Product', productSchema);