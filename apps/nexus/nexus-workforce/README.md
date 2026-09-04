# Nexus Workforce Enterprise

Sistema de gestión de workforce SaaS con cumplimiento normativo europeo.

## Características

- **Dashboard Global** — KPIs en tiempo real: plantilla activa, horas extra, cumplimiento legal, coste laboral
- **Planificador de Turnos** — Generación automática de cuadrantes con patrones M/T/N/O
- **Gestión de Incidencias** — Crisis manager con asignación automática y compensación TOIL
- **Simulador de Nómina** — Cálculo de IRPF, Seguridad Social, plus de nocturnidad, antigüedad
- **Prueba de Estrés** — Simulación de 3,000 empleados, 9 meses, picos de bajas 34%
- **Seguridad** — Zero Trust, JWT, rate limiting, audit logging

## Stack

- **Frontend:** HTML5, CSS3 (custom properties), Vanilla JS
- **Backend:** Python 3.14, pywebview
- **Empaquetado:** PyInstaller → .exe standalone

## Instalación

```bash
pip install -r requirements.txt
python main.py
```

## Empaquetar como .exe

```bash
build.bat
```

## Licencia

MIT — Pedro Belentani 2026
