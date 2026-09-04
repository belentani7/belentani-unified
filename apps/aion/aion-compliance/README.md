# AION Compliance Engine

Motor de cumplimiento normativo laboral europeo (España, Portugal, Finlandia, UE) con validación de turnos. Corre con la biblioteca estándar de Python 3.8+; el esquema PostgreSQL opcional se incluye como referencia del producto.

## Características

- **Multi-Jurisdicción** — España, Portugal, Finlandia con reglas legales codificadas (más defaults UE)
- **Hard stops** — violaciones legales bloqueantes (`end > start`, jornada máxima diaria, descansos, trabajo nocturno)
- **Trabajo nocturno correcto** — cálculo de horas en franja 22:00–06:00 que cruza medianoche, madrugada o múltiples noches, sin doble conteo
- **Timezone-free** — los datetimes con zona horaria se detectan, advierten y normalizan a hora local naive
- **Detección de overlap** — turnos que se solapan entre sí generan `hard_stop`
- **CLI** — validar horarios desde JSON, listar reglas, exportar violaciones
- **Audit/export** — exportación de violaciones a JSON con sello de tiempo

## Instalación

```bash
pip install -r requirements.txt   # no instala nada: solo stdlib
```

## Uso como librería

```python
from datetime import datetime, timedelta
from agent import ComplianceEngine, Shift

engine = ComplianceEngine("ES")  # ES | PT | FI

today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
shifts = [
    Shift("emp1", today.replace(hour=7), today.replace(hour=15)),
    Shift("emp1", today.replace(hour=15), today.replace(hour=23)),
    Shift("emp1", (today + timedelta(days=1)).replace(hour=22),
          (today + timedelta(days=2)).replace(hour=6), is_night=True),
]

violations = engine.validate_weekly_schedule(shifts)
for v in violations:
    print(v.severity, v.rule, v.message)
```

## CLI

```bash
# Demo de validación
python agent.py demo

# Validar un horario desde JSON
python agent.py validate schedule.json
python agent.py validate schedule.json --jurisdiction PT --json

# Listar reglas legales configuradas
python agent.py rules
python agent.py rules --json

# Validar y exportar violaciones a JSON
python agent.py export schedule.json --out violations.json
```

### Formato de `schedule.json`

```json
{
  "employee_id": "emp1",
  "shifts": [
    {"start": "2026-01-05T08:00:00", "end": "2026-01-05T16:00:00", "is_night": false},
    {"start": "2026-01-05T22:00:00", "end": "2026-01-06T06:00:00", "is_night": true}
  ]
}
```

## Validaciones implementadas

| Regla | Severidad | Detalle |
|-------|-----------|---------|
| Invalid Shift Range | `hard_stop` | `end` debe ser posterior a `start` |
| Max Daily Hours | `hard_stop` | ES 9h (art. 34.3), PT/FI 8h |
| Night Work Limit | `hard_stop` | máx. 8h nocturnas por período de 24h |
| Daily Rest | `hard_stop` | descanso entre turnos: ES 12h, PT/FI 11h |
| Overlapping Shifts | `hard_stop` | turnos consecutivos que se solapan |
| Weekly Rest | `hard_stop` | descanso semanal: ES 36h, PT 24h, FI 35h |
| Weekly Hours | `warning` | máx. 40h semanales |
| Max Shift Duration | `warning` | recomendado máx. 12h |
| Timezone Not Supported | `warning` | datetimes aware normalizados a naive |

## Reglas Legales

| ID | Jurisdicción | Norma | Parámetro |
|----|-------------|-------|-----------|
| REG-ES-01 | España | Estatuto Trabajadores Art. 34.3 | max_daily_hours = 9 |
| REG-ES-02 | España | Estatuto Trabajadores Art. 34.1/35.2 | max_annual_overtime = 80 |
| REG-ES-03 | España | Estatuto Trabajadores Art. 34.9 | track_mandatory = true |
| REG-PT-01 | Portugal | Código Trabalho Art. 203 | max_weekly_hours = 40 |
| REG-PT-02 | Portugal | Código Trabalho Art. 221 | min_daily_rest = 11 |
| REG-FI-01 | Finlandia | Working Hours Act 872/2019 §5 | regular_weekly_hours = 40 |
| REG-FI-02 | Finlandia | Working Hours Act 872/2019 §24 | rest_period_weekly = 35 |

## API pública (compatible)

`ComplianceEngine.validate_shift(shift, previous_shift_end=None)` · `validate_weekly_schedule(shifts)` · `_calculate_night_hours(shift)` — comportamiento original conservado y corregido. Añadidos: `load_schedule(path)`, `export_violations(violations, path)`, `Shift.from_dict/to_dict`, constantes de reglas.

## Stack de producto (referencia)

- **Backend:** Python, FastAPI
- **DB:** PostgreSQL (RLS) — ver `schema.sql`, SQLite (dev)
- **Seguridad:** SHA-256 hashing, JWT, MFA
- **Config:** claves de API en `.env` (ver `.env.example`)

## Tests

```bash
python -m unittest test_agent -v
```

## Licencia

MIT — Pedro Belentani 2026
