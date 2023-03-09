import express, { json, urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import CustomerRoute from './routes/Customer.route.js';
import createError from 'http-errors';
import morgan from 'morgan';
import initMongo from './helpers/init_mongodb.js';

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

// for request logging
app.use(morgan('dev'));

// ENDPOINTS
app.get('/', (req, res) => {
    // console.log(req.method + ' ' + req.url);
    res.json({msg: 'Hello world!'});
});

app.use('/customers', CustomerRoute);

// routes error handling
app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status = err.status || 500;
    res.send({
        "error": {
            "status": err.status,
            "message": err.message,
        }
    })
})

// DB Connection
const start = async() => {
    try {
        initMongo();

        app.listen(PORT, () => {
            console.log('Server running on port ' + PORT);
        });
    } catch (e) {
        console.log(e.message);
    }
}

// Init
start();
