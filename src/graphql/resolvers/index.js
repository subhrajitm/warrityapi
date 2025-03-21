const userResolvers = require('./user.resolvers');
const warrantyResolvers = require('./warranty.resolvers');
const productResolvers = require('./product.resolvers');
const eventResolvers = require('./event.resolvers');

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...warrantyResolvers.Query,
    ...productResolvers.Query,
    ...eventResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...warrantyResolvers.Mutation,
    ...productResolvers.Mutation
  },
  User: {
    ...userResolvers.User
  },
  Warranty: {
    ...warrantyResolvers.Warranty
  },
  Product: {
    ...productResolvers.Product
  },
  Event: {
    ...eventResolvers.Event
  }
};

module.exports = resolvers; 