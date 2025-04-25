const express = require('express');
const router = express.Router();
const Order = require('d:/Projects/New fashion/backend/models/order');
const { adminMiddleware } = require('./admin');

router.get('/analytics', adminMiddleware, async (req, res) => {
    try {
        // Monthly Sales
        const monthlySales = await Order.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$total' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // Top Products
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // Revenue by Category
        const categoryRevenue = await Order.aggregate([
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: 'id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            }
        ]);

        res.json({
            monthlySales: monthlySales.map(s => ({ month: s._id, total: s.total })),
            topProducts: topProducts.map(p => ({
                name: p.product.name,
                totalSold: p.totalSold,
                revenue: p.revenue
            })),
            categoryRevenue: categoryRevenue.map(c => ({
                category: c._id,
                revenue: c.revenue
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;