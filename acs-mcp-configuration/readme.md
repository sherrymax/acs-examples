# Alfresco MCP Server Configuration

## Overview

This README provides instructions for setting up and configuring a Model Context Protocol (MCP) Server for Alfresco Content Services. The MCP Server enables programmatic access to Alfresco repository functions through a standardized protocol interface.

## Prerequisites

- Alfresco Content Services v25.x (Community or Enterprise)
- Python 3.10 or higher (Python 3.12+ recommended)
- Administrative access to Alfresco server
- Network connectivity between MCP server and Alfresco instance
- Docker and Docker Compose (for containerized deployments)
- Kubernetes cluster (for cloud-native deployments)

### Enhanced Features in ACS v25.x

The Alfresco MCP Server provides enhanced capabilities optimized for ACS v25.x:

### Content Intelligence
- **AI Content Analysis**: Leverage built-in AI services for content classification
- **Smart Metadata**: Automatic metadata extraction and tagging
- **Content Insights**: Advanced analytics and content usage patterns

### Modern API Integration
- **REST API v2**: Full support for the latest Alfresco REST API endpoints
- **GraphQL Support**: Query optimization for complex data relationships
- **Event-Driven Architecture**: Real-time notifications and webhooks

### Cloud-Native Features
- **Kubernetes Integration**: Native support for containerized deployments
- **Microservices Architecture**: Distributed processing capabilities
- **Auto-scaling**: Dynamic resource allocation based on workload

### Security Enhancements
- **OAuth 2.0/OIDC**: Modern authentication protocols
- **SAML 2.0**: Enterprise SSO integration
- **Zero Trust Architecture**: Enhanced security model support

### Core Repository Operations
- **File Retrieval**: Get file details and metadata by filename
- **File Search**: Locate files within the repository

### Comment Management
- **Comment Retrieval**: Fetch comments associated with specific nodes
- **Comment Analysis**: Access user feedback and collaboration data

### Audit and Compliance
- **Audit Apps**: List and manage enabled audit applications
- **Node Audit Trail**: Retrieve comprehensive audit entries for specific nodes
- **Audit Entry Details**: Get detailed information about specific audit events
- **Compliance Reporting**: Generate audit reports for regulatory requirements

### System Information
- **Version Information**: Retrieve Alfresco server version and build details
- **System Health**: Monitor server status and configuration

### Utility Functions
- **Date Processing**: Handle date formatting and timezone conversions
- **Data Transformation**: Process and format repository data

## Installation

### 1. Clone the MCP Server Repository

```bash
git clone <mcp-server-repository-url>
cd alfresco-mcp-server
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configuration

Create a configuration file `config.json`:

```json
{
  "alfresco": {
    "host": "localhost",
    "port": 8080,
    "protocol": "https",
    "api_version": "v2",
    "authentication": {
      "type": "oauth2",
      "client_id": "mcp-client",
      "client_secret": "your-client-secret",
      "token_endpoint": "/auth/oauth/token"
    },
    "context": "alfresco",
    "features": {
      "ai_services": true,
      "event_streaming": true,
      "content_intelligence": true
    }
  },
  "mcp": {
    "server_name": "alfresco-mcp-server",
    "version": "2.0.0",
    "port": 3000,
    "ssl": {
      "enabled": true,
      "cert_path": "/certs/server.crt",
      "key_path": "/certs/server.key"
    }
  },
  "kubernetes": {
    "enabled": false,
    "namespace": "alfresco",
    "service_name": "alfresco-mcp"
  }
}
```

### 4. Environment Variables

Set the following environment variables:

```bash
export ALFRESCO_HOST=localhost
export ALFRESCO_PORT=8080
export ALFRESCO_PROTOCOL=https
export ALFRESCO_API_VERSION=v2
export ALFRESCO_CLIENT_ID=mcp-client
export ALFRESCO_CLIENT_SECRET=your-client-secret
export MCP_SERVER_PORT=3000
export SSL_ENABLED=true
export KUBERNETES_ENABLED=false
```

### Docker Deployment (Recommended for ACS v25.x)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  alfresco-mcp-server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ALFRESCO_HOST=alfresco-cs
      - ALFRESCO_PORT=8080
      - ALFRESCO_PROTOCOL=https
      - ALFRESCO_API_VERSION=v2
    volumes:
      - ./config:/app/config
      - ./certs:/app/certs
    networks:
      - alfresco-network
    depends_on:
      - alfresco-cs

networks:
  alfresco-network:
    external: true
```

