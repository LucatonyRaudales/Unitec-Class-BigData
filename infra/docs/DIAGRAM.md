# Architecture Diagram

## System Overview

This document contains Mermaid diagrams illustrating the architecture of the Cybersecurity Dashboard infrastructure.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Internet"
        U[Users]
        A[Attackers]
    end
    
    subgraph "AWS Cloud - us-east-1"
        subgraph "WAF Layer"
            WAF[AWS WAF<br/>OWASP Rules<br/>Rate Limiting<br/>IP Deny List]
        end
        
        subgraph "Load Balancer"
            ALB[Application Load Balancer<br/>HTTP/HTTPS<br/>Health Checks<br/>Access Logs]
        end
        
        subgraph "VPC - 10.0.0.0/16"
            subgraph "Public Subnets"
                IGW[Internet Gateway]
                SUBNET1[Public Subnet 1<br/>10.0.1.0/24<br/>us-east-1a]
                SUBNET2[Public Subnet 2<br/>10.0.2.0/24<br/>us-east-1b]
            end
            
            subgraph "EC2 Instance"
                EC2[EC2 t2.micro<br/>Amazon Linux 2023<br/>Flask Application<br/>Gunicorn WSGI]
            end
            
            subgraph "Security Groups"
                SG1[ALB Security Group<br/>HTTP: 80<br/>HTTPS: 443]
                SG2[EC2 Security Group<br/>HTTP: 80 from ALB<br/>SSH: 22 optional]
            end
        end
        
        subgraph "Storage Layer"
            S3_DATASET[S3 Dataset Bucket<br/>cyber-attacks-masked.csv<br/>SSE-S3 Encryption<br/>Versioning Enabled]
            S3_LOGS[S3 ALB Logs Bucket<br/>alb-logs/<br/>Access Logs<br/>JSON Format]
        end
        
        subgraph "Monitoring & Logging"
            CW[CloudWatch<br/>Metrics & Alarms<br/>CPU > 70%<br/>Status Checks]
            CW_LOGS[CloudWatch Logs<br/>Application Logs<br/>System Logs<br/>30-day Retention]
        end
        
        subgraph "Optional Services"
            ACM[ACM Certificate<br/>SSL/TLS<br/>DNS Validation<br/>Auto-renewal]
            SNS[SNS Topic<br/>Email Notifications<br/>Alarm Alerts<br/>Optional]
            R53[Route53<br/>DNS Management<br/>Certificate Validation<br/>Optional]
        end
    end
    
    %% User Flow
    U --> WAF
    A --> WAF
    WAF --> ALB
    ALB --> EC2
    EC2 --> S3_DATASET
    ALB --> S3_LOGS
    
    %% Security Groups
    ALB -.-> SG1
    EC2 -.-> SG2
    
    %% Monitoring
    EC2 --> CW
    EC2 --> CW_LOGS
    CW --> SNS
    
    %% Optional HTTPS
    ACM -.-> ALB
    R53 -.-> ACM
    
    %% Subnet Associations
    ALB --> SUBNET1
    ALB --> SUBNET2
    EC2 --> SUBNET1
    SUBNET1 --> IGW
    SUBNET2 --> IGW
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant W as WAF
    participant A as ALB
    participant E as EC2
    participant S as S3
    participant C as CloudWatch
    
    U->>W: 1. HTTP Request
    W->>W: 2. Security Checks<br/>(OWASP, Rate Limit, IP)
    W->>A: 3. Forward Request
    A->>A: 4. Health Check
    A->>E: 5. Route to EC2
    E->>S: 6. Get Dataset
    S-->>E: 7. Return CSV Data
    E->>E: 8. Process & Filter Data
    E->>C: 9. Log Metrics
    E-->>A: 10. HTTP Response
    A->>S: 11. Log Access
    A-->>W: 12. Forward Response
    W-->>U: 13. Return Response
    
    Note over E,S: Data cached for 5 minutes
    Note over W: Blocks malicious requests
    Note over A: Health checks every 30s
    Note over C: Alarms trigger on CPU > 70%
