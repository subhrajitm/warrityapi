const { GraphQLError } = require('graphql');
const Product = require('../../models/product.model');
const Warranty = require('../../models/warranty.model');
const Event = require('../../models/event.model');

const productResolvers = {
  Query: {
    product: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      const product = await Product.findById(id);
      if (!product) throw new GraphQLError('Product not found');
      return product;
    },
    products: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      return Product.find();
    }
  },

  Mutation: {
    createProduct: async (_, args, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      if (user.role !== 'admin') throw new GraphQLError('Not authorized');

      const product = new Product(args);
      await product.save();

      // Create event log
      const event = new Event({
        type: 'product_created',
        description: `Created product: ${product.name}`,
        metadata: JSON.stringify({ productId: product._id }),
        user: user.id
      });
      await event.save();

      return product;
    },

    updateProduct: async (_, { id, ...updates }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      if (user.role !== 'admin') throw new GraphQLError('Not authorized');

      const product = await Product.findById(id);
      if (!product) throw new GraphQLError('Product not found');

      Object.assign(product, updates);
      await product.save();

      // Create event log
      const event = new Event({
        type: 'product_updated',
        description: `Updated product: ${product.name}`,
        metadata: JSON.stringify({ productId: product._id }),
        user: user.id
      });
      await event.save();

      return product;
    },

    deleteProduct: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      if (user.role !== 'admin') throw new GraphQLError('Not authorized');

      const product = await Product.findById(id);
      if (!product) throw new GraphQLError('Product not found');

      // Check if product has associated warranties
      const warrantyCount = await Warranty.countDocuments({ product: id });
      if (warrantyCount > 0) {
        throw new GraphQLError('Cannot delete product with associated warranties');
      }

      await product.remove();

      // Create event log
      const event = new Event({
        type: 'product_deleted',
        description: `Deleted product: ${product.name}`,
        metadata: JSON.stringify({ productId: product._id }),
        user: user.id
      });
      await event.save();

      return true;
    }
  },

  Product: {
    warranties: async (parent) => {
      return Warranty.find({ product: parent._id });
    }
  }
};

module.exports = productResolvers; 