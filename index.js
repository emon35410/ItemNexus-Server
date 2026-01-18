const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// CORS
app.use(cors());
app.use(express.json());

const getProductsData = () => {
    const filePath = path.join(process.cwd(), 'data', 'products.json'); 
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
};

// API for products
app.get('/products', (req, res) => {
    try {
        let products = getProductsData();
        const { category, limit } = req.query;

        if (category) {
            products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        if (limit) {
            products = products.slice(-parseInt(limit)).reverse(); 
        }
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Data fetch failed!" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;