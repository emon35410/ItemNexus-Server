const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const getProducts = () => {
  const filePath = path.join(__dirname, 'data', 'products.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// API for all products

app.get('/products', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'products.json');
        const fileData = fs.readFileSync(filePath, 'utf-8');
        let products = JSON.parse(fileData);
        
        const { category, limit } = req.query;

        // Category Filter
        if (category) {
            products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        // Recent Data
        if (limit) {
            products = products.slice(-parseInt(limit)).reverse(); 
           
        }
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Data fetch failed!" });
    }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});