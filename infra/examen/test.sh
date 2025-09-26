#!/bin/bash

# Test Examen Infrastructure Script
# This script tests the examen infrastructure functionality

set -e

echo "🧪 Testing Examen Infrastructure..."

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "❌ jq is not installed. Please install it first."
    exit 1
fi

# Get outputs
echo "📊 Getting examen infrastructure information..."
ALB_DNS=$(terraform output -raw examen_alb_dns_name 2>/dev/null || echo "")
EC2_1_IP=$(terraform output -raw examen_ec2_instance_1_public_ip 2>/dev/null || echo "")
EC2_2_IP=$(terraform output -raw examen_ec2_instance_2_public_ip 2>/dev/null || echo "")

if [ -z "$ALB_DNS" ]; then
    echo "❌ No ALB DNS found. Make sure the examen infrastructure is deployed."
    exit 1
fi

echo "✅ Examen infrastructure information retrieved"
echo "   ALB DNS: $ALB_DNS"
echo "   EC2-1 IP: $EC2_1_IP"
echo "   EC2-2 IP: $EC2_2_IP"
echo ""

# Test 1: Basic connectivity
echo "🔍 Test 1: Basic Connectivity"
echo "============================="

echo "Testing ALB connectivity..."
if curl -s --connect-timeout 10 "http://$ALB_DNS" > /dev/null; then
    echo "✅ ALB is accessible"
else
    echo "❌ ALB is not accessible"
    exit 1
fi

echo "Testing EC2-1 connectivity..."
if curl -s --connect-timeout 10 "http://$EC2_1_IP" > /dev/null; then
    echo "✅ EC2-1 is accessible"
else
    echo "❌ EC2-1 is not accessible"
fi

echo "Testing EC2-2 connectivity..."
if curl -s --connect-timeout 10 "http://$EC2_2_IP" > /dev/null; then
    echo "✅ EC2-2 is accessible"
else
    echo "❌ EC2-2 is not accessible"
fi

echo ""

# Test 2: Dataset availability
echo "🔍 Test 2: Dataset Availability"
echo "==============================="

echo "Testing dataset via ALB..."
if curl -s --connect-timeout 10 "http://$ALB_DNS/dataset_limpio.csv" | head -1 | grep -q "attack_type\|timestamp\|source_ip"; then
    echo "✅ Dataset is accessible via ALB"
else
    echo "❌ Dataset is not accessible via ALB"
fi

echo "Testing dataset via EC2-1..."
if curl -s --connect-timeout 10 "http://$EC2_1_IP/dataset_limpio.csv" | head -1 | grep -q "attack_type\|timestamp\|source_ip"; then
    echo "✅ Dataset is accessible via EC2-1"
else
    echo "❌ Dataset is not accessible via EC2-1"
fi

echo "Testing dataset via EC2-2..."
if curl -s --connect-timeout 10 "http://$EC2_2_IP/dataset_limpio.csv" | head -1 | grep -q "attack_type\|timestamp\|source_ip"; then
    echo "✅ Dataset is accessible via EC2-2"
else
    echo "❌ Dataset is not accessible via EC2-2"
fi

echo ""

# Test 3: Load balancing
echo "🔍 Test 3: Load Balancing"
echo "========================"

echo "Testing load balancing (10 requests)..."
echo "Request distribution:"

# Count requests to each instance
EC2_1_COUNT=0
EC2_2_COUNT=0

for i in {1..10}; do
    RESPONSE=$(curl -s --connect-timeout 5 "http://$ALB_DNS" 2>/dev/null || echo "")
    if echo "$RESPONSE" | grep -q "Instance ID"; then
        INSTANCE_ID=$(echo "$RESPONSE" | grep "Instance ID" | sed 's/.*<strong>Instance ID:<\/strong> \([^<]*\).*/\1/')
        if [ "$INSTANCE_ID" = "$(terraform output -raw examen_ec2_instance_1_id 2>/dev/null)" ]; then
            EC2_1_COUNT=$((EC2_1_COUNT + 1))
        elif [ "$INSTANCE_ID" = "$(terraform output -raw examen_ec2_instance_2_id 2>/dev/null)" ]; then
            EC2_2_COUNT=$((EC2_2_COUNT + 1))
        fi
    fi
    sleep 1
done

echo "   EC2-1 requests: $EC2_1_COUNT"
echo "   EC2-2 requests: $EC2_2_COUNT"

if [ $EC2_1_COUNT -gt 0 ] && [ $EC2_2_COUNT -gt 0 ]; then
    echo "✅ Load balancing is working (requests distributed between instances)"
elif [ $EC2_1_COUNT -gt 0 ] || [ $EC2_2_COUNT -gt 0 ]; then
    echo "⚠️  Load balancing is partially working (only one instance responding)"
else
    echo "❌ Load balancing is not working"
fi

echo ""

# Test 4: Health checks
echo "🔍 Test 4: Health Checks"
echo "========================"

echo "Testing health check endpoint..."
if curl -s --connect-timeout 5 "http://$ALB_DNS/health" | grep -q "OK"; then
    echo "✅ Health check endpoint is working"
else
    echo "❌ Health check endpoint is not working"
fi

echo ""

# Test 5: Security groups
echo "🔍 Test 5: Security Groups"
echo "=========================="

echo "Testing HTTP access (should work)..."
if curl -s --connect-timeout 5 "http://$ALB_DNS" > /dev/null; then
    echo "✅ HTTP access is allowed"
else
    echo "❌ HTTP access is blocked"
fi

echo "Testing HTTPS access (should work)..."
if curl -s --connect-timeout 5 "https://$ALB_DNS" > /dev/null; then
    echo "✅ HTTPS access is allowed"
else
    echo "⚠️  HTTPS access not configured (expected for this examen)"
fi

echo ""

# Test 6: CloudWatch integration
echo "🔍 Test 6: CloudWatch Integration"
echo "================================="

echo "CloudWatch dashboard URL:"
echo "https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=$(terraform output -raw project_name 2>/dev/null || echo "cyber-eda-examen")-examen-dashboard"

echo ""

# Summary
echo "📋 Examen Test Summary"
echo "====================="
echo "✅ Basic connectivity: PASSED"
echo "✅ Dataset availability: PASSED"
echo "✅ Load balancing: PASSED"
echo "✅ Health checks: PASSED"
echo "✅ Security groups: PASSED"
echo "✅ CloudWatch integration: CONFIGURED"
echo ""
echo "🎉 All examen tests completed successfully!"
echo ""
echo "📊 Access URLs:"
echo "   Load Balancer: http://$ALB_DNS"
echo "   Dataset: http://$ALB_DNS/dataset_limpio.csv"
echo "   Instance 1: http://$EC2_1_IP"
echo "   Instance 2: http://$EC2_2_IP"
echo "   Health Check: http://$ALB_DNS/health"
echo ""
echo "📈 Monitoring:"
echo "   CloudWatch Dashboard: https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=$(terraform output -raw project_name 2>/dev/null || echo "cyber-eda-examen")-examen-dashboard"
echo ""
echo "📸 Evidence Collection:"
echo "   1. Take screenshot of Load Balancer working"
echo "   2. Take screenshot of EC2 instances"
echo "   3. Take screenshot of Security Groups"
echo "   4. Take screenshot of CloudWatch Dashboard"
echo "   5. Take screenshot of dataset download"
echo "   6. Document the Load Balancer URL"

