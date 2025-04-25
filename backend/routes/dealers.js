router.get('/payments', require('../routes/admin').adminMiddleware, async (req, res) => {
    try {
        const payments = await Payment.find().populate('dealerId', 'name email');
        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});