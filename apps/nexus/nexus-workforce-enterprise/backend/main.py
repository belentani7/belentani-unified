"""Nexus Workforce Enterprise - Backend API"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import datetime
import json

from compliance import (
    CONVENTIONS,
    STATUTORY_LEAVE,
    LeaveType,
    Jurisdiction,
    calculate_payroll,
    calculate_night_hours,
    ConventionRules,
)

app = FastAPI(
    title="Nexus Workforce Enterprise",
    description="SaaS Enterprise HR Management Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Employee(BaseModel):
    id: str
    name: str
    convention: str
    department: str
    shift_type: str  # Rotativo, Oficina, Nocturno
    base_salary: float
    vacation_balance: int


class LeaveRequest(BaseModel):
    employee_id: str
    leave_type: str
    start_date: str
    days: int
    justification: Optional[str] = None


class ShiftCreate(BaseModel):
    employee_id: str
    date: str
    shift_type: str
    start_time: str
    end_time: str


# In-memory store (replace with PostgreSQL in production)
employees_db: dict[str, Employee] = {}
leaves_db: list[dict] = []
shifts_db: list[dict] = []


@app.on_event("startup")
async def startup():
    """Seed demo data."""
    demo_employees = [
        Employee(id="1001", name="Empleado A", convention="call_center_bcn", department="Operaciones", shift_type="Rotativo", base_salary=1450, vacation_balance=22),
        Employee(id="1002", name="Empleado B", convention="call_center_bcn", department="Operaciones", shift_type="Rotativo", base_salary=1850, vacation_balance=22),
        Employee(id="1003", name="Empleado C", convention="oficinas_bcn", department="IT", shift_type="Oficina", base_salary=2400, vacation_balance=23),
        Employee(id="1004", name="Empleado D", convention="comercio_bcn", department="HR", shift_type="Oficina", base_salary=1900, vacation_balance=30),
        Employee(id="1005", name="Empleado E", convention="call_center_bcn", department="Logistica", shift_type="Rotativo", base_salary=1450, vacation_balance=22),
    ]
    for emp in demo_employees:
        employees_db[emp.id] = emp


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.get("/api/employees")
async def list_employees():
    return list(employees_db.values())


@app.get("/api/employees/{emp_id}")
async def get_employee(emp_id: str):
    if emp_id not in employees_db:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employees_db[emp_id]


@app.get("/api/conventions")
async def list_conventions():
    return {k: {"name": v.name, "vacation_days": v.annual_vacation_days, "weekly_hours": v.weekly_hours} for k, v in CONVENTIONS.items()}


@app.get("/api/conventions/{conv_id}/leave-types")
async def get_leave_types(conv_id: str):
    if conv_id not in CONVENTIONS:
        raise HTTPException(status_code=404, detail="Convention not found")
    return {lt.value: days for lt, days in STATUTORY_LEAVE.items()}


@app.post("/api/leaves")
async def request_leave(req: LeaveRequest):
    emp = employees_db.get(req.employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    conv = CONVENTIONS.get(emp.convention)
    if not conv:
        raise HTTPException(status_code=400, detail="Invalid convention")

    leave_type = LeaveType(req.leave_type)
    statutory_days = STATUTORY_LEAVE.get(leave_type, 0)

    if leave_type == LeaveType.VACATION:
        if emp.vacation_balance < req.days:
            raise HTTPException(status_code=400, detail=f"Insufficient vacation balance. Available: {emp.vacation_balance}")
        employees_db[req.employee_id] = Employee(**{**emp.dict(), "vacation_balance": emp.vacation_balance - req.days})

    record = {
        "id": len(leaves_db) + 1,
        "employee_id": req.employee_id,
        "type": req.leave_type,
        "days": req.days,
        "statutory_days": statutory_days,
        "status": "APROBADO",
        "date": req.start_date,
        "justification": req.justification,
    }
    leaves_db.append(record)
    return record


@app.get("/api/leaves")
async def list_leaves():
    return leaves_db


@app.post("/api/payroll/calculate")
async def calculate_employee_payroll(emp_id: str):
    emp = employees_db.get(emp_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    conv = CONVENTIONS.get(emp.convention)
    if not conv:
        raise HTTPException(status_code=400, detail="Invalid convention")

    result = calculate_payroll(
        base_salary=emp.base_salary,
        shifts=[],
        convention=conv,
    )
    return result


@app.get("/api/dashboard/kpis")
async def dashboard_kpis():
    total = len(employees_db)
    active = sum(1 for e in employees_db.values() if e.vacation_balance > 0)
    total_salary = sum(e.base_salary for e in employees_db.values())

    return {
        "total_employees": total,
        "active_employees": active,
        "compliance_rate": 100.0,
        "monthly_cost": round(total_salary * 1.35, 2),  # Including SS employer
        "overtime_hours": 320,
        "punctuality_rate": 98.5,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
