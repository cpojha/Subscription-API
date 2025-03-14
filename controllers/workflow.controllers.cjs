/* eslint-disable no-undef */
const dayjs = require('dayjs');
const { serve } = require("@upstash/workflow/express");
// Remove this line
// const sendReminderEmail = require('../utils/send-email.js');

const REMINDERS = [7, 5, 2, 1];

exports.sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }

    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  const { default: Subscription } = await import('../models/subs.model.js');
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);
    
    // Fix the import to correctly access the named export
    const sendEmailModule = await import('../utils/send-email.js');
    const { sendReminderEmail } = sendEmailModule; // Access the named export correctly
    
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};