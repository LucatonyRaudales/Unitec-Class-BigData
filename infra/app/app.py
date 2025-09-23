#!/usr/bin/env python3
"""
Flask application for cybersecurity dashboard
Proyecto Final - Universidad Unitec
"""

import os
import pandas as pd
import boto3
from flask import Flask, render_template_string, request, jsonify
import logging
from datetime import datetime
import tempfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# AWS S3 configuration
S3_BUCKET = os.environ.get('DATASET_S3_BUCKET', 'cyber-eda-dataset')
S3_KEY = os.environ.get('DATASET_S3_KEY', 'data/cyber_attacks_masked.csv')

# Initialize S3 client
s3_client = boto3.client('s3')

# Global variable to cache dataset
cached_data = None
cache_timestamp = None

def load_dataset():
    """Load dataset from S3 with caching"""
    global cached_data, cache_timestamp
    
    # Check if cache is still valid (5 minutes)
    if cached_data is not None and cache_timestamp is not None:
        if (datetime.now() - cache_timestamp).seconds < 300:
            return cached_data
    
    try:
        # Download dataset from S3
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.csv', delete=False) as tmp_file:
            s3_client.download_file(S3_BUCKET, S3_KEY, tmp_file.name)
            
            # Load into pandas
            df = pd.read_csv(tmp_file.name)
            
            # Clean up temp file
            os.unlink(tmp_file.name)
            
            # Cache the data
            cached_data = df
            cache_timestamp = datetime.now()
            
            logger.info(f"Dataset loaded successfully: {len(df)} records")
            return df
            
    except Exception as e:
        logger.error(f"Error loading dataset: {e}")
        # Return sample data if S3 fails
        return create_sample_data()

def create_sample_data():
    """Create sample data for demonstration"""
    import random
    from datetime import datetime, timedelta
    
    attack_types = ['DDoS', 'Phishing', 'Malware', 'Ransomware', 'SQL Injection', 
                   'XSS', 'Brute Force', 'Man-in-the-Middle', 'Social Engineering']
    
    countries = ['Estados Unidos', 'China', 'Rusia', 'Alemania', 'Reino Unido', 
                'Francia', 'Japón', 'Brasil', 'India', 'Canadá']
    
    severities = ['Bajo', 'Medio', 'Alto', 'Crítico']
    
    data = []
    base_date = datetime.now() - timedelta(days=365)
    
    for i in range(1000):
        data.append({
            'id': i + 1,
            'timestamp': (base_date + timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d %H:%M:%S'),
            'attack_type': random.choice(attack_types),
            'source_ip': f"XXX.XXX.XXX.{random.randint(1, 254)}",
            'target_ip': f"XXX.XXX.XXX.{random.randint(1, 254)}",
            'country': random.choice(countries),
            'severity': random.choice(severities),
            'severity_score': random.randint(1, 10),
            'duration_minutes': random.randint(1, 480),
            'affected_users': random.randint(1, 10000),
            'username': f"USER_{random.randint(1000, 9999)}",
            'email': f"***@***.***",
            'description': f"Ataque de {random.choice(attack_types).lower()} detectado"
        })
    
    return pd.DataFrame(data)

@app.route('/')
def index():
    """Main dashboard page"""
    try:
        df = load_dataset()
        
        # Calculate statistics
        stats = {
            'total_attacks': len(df),
            'attack_types': df['attack_type'].value_counts().to_dict(),
            'severity_distribution': df['severity'].value_counts().to_dict(),
            'top_countries': df['country'].value_counts().head(10).to_dict(),
            'avg_severity_score': round(df['severity_score'].mean(), 2),
            'total_affected_users': df['affected_users'].sum()
        }
        
        # Get filter parameters
        attack_type = request.args.get('attack_type', '')
        severity = request.args.get('severity', '')
        country = request.args.get('country', '')
        limit = int(request.args.get('limit', 100))
        
        # Filter data
        filtered_df = df.copy()
        if attack_type:
            filtered_df = filtered_df[filtered_df['attack_type'] == attack_type]
        if severity:
            filtered_df = filtered_df[filtered_df['severity'] == severity]
        if country:
            filtered_df = filtered_df[filtered_df['country'] == country]
        
        # Limit results
        filtered_df = filtered_df.head(limit)
        
        # Convert to records for template
        records = filtered_df.to_dict('records')
        
        # Get unique values for filters
        unique_attack_types = sorted(df['attack_type'].unique().tolist())
        unique_severities = sorted(df['severity'].unique().tolist())
        unique_countries = sorted(df['country'].unique().tolist())
        
        return render_template_string(HTML_TEMPLATE, 
                                   stats=stats, 
                                   records=records,
                                   unique_attack_types=unique_attack_types,
                                   unique_severities=unique_severities,
                                   unique_countries=unique_countries,
                                   current_filters={
                                       'attack_type': attack_type,
                                       'severity': severity,
                                       'country': country,
                                       'limit': limit
                                   })
        
    except Exception as e:
        logger.error(f"Error in index route: {e}")
        return f"Error loading data: {str(e)}", 500

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'bucket': S3_BUCKET,
        'key': S3_KEY
    })

@app.route('/api/stats')
def api_stats():
    """API endpoint for statistics"""
    try:
        df = load_dataset()
        stats = {
            'total_attacks': len(df),
            'attack_types': df['attack_type'].value_counts().to_dict(),
            'severity_distribution': df['severity'].value_counts().to_dict(),
            'top_countries': df['country'].value_counts().head(10).to_dict(),
            'avg_severity_score': round(df['severity_score'].mean(), 2),
            'total_affected_users': df['affected_users'].sum()
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=False)

