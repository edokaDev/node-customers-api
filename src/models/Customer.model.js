import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    industry: String,
    orders: [
        {
            description: String,
            amountInNaira: Number
        }
    ]
});

const Customer = model('Customer', customerSchema);

export default Customer;
