"""Nexus Workforce Enterprise - Spanish Labor Law Compliance Engine"""

from enum import Enum
from dataclasses import dataclass
from typing import Optional
import datetime


class Jurisdiction(Enum):
    SPAIN = "ES"
    PORTUGAL = "PT"
    FINLAND = "FI"


class LeaveType(Enum):
    VACATION = "VACACIONES"
    WEDDING = "BODA"
    SICK_CHILD = "ENFERMEDAD_HIJO"
    CHILD_BIRTH = "NACIMIENTO_HIJO"
    DEATH_RELATIVE = "MUERTE_PARIENTE"
    MOVING = "MUDANZA"
    PARENTAL_LEAVE = "EXCEDENCIA_CUIDADO"
    BREASTFEEDING = "LACTANCIA"
    OWN_AFFAIRS = "ASUNTOS_PROPIOS"
    HOSPITALIZATION = "HOSPITALIZACION"
    COURT = "JUDICIAL"


@dataclass
class ConventionRules:
    name: str
    jurisdiction: Jurisdiction
    annual_vacation_days: int
    weekly_hours: int
    daily_hours: int
    night_bonus_eur: float
    irpf_rate: float
    rest_hours_between_shifts: int
    max_annual_overtime: int
    own_affairs_days: int


CONVENTIONS = {
    "call_center_bcn": ConventionRules(
        name="Call Center Barcelona",
        jurisdiction=Jurisdiction.SPAIN,
        annual_vacation_days=22,
        weekly_hours=39,
        daily_hours=8,
        night_bonus_eur=15.50,
        irpf_rate=0.14,
        rest_hours_between_shifts=11,
        max_annual_overtime=80,
        own_affairs_days=0,
    ),
    "comercio_bcn": ConventionRules(
        name="Comercio Barcelona",
        jurisdiction=Jurisdiction.SPAIN,
        annual_vacation_days=30,
        weekly_hours=40,
        daily_hours=8,
        night_bonus_eur=0.0,
        irpf_rate=0.15,
        rest_hours_between_shifts=12,
        max_annual_overtime=80,
        own_affairs_days=4,
    ),
    "oficinas_bcn": ConventionRules(
        name="Oficinas y Despachos Barcelona",
        jurisdiction=Jurisdiction.SPAIN,
        annual_vacation_days=23,
        weekly_hours=40,
        daily_hours=8,
        night_bonus_eur=0.0,
        irpf_rate=0.18,
        rest_hours_between_shifts=12,
        max_annual_overtime=80,
        own_affairs_days=4,
    ),
    "portugal_trabalho": ConventionRules(
        name="Codigo do Trabalho Portugal",
        jurisdiction=Jurisdiction.PORTUGAL,
        annual_vacation_days=22,
        weekly_hours=40,
        daily_hours=8,
        night_bonus_eur=0.0,
        irpf_rate=0.20,
        rest_hours_between_shifts=11,
        max_annual_overtime=150,
        own_affairs_days=0,
    ),
}


# Article 37 ET - Statutory Leave (Spain)
STATUTORY_LEAVE = {
    LeaveType.WEDDING: 15,
    LeaveType.SICK_CHILD: 2,
    LeaveType.CHILD_BIRTH: 15,
    LeaveType.DEATH_RELATIVE: 4,
    LeaveType.MOVING: 1,
    LeaveType.PARENTAL_LEAVE: 0,  # Up to 3 years, unpaid
    LeaveType.BREASTFEEDING: 0,  # 1 hour/day until 9 months
    LeaveType.COURT: 0,  # As needed
}


@dataclass
class ShiftAssignment:
    employee_id: str
    date: datetime.date
    shift_type: str  # M (morning), T (afternoon), N (night), O (off)
    start_time: datetime.time
    end_time: datetime.time
    hours: float


@dataclass
class PayrollResult:
    employee_id: str
    base_salary: float
    night_bonus: float
    transport_bonus: float
    overtime_hours: float
    overtime_pay: float
    edenred_benefit: float
    gross_total: float
    irpf_deduction: float
    ss_deduction: float  # Social Security
    net_salary: float


def calculate_night_hours(shift: ShiftAssignment) -> float:
    """Calculate hours worked between 22:00 and 06:00 (night period)."""
    night_start = datetime.time(22, 0)
    night_end = datetime.time(6, 0)

    if shift.start_time >= night_start or shift.end_time <= night_end:
        return shift.hours

    night_hours = 0.0
    current = shift.start_time
    while current < shift.end_time:
        if current >= night_start or current < night_end:
            night_hours += 1
        current = (datetime.min + datetime.timedelta(hours=1)).time()

    return min(night_hours, shift.hours)


def calculate_payroll(
    base_salary: float,
    shifts: list[ShiftAssignment],
    convention: ConventionRules,
    overtime_hours: float = 0.0,
) -> PayrollResult:
    """Calculate monthly payroll based on Spanish labor law."""
    night_hours = sum(calculate_night_hours(s) for s in shifts)
    night_bonus = night_hours * convention.night_bonus_eur

    # Transport bonus if shift crosses midnight
    has_midnight_cross = any(
        s.start_time < datetime.time(6, 0) and s.end_time > datetime.time(0, 0)
        for s in shifts
    )
    transport_bonus = 5.0 if has_midnight_cross else 0.0

    # Overtime (125% diurnal, 150% nocturnal)
    overtime_pay = overtime_hours * (base_salary / 160) * 1.25

    # Edenred: 9 EUR/day if >= 6 continuous hours
    edenred_days = len([s for s in shifts if s.hours >= 6])
    edenred_benefit = edenred_days * 9.0

    gross = base_salary + night_bonus + transport_bonus + overtime_pay + edenred_benefit
    irpf = gross * convention.irpf_rate
    ss = gross * 0.0635  # Employee SS contribution (contingencias comunes 4.70% + desempleo 1.55% + formacion 0.10%)
    net = gross - irpf - ss

    return PayrollResult(
        employee_id="",
        base_salary=base_salary,
        night_bonus=round(night_bonus, 2),
        transport_bonus=transport_bonus,
        overtime_hours=overtime_hours,
        overtime_pay=round(overtime_pay, 2),
        edenred_benefit=edenred_benefit,
        gross_total=round(gross, 2),
        irpf_deduction=round(irpf, 2),
        ss_deduction=round(ss, 2),
        net_salary=round(net, 2),
    )
