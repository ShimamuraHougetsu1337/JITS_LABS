const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse JSON body
app.use(express.json());

// Middleware: parse URL-encoded body (form submit)
app.use(express.urlencoded({ extended: true }));

// Route đơn giản
app.get("/", (req, res) => {
    res.json({ message: "Hello, World!" });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});