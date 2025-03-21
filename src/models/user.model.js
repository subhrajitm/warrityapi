const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profilePicture: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: ''
  },
  socialLinks: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to return user data without sensitive information
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Create test users if they don't exist
userSchema.statics.createTestUsers = async function() {
  const testUsers = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Test User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    }
  ];

  for (const userData of testUsers) {
    try {
      const existingUser = await this.findOne({ email: userData.email });
      if (!existingUser) {
        await this.create(userData);
        console.log(`Created test user: ${userData.email}`);
      }
    } catch (error) {
      console.error(`Error creating test user ${userData.email}:`, error);
    }
  }
};

const User = mongoose.model('User', userSchema);

// Create test users when the model is first loaded
User.createTestUsers().catch(console.error);

module.exports = User; 