Deploy with Docker Compose:

```bash
docker-compose up -d
```

### Kubernetes Deployment

Create a Kubernetes deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alfresco-mcp-server
  namespace: alfresco
spec:
  replicas: 3
  selector:
    matchLabels:
      app: alfresco-mcp-server
  template:
    metadata:
      labels:
        app: alfresco-mcp-server
    spec:
      containers:
      - name: mcp-server
        image: alfresco-mcp-server:2.0.0
        ports:
        - containerPort: 3000
        env:
        - name: ALFRESCO_HOST
          value: "alfresco-cs-service"
        - name: KUBERNETES_ENABLED
          value: "true"
        volumeMounts:
        - name: config
          mountPath: /app/config
      volumes:
      - name: config
        configMap:
          name: mcp-config
```

## Usage

### Starting the MCP Server

**Standard Deployment:**
```bash
python mcp_server.py
```

**Docker Deployment:**
```bash
docker run -d -p 3000:3000 \
  -e ALFRESCO_HOST=your-alfresco-host \
  -e ALFRESCO_CLIENT_ID=your-client-id \
  -e ALFRESCO_CLIENT_SECRET=your-secret \
  alfresco-mcp-server:2.0.0
```

**Kubernetes Deployment:**
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Available Functions

#### File Operations

**Get Files**
```python
# Retrieve file by name
result = mcp_client.call("sherrymax-alf-mcp-server:getFiles", {
    "filename": "document.pdf"
})
```

**Get Comments**
```python
# Get comments for a specific node
result = mcp_client.call("sherrymax-alf-mcp-server:getComments", {
    "nodeid": "workspace://SpacesStore/node-uuid"
})
```

#### Audit Functions

**Get Audit Apps**
```python
# List enabled audit applications
result = mcp_client.call("sherrymax-alf-mcp-server:getAuditApps", {})
```

**Node Audit Trail**
```python
# Get audit entries for a node
result = mcp_client.call("sherrymax-alf-mcp-server:auditForNode", {
    "nodeid": "workspace://SpacesStore/node-uuid"
})
```

**Pull Audit Entry**
```python
# Get specific audit entry
result = mcp_client.call("sherrymax-alf-mcp-server:pullAuditEntryForNode", {
    "nodeid": "workspace://SpacesStore/node-uuid"
})
```

**Audit Entry Details**
```python
# Get detailed audit information
result = mcp_client.call("sherrymax-alf-mcp-server:pullAuditEntryDetailsForNode", {
    "auditentryid": "audit-entry-id"
})
```

#### System Functions

**Get Alfresco Version**
```python
# Retrieve server version information
result = mcp_client.call("sherrymax-alf-mcp-server:getAlfrescoVersion", {})
```

**Date Processing**
```python
# Process date strings
result = mcp_client.call("sherrymax-alf-mcp-server:dateProcessor", {
    "date": "2024-01-15T10:30:00Z"
})
```

## API Reference

### Response Formats

All functions return JSON responses with the following structure:

```json
{
  "success": true,
  "data": {
    // Function-specific data
  },
  "error": null
}
```

### Error Handling

Error responses follow this format:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Security Considerations

### Authentication

#### OAuth 2.0 Authentication (Recommended)
```python
# Configure OAuth 2.0 client
auth_config = {
    "client_id": "mcp-client",
    "client_secret": "your-secret",
    "token_endpoint": "https://your-alfresco/auth/oauth/token",
    "scope": "read write"
}
```

#### SAML 2.0 Integration
```python
# SAML configuration for enterprise SSO
saml_config = {
    "entity_id": "alfresco-mcp",
    "sso_url": "https://your-idp/sso",
    "certificate": "/path/to/saml.crt"
}
```

#### Service Account (Legacy)
- Create dedicated service accounts with minimal permissions
- Use API keys instead of passwords where possible
- Implement token rotation policies

### Network Security
- **TLS 1.3**: Use latest TLS protocols for all communications
- **mTLS**: Implement mutual TLS for service-to-service communication
- **Network Policies**: Use Kubernetes network policies for micro-segmentation
- **Zero Trust**: Implement identity-based access controls

### Data Protection
- **Encryption at Rest**: AES-256 encryption for stored data
- **Encryption in Transit**: TLS 1.3 for all network communications
- **Key Management**: Use HSM or cloud key management services
- **Data Loss Prevention**: Implement DLP policies and monitoring

## Troubleshooting

### Common Issues

**Connection Refused**
- Verify Alfresco server is running
- Check network connectivity and firewall rules
- Validate configuration parameters

**Authentication Failed**
- Verify username and password
- Check user permissions in Alfresco
- Ensure account is not locked

**Node Not Found**
- Verify node ID format (workspace://SpacesStore/uuid)
- Check if node exists and is accessible
- Validate user permissions for the node

### Logging

Enable debug logging:

```bash
export LOG_LEVEL=DEBUG
python mcp_server.py
```

Log files are created in the `logs/` directory.

## Performance Tuning

### Connection Pooling and Load Balancing
Configure advanced connection management for ACS v25.x:

```json
{
  "alfresco": {
    "connection_pool": {
      "max_connections": 50,
      "timeout": 30,
      "keepalive": true,
      "retry_attempts": 3
    },
    "load_balancer": {
      "enabled": true,
      "strategy": "round_robin",
      "health_check_interval": 30,
      "endpoints": [
        "https://alfresco-node-1:8080",
        "https://alfresco-node-2:8080",
        "https://alfresco-node-3:8080"
      ]
    }
  }
}
```

### Caching and Performance
Enhanced caching strategies for v25.x:

```json
{
  "cache": {
    "enabled": true,
    "type": "redis",
    "cluster": {
      "enabled": true,
      "nodes": ["redis-1:6379", "redis-2:6379", "redis-3:6379"]
    },
    "policies": {
      "default_ttl": 300,
      "max_size": "1GB",
      "eviction_policy": "lru"
    }
  }
}
```

### Resource Management
Configure resource limits for containerized deployments:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "2Gi"
    cpu: "1000m"
```

