const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const { GraphQLError } = require('graphql');

const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      return User.findById(user.id);
    },
    user: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      return User.findById(id);
    },
    users: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      if (user.role !== 'admin') throw new GraphQLError('Not authorized');
      return User.find();
    }
  },

  Mutation: {
    register: async (_, { email, password, firstName, lastName }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new GraphQLError('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'user'
      });

      await user.save();

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new GraphQLError('Invalid credentials');
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      return { token, user };
    }
  },

  User: {
    warranties: async (parent) => {
      const Warranty = require('../../models/warranty.model');
      return Warranty.find({ user: parent._id });
    }
  }
};

module.exports = userResolvers; 