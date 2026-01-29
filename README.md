# Product Management System - Assignment 4

Secure CRUD API with JWT Authentication and Role-Based Access Control (RBAC) using MVC architecture.

## Features

- ✅ **MVC Architecture** - Organized code structure
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **RBAC** - Role-based access control (User/Admin)
- ✅ **Password Hashing** - bcrypt encryption
- ✅ **Multi-Object CRUD** - Products & Reviews
- ✅ **Protected Routes** - Admin-only endpoints

## Technologies

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

## Project Structure (MVC)

```
assignment4/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User schema with auth methods
│   ├── Product.js           # Product schema
│   └── Review.js            # Review schema
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── productController.js # Product CRUD logic
│   └── reviewController.js  # Review CRUD logic
├── routes/
│   ├── auth.js              # Auth routes
│   ├── products.js          # Product routes
│   └── reviews.js           # Review routes
├── middleware/
│   ├── auth.js              # JWT verification & RBAC
│   └── errorHandler.js      # Error handling
├── public/
│   └── index.html           # Frontend with auth
├── .env
├── package.json
└── server.js                # App entry point
```

## Installation

```bash
# Install dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken express-validator

# Create .env file
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
```

## Running

```bash
npm start
```

Open http://localhost:3000

## Authentication Flow

### 1. Register User
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // or "admin"
}
```

### 2. Login
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Use Token
Add to request headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

### Auth Routes (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/me` - Update profile (Protected)

### Product Routes
- `GET /api/products` - Get all products (Public)
- `GET /api/products/:id` - Get single product (Public)
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Review Routes
- `GET /api/products/:productId/reviews` - Get product reviews (Public)
- `GET /api/reviews/:id` - Get single review (Public)
- `POST /api/products/:productId/reviews` - Create review (Authenticated users)
- `PUT /api/reviews/:id` - Update review (Admin only)
- `DELETE /api/reviews/:id` - Delete review (Admin only)

## Access Control (RBAC)

### Public Access
- GET requests (Read products and reviews)
- Registration and login

### Authenticated Users
- Create reviews
- View own profile

### Admin Only
- Create, Update, Delete products
- Update, Delete reviews

## Request Examples

### Create Product (Admin)
```
POST /api/products
Headers: 
  Authorization: Bearer YOUR_ADMIN_TOKEN
  Content-Type: application/json

Body:
{
  "name": "iPhone 15 Pro",
  "price": 999.99,
  "description": "Latest Apple smartphone",
  "category": "Electronics",
  "quantity": 50
}
```

### Create Review (Any authenticated user)
```
POST /api/products/:productId/reviews
Headers: 
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json

Body:
{
  "author": "John Doe",
  "rating": 5,
  "comment": "Excellent product!"
}
```

## Testing

### Test Accounts

**Admin Account:**
```
Email: admin@test.com
Password: admin123
```

**Regular User:**
```
Email: user@test.com
Password: user123
```

### Using Postman

1. Register/Login to get JWT token
2. Copy the token
3. Add to Authorization header: `Bearer YOUR_TOKEN`
4. Test protected endpoints

## Security Features

### Password Security
- Passwords hashed using bcrypt
- Salt rounds: 10 (configurable)
- Never stored in plain text
- Passwords excluded from query results

### JWT Security
- Token expiration (7 days default)
- Signed with secret key
- Contains user ID, email, and role
- Verified on protected routes

### Role-Based Access
- Middleware checks user role
- Admin-only routes return 403 if unauthorized
- User info attached to request object

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Required role: admin"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Field is required"]
}
```

## Assignment Requirements

### ✅ MVC Architecture
- [x] Separate models, controllers, routes
- [x] Middleware folder
- [x] Config folder
- [x] Clean code organization

### ✅ Multi-Object CRUD
- [x] Primary: Product (full CRUD)
- [x] Secondary: Review (full CRUD)
- [x] Relationships between objects

### ✅ Authentication
- [x] User model with email/password/role
- [x] Password hashing with bcrypt
- [x] JWT token generation
- [x] Login/Register endpoints

### ✅ RBAC
- [x] Public: GET routes
- [x] Authenticated: Create reviews
- [x] Admin: POST/PUT/DELETE products
- [x] Role verification middleware

## Troubleshooting

**"Invalid token"**
- Check token format: `Bearer TOKEN`
- Verify token hasn't expired
- Ensure JWT_SECRET matches

**"Access denied"**
- Check user role (admin vs user)
- Verify token is valid
- Login again if token expired

**"User already exists"**
- Email must be unique
- Try different email

## Environment Variables

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/assignment4_db
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
```
