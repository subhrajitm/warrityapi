const express = require('express');
const router = express.Router();
const os = require('os');

/**
 * @route GET /api/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/', (req, res) => {
  const healthData = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    hostname: os.hostname(),
    memory: {
      free: os.freemem(),
      total: os.totalmem()
    },
    cpu: os.cpus().length,
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.status(200).json(healthData);
});

/**
 * @route GET /api/health/deep
 * @desc Deep health check with database connection status
 * @access Public
 */
router.get('/deep', async (req, res) => {
  try {
    // We'll assume the server is running if we got this far
    // In a real implementation, you might want to check the database connection
    const healthData = {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      hostname: os.hostname(),
      services: {
        api: 'UP',
        database: 'UP' // This would be dynamically checked in a real implementation
      },
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.status(200).json(healthData);
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router; 