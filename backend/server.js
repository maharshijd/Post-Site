const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

/* middleware */
app.use(cors());
app.use(express.json());


/* in-memory storage */
const users = [];
const posts = [];


/* AUTH ROUTE */

app.post('/auth', (req, res) => {

    const { username, password, action } = req.body;

    if (action === 'register') {

        users.push({
            username,
            password
        });

        return res.json({
            success: true,
            message: 'Registered successfully'
        });

    }

    if (action === 'login') {

        const user = users.find(
            u =>
                u.username === username &&
                u.password === password
        );

        if (user) {

            return res.json({
                success: true
            });

        }

        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });

    }

});


/* POSTS */

app.get('/posts', (req, res) => {

    res.json(posts);

});


app.post('/posts', (req, res) => {

    posts.unshift({

        author: req.body.author,
        text: req.body.text

    });

    res.json({

        success: true

    });

});


/* SERVE FRONTEND BUILD */

app.use(

    express.static(

        path.join(__dirname, '../frontend/build')

    )

);


/* REACT ROUTES FIX (Express v5 compatible) */

app.get(/.*/, (req, res) => {

    res.sendFile(

        path.join(

            __dirname,
            '../frontend/build/index.html'

        )

    );

});


/* PORT FOR RENDER */

const PORT = process.env.PORT || 8000;


app.listen(

    PORT,

    () => {

        console.log(
            'Server running on port',
            PORT
        );

    }

);
