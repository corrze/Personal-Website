#!/bin/bash
echo "Pulling latest code..."
git pull origin main

echo "Restarting server with PM2..."
pm2 restart mysite
