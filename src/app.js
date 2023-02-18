const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

// for CORs
app.use(cors());

// ENDPOINTS
app.get('/', (req, res) => {
    // console.log(req.method + ' ' + req.url);
    res.json({msg: 'Hello world!'});
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

app.get('/api/customers/:id', async (req, res) => {
    // get the id from the url params (using destructuring)
    const { id: customerId } = req.params;
    try {
        // get customer by id
        const customer = await Customer.findById(customerId);
        if (customer !== null) {
            // return customer if exist
            res.json({customer});
        } else {
            res.status(404).json({error: 'user not found'});
        }
    } catch(e) {
        res.status(500).json({error: 'something went wrong'})
    }
});

app.put('/api/customers/:id', async (req, res) => {
    // get the id from the url params (using destructuring)
    const { id: customerId } = req.params;
    try {
        // get customer by id
        const customer = await Customer.findById(customerId);
        if (customer !== null) {
            // update customer if exist (using PUT)
            const customer = await Customer.findOneAndReplace({_id: customerId}, req.body, {new: true});
            // customer.replaceOne(req.body);
            res.send({customer});
        } else {
            res.status(404).json({error: 'user not found'});
        }
    } catch(e) {
        res.status(500).json({error: e.message})
    }
});

app.patch('/api/customers/:id', async (req, res) => {
    // get the id from the url params (using destructuring)
    const { id: customerId } = req.params;
    try {
        // get customer by id
        const customer = await Customer.findById(customerId);
        if (customer !== null) {
            // update customer if exist (using PUT)
            const customer = await Customer.findOneAndUpdate(
                {_id: customerId},
                req.body,
                {new: true}
            );
            // customer.replaceOne(req.body);
            res.send({customer});
        } else {
            res.status(404).json({error: 'user not found'});
        }
    } catch(e) {
        res.status(500).json({error: e.message})
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    // get the id from the url params (using destructuring)
    const { id: customerId } = req.params;
    try {
        // get customer by id
        const customer = await Customer.findById(customerId);
        if (customer !== null) {
            // delete customer if exist (using PUT)
            await customer.deleteOne();
            // const result = await Customer.deleteOne({_id: customerId});
            // console.log(result);
            res.status(200).json({msg: 'user delete'});
        } else {
            res.status(404).json({error: 'user not found'});
        }
    } catch(e) {
        res.status(500).json({error: e.message})
    }
});

// Orders (Handling nested object : which signifies relationships)

app.patch('/api/orders/:id', async (req, res) => {
    const { id: orderId } = req.params;
    req.body._id = orderId; // this is so the patch request doesn't modify the id of the oder
    try {
        const customer = await Customer.findOneAndUpdate(
            // here we are finding the cutomer by the order id
            { 'orders._id': orderId },
            // then updating order
            { $set: { 'orders.$': req.body } },
            // the new returns the updated customer object with the modified orders
            { new: true }
        );
        res.json({customer});
    } catch (e) {
        res.status(500).json({error: e.message})
    }
});

app.get('/api/orders/:id', async (req, res) => {
    const { id: orderId } = req.params;
    req.body._id = orderId; // this is so the patch request doesn't modify the id of the oder
    try {
        const customer = await Customer.findOne(
            // here we are finding the cutomer by the order id
            { 'orders._id': orderId },
        );
        // finds the first order whose id is the orderId passed in as params
        const order = customer.orders.find((e) => e._id == orderId);
        res.json({order});
        
    } catch (e) {
        res.status(500).json({error: e.message})
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
