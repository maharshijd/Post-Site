const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Basic in-memory storage
const users = [];
const posts = [];

// Combined Auth Route (Handles both Login and Register)
app.post('/auth', (req, res) => {
    const { username, password, action } = req.body;
    
    if (action === 'register') {
        users.push({ username, password });
        return res.json({ success: true, message: 'Registered successfully' });
    } 
    
    if (action === 'login') {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) return res.json({ success: true });
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Get all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// Create a new post
app.post('/posts', (req, res) => {
    posts.unshift({ author: req.body.author, text: req.body.text });
    res.json({ success: true });
});

app.listen(5001, () => console.log('Basic Backend running on http://localhost:5001'));