## Monitoring

### Health Checks and Observability
The server provides comprehensive monitoring for ACS v25.x:

```bash
# Health check endpoint
curl https://localhost:3000/health

# Readiness probe
curl https://localhost:3000/ready

# Liveness probe
curl https://localhost:3000/alive

# Metrics endpoint (Prometheus format)
curl https://localhost:3000/metrics
```

### Metrics and Telemetry
Monitor enhanced metrics for v25.x:

```yaml
# Prometheus configuration
metrics:
  - request_count_total
  - request_duration_seconds
  - error_rate_percent
  - cache_hit_ratio
  - connection_pool_active
  - content_processing_time
  - ai_service_latency
  - kubernetes_pod_status
```

### Distributed Tracing
Enable OpenTelemetry for distributed tracing:

```json
{
  "telemetry": {
    "enabled": true,
    "service_name": "alfresco-mcp-server",
    "jaeger_endpoint": "http://jaeger:14268/api/traces",
    "sampling_rate": 0.1
  }
}
```

### Alerting
Configure alerts for critical metrics:

```yaml
alerts:
  - name: HighErrorRate
    condition: error_rate > 5%
    duration: 5m
    action: notify_slack
  - name: HighLatency
    condition: avg_response_time > 2s
    duration: 2m
    action: scale_up
```

## Development

### Testing
Run comprehensive test suite for v25.x:

```bash
# Unit tests
python -m pytest tests/unit/

# Integration tests
python -m pytest tests/integration/

# End-to-end tests
python -m pytest tests/e2e/

# Performance tests
python -m pytest tests/performance/

# Security tests
python -m pytest tests/security/
```

### Development Environment
Set up development environment with Docker:

```bash
# Start development stack
docker-compose -f docker-compose.dev.yml up -d

# Run tests in container
docker-compose exec mcp-server pytest

# Debug with IDE
docker-compose -f docker-compose.debug.yml up
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section
- Review server logs
- Contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### Version 2.0.0 (ACS v25.x Support)
- **New**: Full support for Alfresco Content Services v25.x
- **New**: OAuth 2.0 and SAML 2.0 authentication
- **New**: Kubernetes native deployment
- **New**: AI-powered content intelligence features
- **New**: Enhanced REST API v2 integration
- **New**: Distributed tracing and observability
- **New**: Auto-scaling and load balancing
- **Enhanced**: Performance optimizations for cloud deployments
- **Enhanced**: Security improvements with Zero Trust architecture
- **Enhanced**: Comprehensive monitoring and alerting

### Version 1.0.0
- Initial release
- Basic file and audit operations
- Authentication support  
- Error handling and logging