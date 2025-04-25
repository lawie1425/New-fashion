const mongoose = require('mongoose');
const dealerSchema = new mongoose.Schema({
    dealerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subAccountId: { type: String, required: true },
    mobileMoney: String,
    email: String
});
module.exports = mongoose.model('Dealer', dealerSchema);