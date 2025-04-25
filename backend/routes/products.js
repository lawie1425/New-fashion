router.post('/add', dealerMiddleware, async (req, res) => {
    const { name, category, price, description, stock } = req.body;
    const images = req.files?.images;

    if (!name || !category || !price || !description || !stock || !images) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const imageUrls = [];
        if (Array.isArray(images)) {
            for (const image of images) {
                const result = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: 'fashionhub/products',
                    resource_type: 'image'
                });
                imageUrls.push(result.secure_url);
            }
        } else {
            const result = await cloudinary.uploader.upload(images.tempFilePath, {
                folder: 'fashionhub/products',
                resource_type: 'image'
            });
            imageUrls.push(result.secure_url);
        }

        const product = new Product({
            id: `w_${Date.now()}`,
            name,
            category,
            price: parseFloat(price),
            description,
            images: imageUrls,
            stock: parseInt(stock),
            dealerId: req.dealer._id
        });

        await product.save();
        res.json({ message: 'Product added successfully', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});