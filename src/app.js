const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer');

mongoose.set('strictQuery', false);

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION

// This is so that we can use the req.body
// to get data from post request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ENDPOINTS
app.get('/', (req, res) => {
    // console.log(req.method + ' ' + req.url);
    res.send('Hello world!');
});

app.get('/api/customers', async (req, res) => {
    console.log(req.body);
    const customers = await Customer.find();
    res.json({customers});
});

app.post('/api/customers', async (req, res) => {
    // console.log(req);
    const customer = new Customer(req.body);
    try {
        await customer.save();
        res.status(201).json({customer});
    } catch (e) {
        res.status(400).json({msg: e.message})
    }
});

// DB Connection
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

// Init
start();
