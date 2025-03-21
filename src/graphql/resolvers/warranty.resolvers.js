const { GraphQLError } = require('graphql');
const Warranty = require('../../models/warranty.model');
const Product = require('../../models/product.model');
const User = require('../../models/user.model');
const Event = require('../../models/event.model');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const warrantyResolvers = {
  Query: {
    warranty: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      const warranty = await Warranty.findById(id);
      if (!warranty) throw new GraphQLError('Warranty not found');
      if (warranty.user.toString() !== user.id && user.role !== 'admin') {
        throw new GraphQLError('Not authorized');
      }
      return warranty;
    },
    warranties: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      if (user.role === 'admin') {
        return Warranty.find();
      }
      return Warranty.find({ user: user.id });
    }
  },

  Mutation: {
    createWarranty: async (_, args, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      
      const product = await Product.findById(args.productId);
      if (!product) throw new GraphQLError('Product not found');

      const warranty = new Warranty({
        ...args,
        user: user.id
      });

      await warranty.save();

      // Create event log
      const event = new Event({
        type: 'warranty_created',
        description: `Created warranty for product: ${product.name}`,
        metadata: JSON.stringify({ warrantyId: warranty._id, productId: product._id }),
        user: user.id
      });
      await event.save();

      return warranty;
    },

    updateWarranty: async (_, { id, ...updates }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      
      const warranty = await Warranty.findById(id);
      if (!warranty) throw new GraphQLError('Warranty not found');
      
      if (warranty.user.toString() !== user.id && user.role !== 'admin') {
        throw new GraphQLError('Not authorized');
      }

      Object.assign(warranty, updates);
      await warranty.save();

      // Create event log
      const event = new Event({
        type: 'warranty_updated',
        description: `Updated warranty: ${warranty.warrantyNumber}`,
        metadata: JSON.stringify({ warrantyId: warranty._id }),
        user: user.id
      });
      await event.save();

      return warranty;
    },

    deleteWarranty: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      
      const warranty = await Warranty.findById(id);
      if (!warranty) throw new GraphQLError('Warranty not found');
      
      if (warranty.user.toString() !== user.id && user.role !== 'admin') {
        throw new GraphQLError('Not authorized');
      }

      // Delete associated documents
      for (const doc of warranty.documents) {
        const filePath = path.join(process.cwd(), doc.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await warranty.remove();

      // Create event log
      const event = new Event({
        type: 'warranty_deleted',
        description: `Deleted warranty: ${warranty.warrantyNumber}`,
        metadata: JSON.stringify({ warrantyId: warranty._id }),
        user: user.id
      });
      await event.save();

      return true;
    },

    uploadDocument: async (_, { warrantyId, file }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      
      const warranty = await Warranty.findById(warrantyId);
      if (!warranty) throw new GraphQLError('Warranty not found');
      
      if (warranty.user.toString() !== user.id && user.role !== 'admin') {
        throw new GraphQLError('Not authorized');
      }

      try {
        const { filename, mimetype, encoding, createReadStream } = await file;
        const stream = createReadStream();
        const uploadDir = path.join(process.cwd(), process.env.UPLOAD_PATH || 'uploads');
        
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uniqueFilename = `${uuidv4()}-${filename}`;
        const filePath = path.join(uploadDir, uniqueFilename);
        const writeStream = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
          stream
            .pipe(writeStream)
            .on('finish', resolve)
            .on('error', reject);
        });

        const document = {
          filename: uniqueFilename,
          originalName: filename,
          path: path.join(process.env.UPLOAD_PATH || 'uploads', uniqueFilename),
          mimetype,
          size: fs.statSync(filePath).size,
          uploadedAt: new Date().toISOString()
        };

        warranty.documents.push(document);
        await warranty.save();

        // Create event log
        const event = new Event({
          type: 'document_uploaded',
          description: `Uploaded document: ${filename} for warranty: ${warranty.warrantyNumber}`,
          metadata: JSON.stringify({ warrantyId: warranty._id, documentId: document._id }),
          user: user.id
        });
        await event.save();

        return document;
      } catch (error) {
        throw new GraphQLError(`Failed to upload document: ${error.message}`);
      }
    },

    deleteDocument: async (_, { warrantyId, documentId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      
      const warranty = await Warranty.findById(warrantyId);
      if (!warranty) throw new GraphQLError('Warranty not found');
      
      if (warranty.user.toString() !== user.id && user.role !== 'admin') {
        throw new GraphQLError('Not authorized');
      }

      const document = warranty.documents.id(documentId);
      if (!document) throw new GraphQLError('Document not found');

      const filePath = path.join(process.cwd(), document.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      document.remove();
      await warranty.save();

      // Create event log
      const event = new Event({
        type: 'document_deleted',
        description: `Deleted document: ${document.originalName} from warranty: ${warranty.warrantyNumber}`,
        metadata: JSON.stringify({ warrantyId: warranty._id, documentId: document._id }),
        user: user.id
      });
      await event.save();

      return true;
    }
  },

  Warranty: {
    user: async (parent) => {
      return User.findById(parent.user);
    },
    product: async (parent) => {
      return Product.findById(parent.product);
    }
  }
};

module.exports = warrantyResolvers; 