# HTML Template
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Ciberseguridad - Unitec</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .stats-card { margin-bottom: 1rem; }
        .table-responsive { max-height: 600px; overflow-y: auto; }
        .badge { font-size: 0.8em; }
        .navbar-brand { font-weight: bold; }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark bg-dark">
        <div class="container">
            <span class="navbar-brand">🛡️ Dashboard de Ciberseguridad - Unitec</span>
        </div>
    </nav>

    <div class="container mt-4">
        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card stats-card bg-danger text-white">
                    <div class="card-body text-center">
                        <h3>{{ stats.total_attacks }}</h3>
                        <p class="mb-0">Total Ataques</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card bg-warning text-white">
                    <div class="card-body text-center">
                        <h3>{{ stats.avg_severity_score }}</h3>
                        <p class="mb-0">Severidad Promedio</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card bg-info text-white">
                    <div class="card-body text-center">
                        <h3>{{ "{:,}".format(stats.total_affected_users) }}</h3>
                        <p class="mb-0">Usuarios Afectados</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card bg-success text-white">
                    <div class="card-body text-center">
                        <h3>{{ stats.attack_types|length }}</h3>
                        <p class="mb-0">Tipos de Ataque</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="card mb-4">
            <div class="card-header">
                <h5>Filtros de Búsqueda</h5>
            </div>
            <div class="card-body">
                <form method="GET" class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label">Tipo de Ataque</label>
                        <select name="attack_type" class="form-select">
                            <option value="">Todos</option>
                            {% for attack_type in unique_attack_types %}
                            <option value="{{ attack_type }}" {% if attack_type == current_filters.attack_type %}selected{% endif %}>
                                {{ attack_type }}
                            </option>
                            {% endfor %}
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Severidad</label>
                        <select name="severity" class="form-select">
                            <option value="">Todos</option>
                            {% for severity in unique_severities %}
                            <option value="{{ severity }}" {% if severity == current_filters.severity %}selected{% endif %}>
                                {{ severity }}
                            </option>
                            {% endfor %}
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">País</label>
                        <select name="country" class="form-select">
                            <option value="">Todos</option>
                            {% for country in unique_countries %}
                            <option value="{{ country }}" {% if country == current_filters.country %}selected{% endif %}>
                                {{ country }}
                            </option>
                            {% endfor %}
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Límite</label>
                        <select name="limit" class="form-select">
                            <option value="50" {% if current_filters.limit == 50 %}selected{% endif %}>50</option>
                            <option value="100" {% if current_filters.limit == 100 %}selected{% endif %}>100</option>
                            <option value="200" {% if current_filters.limit == 200 %}selected{% endif %}>200</option>
                            <option value="500" {% if current_filters.limit == 500 %}selected{% endif %}>500</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Filtrar</button>
                        <a href="/" class="btn btn-secondary">Limpiar</a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Data Table -->
        <div class="card">
            <div class="card-header">
                <h5>Datos de Ataques ({{ records|length }} registros)</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Timestamp</th>
                                <th>Tipo</th>
                                <th>IP Origen</th>
                                <th>IP Destino</th>
                                <th>País</th>
                                <th>Severidad</th>
                                <th>Puntuación</th>
                                <th>Duración</th>
                                <th>Usuarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for record in records %}
                            <tr>
                                <td>{{ record.id }}</td>
                                <td>{{ record.timestamp }}</td>
                                <td>
                                    <span class="badge bg-{{ 'danger' if record.attack_type in ['Ransomware', 'Malware'] else 'warning' if record.attack_type in ['DDoS', 'Brute Force'] else 'info' }}">
                                        {{ record.attack_type }}
                                    </span>
                                </td>
                                <td><code>{{ record.source_ip }}</code></td>
                                <td><code>{{ record.target_ip }}</code></td>
                                <td>{{ record.country }}</td>
                                <td>
                                    <span class="badge bg-{{ 'success' if record.severity == 'Bajo' else 'warning' if record.severity == 'Medio' else 'danger' if record.severity == 'Crítico' else 'info' }}">
                                        {{ record.severity }}
                                    </span>
                                </td>
                                <td>
                                    <div class="progress" style="height: 20px;">
                                        <div class="progress-bar bg-{{ 'success' if record.severity_score <= 3 else 'warning' if record.severity_score <= 6 else 'danger' }}" 
                                             style="width: {{ record.severity_score * 10 }}%">
                                            {{ record.severity_score }}
                                        </div>
                                    </div>
                                </td>
                                <td>{{ record.duration_minutes }} min</td>
                                <td>{{ "{:,}".format(record.affected_users) }}</td>
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Security Notice -->
        <div class="alert alert-info mt-4">
            <h6>🛡️ Nota de Seguridad</h6>
            <p class="mb-0">
                <strong>Datos Enmascarados:</strong> Todos los datos sensibles (IPs, emails, usuarios) 
                han sido enmascarados para proteger la privacidad. Las direcciones IP se muestran como XXX.XXX.XXX.XXX, 
                los emails como ***@***.*** y los nombres de usuario como USER_***.
            </p>
        </div>
    </div>

    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container text-center">
            <p class="mb-0">Proyecto Final - Universidad Unitec | Seguridad con Grandes Volúmenes de Información</p>
        </div>
    </footer>
</body>
</html>
'''
