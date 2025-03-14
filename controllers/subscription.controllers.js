import Subscription from '../models/subs.model.js';
import mongoose from 'mongoose';
import { workflowClient } from '../config/upstash.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.development.local' });
const SERVER_URL = process.env.SERVER_URL;

// Complete implementation of calculateRenewalDate
const calculateRenewalDate = (startDate, frequency) => {
  // Create a new date object from the startDate to avoid modifying the original
  const date = new Date(startDate);
  
  switch(frequency.toLowerCase()) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'semiannually':
      date.setMonth(date.getMonth() + 6);
      break;
    default:
      // Default to monthly if unknown frequency
      date.setMonth(date.getMonth() + 1);
      break;
  }
  
  return date;
};

export const createSubscription = async (req, res, next) => {
  try {
    console.log('req.user:', req.user); // Debugging statement
    console.log('req.body:', req.body); // Debugging statement

    // Validate request body
    const { name, startDate, currency, paymentMethod, frequency, price, category } = req.body;
    if (!name || !startDate || !currency || !paymentMethod || !frequency || !price || !category) {
      console.log('Validation failed'); // Debugging statement
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check MongoDB connection status
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

    console.log('Creating subscription with direct MongoDB API...'); // Debugging statement
    
    // Try with low-level MongoDB API instead of Mongoose
    const subscriptionData = {
      ...req.body,
      user: req.user.userId,
      renewalDate: calculateRenewalDate(req.body.startDate, req.body.frequency),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Log for verification
    console.log('Start date:', new Date(req.body.startDate));
    console.log('Calculated renewal date:', calculateRenewalDate(req.body.startDate, req.body.frequency));
    
    try {
      // Get the collection directly
      const collection = mongoose.connection.db.collection('subscriptions');
      const result = await collection.insertOne(subscriptionData);
      console.log('Direct MongoDB insertion result:', result);
      
      if (result.insertedId) {
        const subscription = { _id: result.insertedId, ...subscriptionData };
        console.log('subscription created:', subscription); // Debugging statement
        
        try {
          console.log('Triggering workflow...'); // Debugging statement
          const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
              subscriptionId: result.insertedId.toString(),
            },
            headers: {
              'content-type': 'application/json',
            },
            retries: 0,
          });

          console.log('workflowRunId:', workflowRunId); // Debugging statement
          return res.status(201).json({ success: true, data: { subscription, workflowRunId } });
        } catch (workflowError) {
          console.error('Workflow trigger error:', workflowError); // Debugging statement
          // Still return success for the subscription but note workflow failure
          return res.status(201).json({ 
            success: true, 
            data: { subscription },
            workflow: { triggered: false, error: workflowError.message }
          });
        }
      } else {
        throw new Error('Failed to insert subscription');
      }
    } catch (dbError) {
      console.error('Error creating subscription in DB:', dbError); // Debugging statement
      return res.status(500).json({ success: false, message: `Failed to create subscription in DB: ${dbError.message}` });
    }
  } catch (e) {
    console.error('Error occurred:', e); // Debugging statement
    next(e);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if (req.user.userId !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
};