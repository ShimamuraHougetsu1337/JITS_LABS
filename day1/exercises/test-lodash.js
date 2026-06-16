const _ = require("lodash");

const products = [
    { id: 1, name: "Laptop", price: 25000000, category: "tech", inStock: true },
    { id: 2, name: "Phone", price: 15000000, category: "tech", inStock: false },
    { id: 3, name: "Desk", price: 5000000, category: "furniture", inStock: true },
    { id: 4, name: "Chair", price: 3000000, category: "furniture", inStock: true },
    { id: 5, name: "Monitor", price: 8000000, category: "tech", inStock: true },
];

const groupedProducts = _.groupBy(products, 'category');
console.log(groupedProducts);