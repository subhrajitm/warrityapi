#!/bin/bash
cd dist
npm ci --production
NODE_ENV=production PORT=8080 node index.js 