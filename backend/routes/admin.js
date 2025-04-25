const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Dealer = require('../models/Dealer');
const Product = require('d:/Projects/New fashion/backend/models/product.js');
const Order = require('d:/Projects/New fashion/backend/models/order');
const Payment = require('../models/Payment');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Admin Middleware
const adminMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) return res.status(403).json({ error: 'Admin access required' });
        req.adminId = decoded.adminId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Admin Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ error: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign(
            { adminId: admin._id, email: admin.email, isAdmin: true },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ message: 'Admin login successful', token, adminId: admin._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Dashboard Stats
router.get('/stats', adminMiddleware, async (req, res) => {
    try {
        const totalDealers = await Dealer.countDocuments();
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'verified' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalProducts = await Product.countDocuments();
        const avgRating = await Product.aggregate([
            { $unwind: '$feedback.customer' },
            { $group: { _id: null, avg: { $avg: '$feedback.customer.rating' } } }
        ]);

        res.json({
            totalDealers,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalProducts,
            avgRating: avgRating[0]?.avg ? parseFloat(avgRating[0].avg.toFixed(1)) : 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add New Dealer
router.post('/dealers/add', adminMiddleware, async (req, res) => {
    const { name, email, phone, password, plan } = req.body;
    if (!name || !email || !phone || !password || !plan) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingDealer = await Dealer.findOne({ email });
        if (existingDealer) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const dealerId = `dealer_${Date.now()}`;
        const subAccountId = `RS_${Date.now()}`;

        const dealer = new Dealer({
            dealerId,
            name,
            email,
            phone,
            password: hashedPassword,
            subAccountId,
            subscription: {
                plan,
                status: 'active',
                startDate: new Date(),
                endDate: plan === 'yearly' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            status: 'approved'
        });

        await dealer.save();
        res.json({ message: 'Dealer added successfully', dealerId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Warn Dealer
router.post('/dealers/warn/:dealerId', adminMiddleware, async (req, res) => {
    try {
        const dealer = await Dealer.findOne({ dealerId: req.params.dealerId });
        if (!dealer) return res.status(404).json({ error: 'Dealer not found' });
        // TODO: Implement email notification logic
        res.json({ message: `${dealer.name} has been warned` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Suspend Dealer
router.post('/dealers/suspend/:dealerId', adminMiddleware, async (req, res) => {
    try {
        const dealer = await Dealer.findOne({ dealerId: req.params.dealerId });
        if (!dealer) return res.status(404).json({ error: 'Dealer not found' });
        dealer.status = 'rejected';
        dealer.subscription.status = 'inactive';
        await dealer.save();
        res.json({ message: `${dealer.name} has been suspended` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fetch Customer Feedback
router.get('/feedback', adminMiddleware, async (req, res) => {
    try {
        const products = await Product.find().populate('dealerId', 'name');
        const feedback = products
            .filter(p => p.feedback.customer.length > 0)
            .map(p => ({
                dealerName: p.dealerId.name,
                productName: p.name,
                feedback: p.feedback.customer.map(f => ({
                    comment: f.comment,
                    rating: f.rating,
                    date: f.date
                }))
            }));
        res.json(feedback);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Send Message to Dealer
router.post('/messages', adminMiddleware, async (req, res) => {
    const { dealerId, subject, message } = req.body;
    if (!dealerId || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const dealer = await Dealer.findOne({ dealerId });
        if (!dealer) return res.status(404).json({ error: 'Dealer not found' });
        // TODO: Implement email or in-app notification logic
        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = { router, adminMiddleware };