```

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        subgraph "Network Security"
            VPC[VPC Isolation<br/>10.0.0.0/16]
            SG[Security Groups<br/>Port-specific Access]
            IGW[Internet Gateway<br/>Public Access Control]
        end
        
        subgraph "Application Security"
            WAF[WAF Protection<br/>OWASP Rules<br/>Rate Limiting<br/>IP Filtering]
            ALB[Load Balancer<br/>Health Checks<br/>SSL Termination]
        end
        
        subgraph "Data Security"
            MASK[Data Masking<br/>IPs: XXX.XXX.XXX.XXX<br/>Emails: ***@***.***<br/>Users: USER_****]
            ENC[Encryption<br/>S3: SSE-S3<br/>EBS: Encrypted<br/>Transit: TLS 1.2+]
        end
        
        subgraph "Access Control"
            IAM[IAM Roles<br/>Least Privilege<br/>S3 Read Only<br/>EC2 Instance Profile]
            BUCKET[S3 Bucket Policy<br/>ALB Log Access<br/>Public Blocked]
        end
        
        subgraph "Monitoring & Compliance"
            CW[CloudWatch<br/>Metrics & Alarms<br/>Log Aggregation]
            AUDIT[Audit Trail<br/>ALB Access Logs<br/>CloudTrail Optional]
        end
    end
    
    subgraph "Data Flow"
        INTERNET[Internet] --> WAF
        WAF --> ALB
        ALB --> VPC
        VPC --> SG
        SG --> IAM
        IAM --> ENC
        ENC --> MASK
    end
    
    subgraph "Compliance"
        CW --> AUDIT
        AUDIT --> COMPLIANCE[GDPR Compliance<br/>SOC 2 Controls<br/>Data Protection]
    end
```

## Cost Optimization Diagram

```mermaid
graph TB
    subgraph "Free Tier Resources"
        EC2_FREE[EC2 t2.micro<br/>750 hours/month<br/>$0]
        S3_FREE[S3 Storage<br/>5GB<br/>$0]
        CW_FREE[CloudWatch<br/>10 metrics<br/>$0]
        ALB_FREE[ALB<br/>750 hours/month<br/>$0]
        WAF_FREE[WAF<br/>1M requests/month<br/>$0]
    end
    
    subgraph "Optional Costs"
        NAT[NAT Gateway<br/>~$22/month<br/>Optional]
        CF[CloudFront<br/>~$0.085/GB<br/>Optional]
        SNS_COST[SNS<br/>Free for Email<br/>Optional]
        ACM_COST[ACM Certificate<br/>Free<br/>Optional]
    end
    
    subgraph "Cost Monitoring"
        BILLING[Billing Alerts<br/>SNS Notifications]
        TAGS[Resource Tagging<br/>Cost Allocation]
        REVIEW[Monthly Review<br/>Cost Optimization]
    end
    
    EC2_FREE --> BILLING
    S3_FREE --> TAGS
    CW_FREE --> REVIEW
    ALB_FREE --> BILLING
    WAF_FREE --> TAGS
    
    NAT -.-> BILLING
    CF -.-> TAGS
    SNS_COST -.-> REVIEW
    ACM_COST -.-> BILLING
```

## Deployment Flow

```mermaid
graph TD
    A[Developer] --> B[Git Repository]
    B --> C[Terraform Code]
    C --> D[terraform init]
    D --> E[terraform plan]
    E --> F[terraform apply]
    F --> G[AWS Resources Created]
    G --> H[EC2 User Data]
    H --> I[Application Setup]
    I --> J[Dataset Upload]
    J --> K[Application Ready]
    
    subgraph "Infrastructure as Code"
        C
        D
        E
        F
    end
    
    subgraph "AWS Resources"
        G
        H
        I
    end
    
    subgraph "Application Deployment"
        J
        K
    end
    
    K --> L[User Access]
    L --> M[Monitoring & Alerts]
```

