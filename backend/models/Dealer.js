const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
    dealerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    subAccountId: { type: String, required: true, unique: true },
    subscription: {
        plan: { type: String, enum: ['monthly', 'yearly'], required: true },
        status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
        startDate: { type: Date },
        endDate: { type: Date }
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dealer', dealerSchema);