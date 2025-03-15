# **Subscription Tracker API**  

A **Node.js** and **Express.js**-based REST API designed to manage user subscriptions, automate workflows, send email reminders, and enhance user experience with structured automation. The API is powered by **MongoDB**, secured using **JWT authentication**, and deployed using **PM2** for efficient process management on an **Azure Linux Server**.  

This API is designed for **subscription-based businesses**, **workflow automation**, and **email reminder services**. It ensures scalability, security, and performance in production environments.  

---

## **📌 Key Features**  

✅ **User Authentication & Authorization**  
- Secure login and registration with **JWT-based authentication**.  
- Role-based access control (RBAC) for **admin and users**.  

✅ **Subscription Management**  
- Create, update, delete, and retrieve subscription details.  
- Track **subscription status** (active, expired, cancelled).  

✅ **Automated Email Reminders**  
- Sends **subscription renewal reminders** via **Nodemailer**.  
- Configurable reminder intervals (**days before expiry**).  

✅ **Workflow Automation**  
- Allows users to define **custom workflows** for actions like:  
  - **Automated subscription renewal**.  
  - **Custom email notifications**.  
  - **Trigger-based alerts**.  

✅ **Error Handling Middleware**  
- Centralized error handling using **Express middleware**.  

✅ **MongoDB Integration with Mongoose**  
- **Optimized data storage** and schema validation.  

✅ **Logging & Debugging**  
- **PM2 process management** with real-time logging.  

✅ **Production-Ready Deployment**  
- Hosted on **Azure Linux VM** with **port 3000 open**.  

---

# **📂 Project Structure**  

```
Subscription-API/
│── config/
│   ├── database.js          # MongoDB connection setup  
│── middleware/
│   ├── auth.middleware.js   # Authentication middleware  
│   ├── error.middleware.js  # Global error handling  
│   ├── arcjet.middleware.js # Custom middleware for additional processing  
│── models/
│   ├── user.model.js        # Mongoose schema for users  
│   ├── subscription.model.js # Subscription schema  
│   ├── workflow.model.js    # Workflow schema  
│── routes/
│   ├── auth.routes.js       # Routes for authentication  
│   ├── user.routes.js       # Routes for user management  
│   ├── subs.routes.js       # Routes for subscription management  
│   ├── workflow.routes.js   # Routes for workflows  
│── controllers/
│   ├── auth.controller.js   # Handles authentication logic  
│   ├── user.controller.js   # Handles user-related operations  
│   ├── subs.controller.js   # Handles subscription-related operations  
│   ├── email.controller.js  # Handles email reminder services  
│── utils/
│   ├── emailSender.js       # Email sending logic (Nodemailer)  
│   ├── responseHandler.js   # Utility function for API responses  
│── scripts/
│   ├── reminderWorker.js    # Cron job for scheduled reminders  
│── .env.example             # Environment variables sample  
│── index.js                 # Main server file  
│── package.json             # Project dependencies  
│── README.md                # Project documentation  
```

---

# **📧 Automated Email Reminders**  

The API uses **Nodemailer** to send automated email reminders for upcoming subscription renewals.  

### **How It Works:**  
1. A **cron job** runs every 24 hours to check for **subscriptions nearing expiration**.  
2. If a subscription is set to expire within the **configured reminder period**, an **email is sent** to the user.  
3. The reminder email includes **subscription details** and a link to renew the subscription.  

### **Configurable Reminder Settings**  
- Default reminder: **7 days before expiration**.  
- Users can customize **reminder intervals** via API.  

### **Example Email Template**  

```
Subject: Subscription Expiry Reminder - Action Required

Hello [User Name],

Your subscription to [Service Name] is set to expire on [Expiry Date].

To continue enjoying uninterrupted service, please renew your subscription at:

[Renewal Link]

Thank you for choosing us!

Best Regards,  
Subscription Tracker Team
```

---

