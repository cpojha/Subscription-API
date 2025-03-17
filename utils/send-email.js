import { emailTemplates } from './email-template.js'
import dayjs from 'dayjs'
import transporter, { accountEmail } from '../config/nodemailer.js'
import { generateVerificationEmailHTML } from './send-otp-temp.js';





export const sendVerificationEmail = async ({ to, userName, otp, verificationLink }) => {
  const html = generateVerificationEmailHTML(otp, verificationLink, userName);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify Your Email Address',
    html
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Verification email sent:', info.response);
        resolve(info);
      }
    });
  });
};




export const sendReminderEmail = async ({ to, type, subscription }) => {
  if(!to || !type) throw new Error('Missing required parameters');

  const template = emailTemplates.find((t) => t.label === type);

  if(!template) throw new Error('Invalid email type');

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  }

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if(error) return console.log(error, 'Error sending email');

    console.log('Email sent: ' + info.response);
  })
}