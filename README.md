# 🚲 Bike Rental Reservation System Backend

Welcome to the Bike Rental Reservation System backend project! This backend is designed to support a seamless bike rental service. Below you'll find a comprehensive overview of the project, its features, the technologies used, and how to set it up and run it on your local machine.

Backend Api Live: [https://bike-rental-backend-as5.vercel.app/]

---

## 📖 Overview

This backend system is developed for a bike rental service that allows users to register, log in, view available bikes, and book them for a rental period. The system is equipped with CRUD operations, user authentication, and robust error handling to ensure a smooth user experience.

## ✨ Features

- **User Authentication and Authorization:** Secure sign-up, login, and profile management.
- **Bike Management:** CRUD operations for managing bikes (admin only).
- **Rental Management:** Create and manage bike rentals with automatic cost calculation.
- **Bike, User, Coupon, Profile, CRUD Management.
- **Error Handling:** Comprehensive error handling for robust API responses.
- **Data Validation:** Uses Zod for request validation to ensure data integrity.

## 🛠️ Technologies Used

- **Programming Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Validation Library:** Zod
- **Authentication:** JWT (JSON Web Token)
- **Cludinary for Image CRUD

## 🚀 Getting Started

Follow these instructions to get the backend up and running on your local machine.

### Prerequisites

- Node.js
- MongoDB

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/imtanvir/bike-rental-backend.git
   cd bike-rental-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   MONGO_URI=mongodb://mongodb_credentials/bike-rental
   JWT_SECRET=your_jwt_secret
    etc ...
   ```

4. **Run the application:**

   ```bash
   //for locally
   npm run start:dev
   ```

   The server will start on `http://localhost:5000`.

## 📚 API Endpoints

Here’s a detailed reference for the API endpoints available in the system.

### User Routes

#### **Sign Up**

- **Route:** `/api/auth/signup`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "address": "123 Main St, Anytown",
    "role": "user"
  }
  ```

- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
      /* user data */
    }
  }
  ```

#### **Login**

- **Route:** `/api/auth/login`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "User logged in successfully",
    "token": "jwt_token",
    "data": {
      /* user data */
    }
  }
  ```

#### **Get Profile**

- **Route:** `/api/users/me`
- **Method:** `GET`
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "User profile retrieved successfully",
    "data": {
      /* user data */
    }
  }
  ```

#### **Update Profile**

- **Route:** `/api/users/me`
- **Method:** `PUT`
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Request Body:**

  ```json
  {
    "name": "John Updated",
    "phone": "0987654321"
  }
  ```

- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Profile updated successfully",
    "data": {
      /* updated user data */
    }
  }
  ```

### Bike Routes

#### **Create Bike (Admin Only)**

- **Route:** `/api/bikes`
- **Method:** `POST`
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Request Body:**

  ```json
  {
    "name": "Mountain Bike",
    "description": "A durable mountain bike for rough terrains.",
    "pricePerHour": 15,
    "cc": 250,
    "year": 2022,
    "model": "X1",
    "brand": "Yamaha"
  }
  ```

- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Bike added successfully",
    "data": {
      /* bike data */
    }
  }
  ```

#### **Get All Bikes**

- **Route:** `/api/bikes`
- **Method:** `GET`
- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Bikes retrieved successfully",
    "data": [
      /* list of bikes */
    ]
  }
  ```

#### **Update Bike (Admin Only)**

- **Route:** `/api/bikes/:id`
- **Method:** `PUT`
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Request Body:**

  ```json
  {
    "pricePerHour": 20
  }
  ```

- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Bike updated successfully",
    "data": {
      /* updated bike data */
    }
  }
  ```

#### **Delete Bike (Admin Only)**

- **Route:** `/api/bikes/:id`
- **Method:** `DELETE`
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Bike deleted successfully",
    "data": {
      /* deleted bike data */
    }
  }
  ```

### Rental Routes

#### **Create Rental**

- **Route:** `/api/rentals`
- **Method:** `POST`
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Request Body:**

  ```json
  {
    "bikeId": "60d9c4e4f3b4b544b8b8d1c4",
    "startTime": "2024-06-10T09:00:00Z"
  }
  ```

- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Rental created successfully",
    "data": {
      /* rental data */
    }
  }
  ```

#### **Return Bike (Admin Only)**

- **Route:** `/api/rentals/:id/return`
- **Method:** `PUT`
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Request Body:** Not needed
- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Bike returned successfully",
    "data": {
      /* updated rental data */
    }
  }
  ```

#### **Get All Rentals for User**

- **Route:** `/api/rentals`
- **Method:** `GET`
- **Request Headers:** `Authorization: Bearer jwt_token`
- **Response:**

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Rentals retrieved successfully",
    "data": [
      /* list of rentals */
    ]
  }
  ```

## ⚠️ Error Handling and Validation

The system is equipped with a global error handler to catch and handle errors gracefully, providing meaningful responses. We use Zod for validating request bodies to ensure the data integrity of user inputs.

### Error Response Format

- **Success:** `false`
- **Message:** A descriptive error message.
- **Error Messages:**

  ```json
  [
    {
      "path": "",
      "message": "Detailed error message"
    }
  ]
  ```

### Common Errors

- **No Data Found:**

  ```json
  {
    "success": false,
    "message": "No Data Found",
    "data": []
  }
  ```

- **Route Not Found:**

  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Not Found"
  }
  ```

- **Unauthorized Access:**

  ```json
  {
    "success": false,
    "statusCode": 401,
    "message": "You have no access to this route"
  }
  ```

## 🛡️ Security Considerations

- **JWT Tokens:** Secure authentication using JWT tokens.
- **Password Hashing:** User passwords are securely hashed before storage.
-