# **🔄 Workflow Automation**  

This API allows users to create **custom workflows** that automate repetitive tasks like:  

✅ **Subscription Renewal Automation**  
- Auto-renews a subscription when the expiry date is reached.  

✅ **Custom Email Notifications**  
- Sends emails for **successful renewals, failed payments**, etc.  

✅ **Trigger-Based Alerts**  
- Users can define **custom triggers** (e.g., notify admin on new user registration).  

### **Example Workflow Request (JSON)**  

```json
{
  "name": "Auto-renewal Workflow",
  "trigger": "subscription_expiring",
  "action": "renew_subscription",
  "parameters": {
    "days_before": 3
  }
}
```

### **Workflow Execution Process:**  
1. A **trigger event** (e.g., subscription expiry) is detected.  
2. The **corresponding workflow action** is executed automatically.  
3. The user is notified about the action via **email or API response**.  

---

# **🖥️ Deployment on Azure VPS**  

### **Step 1: Install Node.js & PM2 on VPS**  
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pm2
```

### **Step 2: Allow Port 3000 on Azure Firewall**  
Ensure your Azure **Network Security Group (NSG)** allows inbound traffic on **port 3000**:  

1. Go to **Azure Portal** → **Virtual Machines** → **Your VM** → **Networking**.  
2. Click **"Add inbound port rule"** and enter:  
   - **Port:** `3000`  
   - **Protocol:** `TCP`  
   - **Action:** `Allow`  
3. Click **"Save"** and apply changes.  

### **Step 3: Start API using PM2**  
```bash
pm2 start index.js --name subscription-api
pm2 save
pm2 startup
```

### **Step 4: Restart PM2 & Check Logs**  
```bash
pm2 restart subscription-api
pm2 logs subscription-api
```

---

# **📌 API Endpoints**  

## **🔐 Authentication**  
| Method | Endpoint                 | Description            |
|--------|--------------------------|------------------------|
| POST   | `/api/v1/auth/sign-up`  | Register a new user    |
| POST   | `/api/v1/auth/sign-in`     | User login (JWT)       |

## **👤 User Management**  
| Method | Endpoint                  | Description        |
|--------|---------------------------|--------------------|
| GET    | `/api/v1/users`           | Get all users     |
| GET    | `/api/v1/users/:id`       | Get user by ID    |

## **📄 Subscription Management**  
| Method | Endpoint                           | Description               |
|--------|------------------------------------|---------------------------|
| POST   | `/api/v1/subscriptions`           | Create a new subscription |
| GET    | `/api/v1/subscriptions`           | Get all subscriptions     |

## **🔄 Workflow Automation**  
| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| POST   | `/api/v1/workflows`       | Create a workflow   |
| GET    | `/api/v1/workflows`       | Get all workflows   |

---

# **🚀 Future Plans**  

🔹 **Multi-Tier Subscription Plans** (Basic, Premium, Enterprise)  
🔹 **Payment Gateway Integration** (Stripe, Razorpay, PayPal)  
🔹 **AI-Powered Predictive Analytics** for subscription trends  
🔹 **GraphQL Support** for efficient data retrieval  
🔹 **Microservices Architecture** for better scalability  
🔹 **Mobile App API Integration** for native applications  

---
<details>
  <summary>Environment Variables (.env)</summary>

```plaintext
PORT=3000
SERVER_URL="http://localhost:3000"
#kiji
NODE_ENV='development'

DB_URI=""

JWT_SECRET="sec"
JWT_EXPIRES_IN="7d"

ARCJET_KEY=""
ARCJET_ENV="Development"


#upstash

QSTASH_URL=
QSTASH_TOKEN=""
QSTASH_CURRENT_SIGNING_KEY=""
QSTASH_NEXT_SIGNING_KEY=""


#nodemailer

EMAIL_PASSWORD=""

```
</details>
---

# **📜 License**  
This project is licensed under the **MIT License**.  

---
