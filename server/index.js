import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import handleErrors from './middlewares/handle-errors.js';
import mongoose from 'mongoose';
import router from './router/router.js';

const port = process.env.PORT ?? 5000;
const app = express();

app.use(
    cors(),
    cookieParser(),
    express.json()
);

app.use('/api/user', router);
app.use(handleErrors);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(port, () => {
            console.log(`LISTENING ON ${port}`);
        });    
    } catch (error) {
        console.error(error);
    }
};

start();