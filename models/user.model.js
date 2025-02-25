import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxLength: [100, 'Your name cannot exceed 100 characters'],
        minLength: [4, 'Your name must be at least 4 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address'],
        lowercase: true,
       // match: [\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,'Please enter a valid email address']

    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Your password must be at least 6 characters'],
    }
}, { timestamps: true });


const user = mongoose.model('User', userSchema);    


export default mongoose.models.User || user;
// export default user;
// name: {
//     type: String,    