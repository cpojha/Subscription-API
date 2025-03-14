import mongoose from 'mongoose';
// eslint-disable-next-line no-unused-vars
import validator from 'validator';
const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxLength: [100, 'Your name cannot exceed 100 characters'],
        minLength: [2, 'Your name must be at least 4 characters']
    },
   price: {
        type: Number,
        required: [true, 'Please enter your price'],
        min: [1, 'Price must be at least 1']
    },    
    currency: {
        type: String,
       enum: ['USD', 'INR', 'EUR', 'GBP'],
        default: 'INR'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly'
    },
    category: {
        type: String,
        enum: ['sports', 'entertainment', 'news', 'music'],
        default: 'news',
        required: [true, 'Please enter your category']
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'paypal', 'upi', 'netbanking'],
        default: 'card',
        required: [true, 'Please enter your payment method'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active',
        //required: [true, 'Please enter your status']
    },
    startDate: {
        type: Date,
        default: Date.now,
       validate: {
            validator: (value) => { value <= new Date() },
            message: 'Start date must be a in past date',
        }
    },
    renewalDate: {
        type: Date,
        default: Date.now,
       validate: {
            validator: function (value)  { 
               return value >= this.startDate },
            message: 'Renewal date must be a future date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true });
// auto calculate renewal date

// eslint-disable-next-line no-unused-vars
subscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate){
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
 //   this.renewalDate= new Date(this.startDate);
        this.renewalDate = new Date(this.startDate.getTime() + renewalPeriod[this.frequency]*24*60*60*1000);
    }
// Auto update the status if renewal date is passed
    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }

});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;