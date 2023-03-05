import express, { json, urlencoded } from 'express';
import { set, connect } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import CustomerRoute from './routes/Customer.route.js';

set('strictQuery', false);

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION

// This is so that we can use the req.body
// to get data from post request
app.use(json());
app.use(urlencoded({ extended: true }));

// for CORs
app.use(cors());

// ENDPOINTS
app.get('/', (req, res) => {
    // console.log(req.method + ' ' + req.url);
    res.json({msg: 'Hello world!'});
});

app.use('/customers', CustomerRoute)

// DB Connection
const start = async() => {
    try {
        connect(CONNECTION);
        
        app.listen(PORT, () => {
            console.log('Server running on port ' + PORT);
        });
    } catch (e) {
        console.log(e.message);
    }
}

// Init
start();
