#!/bin/bash

# Warrity API Server Control Script
# Usage: ./server-control.sh [start|stop|restart|status]

# Configuration
PORT=5000
PID_FILE="./warrity-api.pid"
LOG_FILE="./logs/server.log"
NODE_ENV=${NODE_ENV:-"production"}

# Ensure log directory exists
mkdir -p logs

# Function to start the server
start_server() {
  if [ -f "$PID_FILE" ] && ps -p $(cat "$PID_FILE") > /dev/null; then
    echo "Server is already running with PID: $(cat "$PID_FILE")"
    return 1
  fi

  echo "Starting Warrity API server in $NODE_ENV mode..."
  NODE_ENV=$NODE_ENV nohup node src/server.js > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"
  echo "Server started with PID: $(cat "$PID_FILE")"
  echo "Logs are being written to $LOG_FILE"
}

# Function to stop the server
stop_server() {
  if [ ! -f "$PID_FILE" ]; then
    echo "PID file not found. Server may not be running."
    return 1
  fi

  PID=$(cat "$PID_FILE")
  if ! ps -p $PID > /dev/null; then
    echo "Server is not running (PID: $PID)"
    rm "$PID_FILE"
    return 1
  fi

  echo "Stopping server with PID: $PID"
  kill $PID
  sleep 2

  # Check if process is still running
  if ps -p $PID > /dev/null; then
    echo "Server did not stop gracefully. Forcing termination..."
    kill -9 $PID
  fi

  rm "$PID_FILE"
  echo "Server stopped"
}

# Function to check server status
check_status() {
  if [ -f "$PID_FILE" ] && ps -p $(cat "$PID_FILE") > /dev/null; then
    echo "Server is running with PID: $(cat "$PID_FILE")"
    echo "Port: $PORT"
    echo "Environment: $NODE_ENV"
    echo "Log file: $LOG_FILE"
    return 0
  else
    echo "Server is not running"
    [ -f "$PID_FILE" ] && rm "$PID_FILE"
    return 1
  fi
}

# Main script logic
case "$1" in
  start)
    start_server
    ;;
  stop)
    stop_server
    ;;
  restart)
    stop_server
    sleep 2
    start_server
    ;;
  status)
    check_status
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac

exit 0 