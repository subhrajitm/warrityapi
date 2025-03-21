const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Using connection string:', process.env.MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'));
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('Connected to database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    
    // Test if we can perform operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(collection => console.log(`- ${collection.name}`));
    
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\nPossible issues:');
      console.error('1. Check your internet connection');
      console.error('2. Verify the MongoDB Atlas cluster hostname is correct');
    } else if (error.message.includes('Authentication failed')) {
      console.error('\nPossible issues:');
      console.error('1. Username or password is incorrect');
      console.error('2. Database user might not have the correct permissions');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.error('\nPossible issues:');
      console.error('1. Your IP address might not be whitelisted in MongoDB Atlas');
      console.error('2. Firewall might be blocking the connection');
      console.error('3. VPN might be interfering with the connection');
    }
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

testConnection(); 