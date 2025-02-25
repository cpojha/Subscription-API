import mongoose from 'mongoose';
// import { DB_URI } from '../config/env.js';
const DB_URI = "mongodb://localhost:27017/MyApis";

if(!DB_URI){
    throw new Error("DB_URI is not defined");
}
const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
    } catch (error) {
        console.log('Err connecting DB',error);
        process.exit(1);
    }}

        export default connectToDatabase;