## Monitoring and Alerting Flow

```mermaid
graph TB
    subgraph "Data Sources"
        EC2_METRICS[EC2 Metrics<br/>CPU, Memory, Disk]
        ALB_METRICS[ALB Metrics<br/>Request Count, Latency]
        APP_LOGS[Application Logs<br/>Flask, System]
    end
    
    subgraph "CloudWatch"
        METRICS[CloudWatch Metrics<br/>Custom Namespace]
        LOGS[CloudWatch Logs<br/>Log Groups]
        ALARMS[CloudWatch Alarms<br/>CPU > 70%<br/>Status Check Failed]
    end
    
    subgraph "Notifications"
        SNS[SNS Topic<br/>Email Notifications]
        EMAIL[Email Alerts<br/>Admin Notifications]
    end
    
    subgraph "Actions"
        AUTO_SCALE[Auto Scaling<br/>Future Enhancement]
        MANUAL[Manual Intervention<br/>Troubleshooting]
    end
    
    EC2_METRICS --> METRICS
    ALB_METRICS --> METRICS
    APP_LOGS --> LOGS
    
    METRICS --> ALARMS
    LOGS --> ALARMS
    
    ALARMS --> SNS
    SNS --> EMAIL
    
    EMAIL --> AUTO_SCALE
    EMAIL --> MANUAL
```

## Disaster Recovery Flow

```mermaid
graph TB
    subgraph "Backup Strategy"
        S3_BACKUP[S3 Cross-Region Replication<br/>Optional]
        AMI_BACKUP[AMI Snapshots<br/>Manual]
        TF_STATE[Terraform State<br/>Version Controlled]
    end
    
    subgraph "Recovery Procedures"
        INFRA_RECOVERY[Infrastructure Recovery<br/>terraform apply]
        DATA_RECOVERY[Data Recovery<br/>S3 Restore]
        APP_RECOVERY[Application Recovery<br/>User Data Script]
        DNS_RECOVERY[DNS Recovery<br/>Route53 Update]
    end
    
    subgraph "Recovery Times"
        RTO[Recovery Time Objective<br/>30 minutes infrastructure<br/>15 minutes data]
        RPO[Recovery Point Objective<br/>5 minutes S3 consistency]
    end
    
    S3_BACKUP --> DATA_RECOVERY
    AMI_BACKUP --> APP_RECOVERY
    TF_STATE --> INFRA_RECOVERY
    
    DATA_RECOVERY --> RTO
    APP_RECOVERY --> RTO
    INFRA_RECOVERY --> RTO
    DNS_RECOVERY --> RTO
    
    RTO --> RPO
```

## Component Relationships

```mermaid
graph LR
    subgraph "Core Infrastructure"
        VPC[VPC]
        SUBNETS[Public Subnets]
        IGW[Internet Gateway]
    end
    
    subgraph "Application Layer"
        ALB[ALB]
        EC2[EC2 Instance]
        WAF[WAF]
    end
    
    subgraph "Storage Layer"
        S3_DATASET[S3 Dataset]
        S3_LOGS[S3 Logs]
    end
    
    subgraph "Monitoring Layer"
        CW[CloudWatch]
        SNS[SNS]
    end
    
    subgraph "Security Layer"
        SG[Security Groups]
        IAM[IAM Roles]
        ENC[Encryption]
    end
    
    VPC --> SUBNETS
    SUBNETS --> IGW
    SUBNETS --> ALB
    ALB --> EC2
    WAF --> ALB
    EC2 --> S3_DATASET
    ALB --> S3_LOGS
    EC2 --> CW
    CW --> SNS
    ALB --> SG
    EC2 --> SG
    EC2 --> IAM
    S3_DATASET --> ENC
    S3_LOGS --> ENC
```

This comprehensive set of diagrams illustrates the complete architecture, data flow, security layers, cost optimization, deployment process, monitoring, disaster recovery, and component relationships of the Cybersecurity Dashboard infrastructure.
