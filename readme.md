# Subscription API

A robust subscription-based API built with **Node.js**, **Express**, and **Mongoose**, featuring JWT authentication with refresh tokens.

## Features

- **User Authentication**: Secure login and signup with JWT-based authentication.
- **Refresh Token Mechanism**: Implements refresh tokens for session management.
- **Subscription Management**: Create, update, and manage user subscriptions.
- **Database Integration**: Uses **MongoDB** with Mongoose ORM.
- **RESTful API**: Clean and structured API endpoints.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (Access & Refresh Tokens)

## Installation

1. **Clone the repository**  
   ```sh
   git clone https://github.com/cpojha/Subscription-API.git
   cd Subscription-API
   ```

2. **Install dependencies**  
   ```sh
   npm install
   ```

3. **Setup environment variables**  
   Create a `.env.devlopment` file and add the following:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   REFRESH_SECRET=your_refresh_token_secret
   ```

4. **Start the server**  
   ```sh
   npm start
   ```
   The API will be available at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint           | Description                |
|--------|-------------------|----------------------------|
| POST   | `/api/auth/signup`  | Register a new user        |
| POST   | `/api/auth/login`   | Authenticate user          |
| POST   | `/api/auth/refresh` | Generate new access token  |
| GET    | `/api/subscription` | Get user subscription info |
| POST   | `/api/subscription` | Create a subscription      |

## Contributing

Feel free to fork this repository and submit pull requests for improvements.

## License

This project is licensed under the MIT License.

---

Made by [Chandra Prakash Ojha](https://github.com/cpojha/)
