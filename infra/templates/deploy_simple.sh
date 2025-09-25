#!/bin/bash
# Simple deployment script for static files
set -e

# Update system
dnf update -y

# Install Apache
dnf install -y httpd git

# Start and enable Apache
systemctl enable httpd
systemctl start httpd

# Create health check file
echo "ok" > /var/www/html/health

# Set proper permissions
chown -R apache:apache /var/www/html/
chmod -R 755 /var/www/html/

# Configure firewall
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# Log completion
echo "$(date): Simple deployment completed" >> /var/log/simple-deployment.log
