const { GraphQLError } = require('graphql');
const Event = require('../../models/event.model');
const User = require('../../models/user.model');

const eventResolvers = {
  Query: {
    event: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      if (user.role !== 'admin') throw new GraphQLError('Not authorized');
      
      const event = await Event.findById(id);
      if (!event) throw new GraphQLError('Event not found');
      return event;
    },
    events: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      if (user.role !== 'admin') throw new GraphQLError('Not authorized');
      
      return Event.find();
    },
    userEvents: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      return Event.find({ user: user.id });
    }
  },

  Event: {
    user: async (parent, _, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      return User.findById(parent.user);
    }
  }
};

module.exports = eventResolvers; 