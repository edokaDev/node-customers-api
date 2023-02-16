const express = require('express');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION

app.get('/', (req, res) => {
    // console.log(req.method + ' ' + req.url);
    res.send('Hello world!');
});


const start = async() => {
    try {
        await mongoose.connect(CONNECTION);
        
        app.listen(PORT, () => {
            console.log('Server running on port ' + PORT);
        });
    } catch (e) {
        console.log(e.message);
    }
}

start();
