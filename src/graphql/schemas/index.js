const { gql } = require('graphql-tag');

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Document {
    filename: String!
    originalName: String!
    path: String!
    mimetype: String!
    size: Int!
    uploadedAt: String!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: String!
    createdAt: String!
    updatedAt: String!
    warranties: [Warranty!]
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    category: String!
    manufacturer: String!
    modelNumber: String!
    createdAt: String!
    updatedAt: String!
    warranties: [Warranty!]
  }

  type Warranty {
    id: ID!
    user: User!
    product: Product!
    purchaseDate: String!
    expirationDate: String!
    warrantyProvider: String!
    warrantyNumber: String!
    coverageDetails: String!
    notes: String
    status: String!
    documents: [Document!]
    createdAt: String!
    updatedAt: String!
  }

  type Event {
    id: ID!
    type: String!
    description: String!
    metadata: String
    user: User!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    user(id: ID!): User
    users: [User!]!
    warranty(id: ID!): Warranty
    warranties: [Warranty!]!
    userEvents: [Event!]!
    product(id: ID!): Product
    products: [Product!]!
    event(id: ID!): Event
    events: [Event!]!
  }

  type Mutation {
    register(email: String!, password: String!, firstName: String!, lastName: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createProduct(
      name: String!
      description: String!
      category: String!
      manufacturer: String!
      modelNumber: String!
    ): Product!
    updateProduct(
      id: ID!
      name: String
      description: String
      category: String
      manufacturer: String
      modelNumber: String
    ): Product!
    deleteProduct(id: ID!): Boolean!
    createWarranty(
      productId: ID!
      purchaseDate: String!
      expirationDate: String!
      warrantyProvider: String!
      warrantyNumber: String!
      coverageDetails: String!
      notes: String
    ): Warranty!
    updateWarranty(
      id: ID!
      purchaseDate: String
      expirationDate: String
      warrantyProvider: String
      warrantyNumber: String
      coverageDetails: String
      notes: String
    ): Warranty!
    deleteWarranty(id: ID!): Boolean!
    uploadDocument(warrantyId: ID!, file: Upload!): Document!
    deleteDocument(warrantyId: ID!, documentId: ID!): Boolean!
  }
`;

module.exports = typeDefs; 