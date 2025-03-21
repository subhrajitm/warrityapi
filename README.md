# Warrity API

A GraphQL API for managing product warranties, built with Node.js, Express, and Apollo Server.

## Features

- User authentication with JWT
- Product management
- Warranty tracking
- Document uploads
- Event logging
- Rate limiting
- Input validation
- File upload handling
- CORS support
- Security headers
- Compression
- Logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis (optional, for caching)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/warrityapi.git
cd warrityapi
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/warrity
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
UPLOAD_PATH=uploads
```

4. Create required directories:
```bash
mkdir uploads logs
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5001` with hot-reloading enabled.

## Production

Build and start the production server:
```bash
npm run build
npm start
```

## Docker

Build and run with Docker:
```bash
docker-compose up --build
```

## API Testing

### GraphQL Playground

Access the GraphQL playground at `http://localhost:5001` to test queries and mutations interactively.

### Postman Collection

A Postman collection is available in the `postman` folder for testing the API:

1. Import the collection and environment files:
   - `postman/warrity-api.postman_collection.json`
   - `postman/warrity-api.postman_environment.json`

2. Set up the environment variables:
   - `baseUrl`: API base URL (default: http://localhost:5001)
   - `token`: JWT token (set after login)
   - `userId`: User ID (set after registration)
   - `productId`: Product ID (set after creating a product)

3. Test the API:
   - Start with the "Register User" request
   - Copy the token from the response
   - Set the token in the environment variables
   - Use other authenticated requests

Example workflow:
1. Register a new user
2. Login to get the JWT token
3. Create a product
4. Create a warranty for the product
5. View user's warranties

## API Documentation

### Authentication

#### Register User
```graphql
mutation {
  register(
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  ) {
    token
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}
```

#### Login
```graphql
mutation {
  login(
    email: String!
    password: String!
  ) {
    token
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}
```

### Products

#### Create Product
```graphql
mutation {
  createProduct(
    name: String!
    description: String!
    category: String!
    manufacturer: String!
    modelNumber: String!
  ) {
    id
    name
    description
    category
    manufacturer
    modelNumber
  }
}
```

#### Get Products
```graphql
query {
  products {
    id
    name
    description
    category
    manufacturer
    modelNumber
  }
}
```

### Warranties

#### Create Warranty
```graphql
mutation {
  createWarranty(
    productId: ID!
    purchaseDate: String!
    expirationDate: String!
    warrantyProvider: String!
    warrantyNumber: String!
    coverageDetails: String!
    notes: String
  ) {
    id
    warrantyNumber
    purchaseDate
    expirationDate
    warrantyProvider
    coverageDetails
    notes
  }
}
```

#### Get User Warranties
```graphql
query {
  warranties {
    id
    warrantyNumber
    purchaseDate
    expirationDate
    warrantyProvider
    coverageDetails
    notes
    product {
      name
      manufacturer
    }
  }
}
```

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Security headers with Helmet
- Input validation with Joi
- File upload validation
- Role-based access control

## Error Handling

The API uses standardized error responses:
```json
{
  "errors": [
    {
      "message": "Error message",
      "locations": [...],
      "path": [...],
      "extensions": {
        "code": "ERROR_CODE"
      }
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
