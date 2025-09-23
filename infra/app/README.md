# Flask Application - Cybersecurity Dashboard

## Description

Flask application for visualizing masked cybersecurity attack data. This application reads data from S3 and provides a web interface with filtering capabilities.

## Features

- **Dashboard**: Statistics and visualizations of attack data
- **Filtering**: Filter by attack type, severity, country, and date
- **Data Masking**: All sensitive data (IPs, emails, usernames) is masked
- **S3 Integration**: Reads dataset from S3 with caching
- **Health Check**: `/health` endpoint for monitoring

## Local Development

### Prerequisites

- Python 3.8+
- AWS credentials configured
- S3 bucket with dataset

### Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables:**
   ```bash
   export DATASET_S3_BUCKET=your-bucket-name
   export DATASET_S3_KEY=data/cyber_attacks_masked.csv
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Access the application:**
   - URL: http://localhost:80
   - Health check: http://localhost:80/health
   - API stats: http://localhost:80/api/stats

## Production Deployment

### Using Gunicorn

```bash
gunicorn --bind 0.0.0.0:80 --workers 2 --timeout 120 app:app
```

### Using Docker

```bash
docker build -t cyber-dashboard .
docker run -p 80:80 -e DATASET_S3_BUCKET=your-bucket cyber-dashboard
```

## API Endpoints

- `GET /` - Main dashboard
- `GET /health` - Health check
- `GET /api/stats` - Statistics in JSON format

## Environment Variables

- `DATASET_S3_BUCKET` - S3 bucket name containing the dataset
- `DATASET_S3_KEY` - S3 key for the dataset file

## Data Format

The application expects a CSV file with the following columns:
- `id` - Attack ID
- `timestamp` - Attack timestamp
- `attack_type` - Type of attack
- `source_ip` - Source IP (masked)
- `target_ip` - Target IP (masked)
- `country` - Country of origin
- `severity` - Severity level
- `severity_score` - Numeric severity score
- `duration_minutes` - Attack duration
- `affected_users` - Number of affected users
- `username` - Username (masked)
- `email` - Email (masked)
- `description` - Attack description

## Security Features

- **Data Masking**: All sensitive data is masked before display
- **Input Validation**: All user inputs are validated
- **Error Handling**: Graceful error handling with fallback data
- **Caching**: Dataset is cached for 5 minutes to reduce S3 calls

## Monitoring

The application provides health check endpoints for monitoring:
- `/health` - Basic health status
- `/api/stats` - Application statistics

## Troubleshooting

### Common Issues

1. **S3 Access Denied**: Check IAM permissions for S3 bucket access
2. **Dataset Not Found**: Verify S3 bucket and key configuration
3. **Memory Issues**: Reduce dataset size or implement pagination
4. **Performance**: Enable caching and optimize queries

### Logs

Check application logs for debugging:
```bash
journalctl -u cyber-dashboard.service -f
```

## License

This project is part of the Final Project for Universidad Unitec.
