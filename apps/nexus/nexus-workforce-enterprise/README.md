# Nexus Workforce Enterprise

SaaS Enterprise HR Management Platform - Workforce scheduling, compliance, payroll, and crisis management.

## Architecture

- **Backend**: Python (FastAPI + PostgreSQL + Redis)
- **Frontend**: HTML5/CSS3/JS (Prototype) -> React (Production)
- **Database**: PostgreSQL with Row-Level Security (Multi-tenant)
- **Planning Engine**: Google OR-Tools CP-SAT
- **Security**: SOC2 Type II, ISO 27001, GDPR, Zero Trust

## Modules

1. **Dashboard** - Real-time KPIs, department efficiency
2. **Scheduler** - Shift planning with legal compliance (39h/week, rest periods)
3. **Crisis Manager** - Incident handling with automatic TOIL generation
4. **Payroll Engine** - 30+ variables (night bonus, transport, Edenred, IRPF)
5. **HR Portal** - Leave requests, Spanish labor law compliance
6. **Audit Ledger** - Append-only, SHA-256 hash chain

## Quick Start

```bash
# Prototype (Browser)
open frontend/nexus-enterprise.html

# Python Backend
cd backend
pip install -r requirements.txt
python main.py
```

## Legal Compliance

- **Spain**: Estatuto de los Trabajadores, RD 1561/1995
- **Portugal**: Codigo do Trabalho
- **Finland**: Working Hours Act (872/2019)
- **EU**: Directive 2003/88/CE, GDPR, Directive 2019/1152

## License

Proprietary - All rights reserved.
