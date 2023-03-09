import mongoose from 'mongoose';

export default function initMongo(){

    mongoose.set('strictQuery', false);

    if (process.env.OFFLINE) {
        mongoose.connect(process.env.MONGO_LOCAL_URI, {
            dbName: process.env.MONGO_LOCAL_DBNAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('mongodb connected locally.')
        })
        .catch((err) => console.log(err.message))
    } else {
        const CONNECTION = process.env.MONGO_ATLAS;
        mongoose.connect(CONNECTION);
    }
    mongoose.connection.on('connected', () => {
        console.log('Database connect successful')
    })
    mongoose.connection.on('error', (err) => {
        console.log(err.message)
    })
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection is disconnected')
    })

    // this watches for closure of the process
    // usually by Ctrl-C
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        process.exit(0);
    })
}
