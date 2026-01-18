const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// CORS Middleware
app.use(cors());
app.use(express.json());

const getProductsData = () => {
    try {
        const filePath = path.join(process.cwd(), 'data', 'products.json');
        
        if (!fs.existsSync(filePath)) {
            console.error("❌ products.json not found at:", filePath);
            return [];
        }

        const fileData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileData);
    } catch (err) {
        console.error("❌ Error reading products.json:", err);
        return [];
    }
};

// API for products
app.get('/products', (req, res) => {
    try {
        let products = getProductsData();
        
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found or data file missing" });
        }

        const { category, limit } = req.query;

        // Category Filter
        if (category) {
            products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        // Limit & Reverse Logic
        if (limit) {
            products = products.slice(-parseInt(limit)).reverse(); 
        }
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send("ItemNexus Server is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;