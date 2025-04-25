const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    category: { type: String, enum: ['men', 'women', 'kids', 'all'] },
    description: String,
    dealerId: { type: String, required: true }
});
module.exports = mongoose.model('Product', productSchema);