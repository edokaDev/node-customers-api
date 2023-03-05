import express from 'express';
import Customer from '../models/customer.js';

const router = express.Router();

router.get('test/', (req, res) => {
    // console.log(req.body);
    res.json({"msg": "The customer routes are working fine"});
});

router.get('/', async (req, res) => {
    // console.log(req.body);
    const customers = await Customer.find();
    res.json({customers});
});

router.post('/', async (req, res) => {
    // console.log(req);
    const customer = new Customer(req.body);
    try {
        await customer.save();
        res.status(201).json({customer});
    } catch (e) {
        res.status(400).json({msg: e.message})
    }
});

router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

router.patch('/api/orders/:id', async (req, res) => {
    const { id: orderId } = req.params;
    req.body._id = orderId; // this is so the patch request doesn't modify the id of the oder
    try {
        const customer = await Customer.findOneAndUpdate(
            // here we are Customer.finding the cutomer by the order id
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

router.get('/api/orders/:id', async (req, res) => {
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

export default router;
