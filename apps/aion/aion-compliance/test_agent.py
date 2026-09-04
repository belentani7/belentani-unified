#!/usr/bin/env python3
"""Tests para AION ComplianceEngine (solo unittest, sin dependencias externas)."""
import json
import sys
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from agent import ComplianceEngine, ComplianceViolation, Shift  # noqa: E402

DAY0 = datetime(2026, 1, 5, 0, 0, 0)  # lunes fijo para determinismo


def dt(hour, minute=0, day_offset=0):
    return DAY0 + timedelta(days=day_offset, hours=hour)


def shift(start, end, is_night=False, employee_id="emp1"):
    return Shift(employee_id, start, end, is_night)


class NightHoursTest(unittest.TestCase):
    """Regresiones del bug de _calculate_night_hours (noche que cruza medianoche)."""

    def setUp(self):
        self.engine = ComplianceEngine("ES")

    def test_day_shift_has_zero_night_hours(self):
        s = shift(dt(8), dt(16), is_night=True)
        self.assertEqual(self.engine._calculate_night_hours(s), 0.0)

    def test_night_crossing_midnight(self):
        # 22:00 -> 06:00 del dia siguiente: 8h de noche
        s = shift(dt(22), dt(6, day_offset=1), is_night=True)
        self.assertAlmostEqual(self.engine._calculate_night_hours(s), 8.0)

    def test_early_morning_partial_night(self):
        # 05:00 -> 07:00: solo 05:00-06:00 es noche (1h)
        s = shift(dt(5), dt(7))
        self.assertAlmostEqual(self.engine._calculate_night_hours(s), 1.0)

    def test_shift_starting_before_night(self):
        # 20:00 -> 08:00: 22:00-06:00 = 8h de noche
        s = shift(dt(20), dt(8, day_offset=1))
        self.assertAlmostEqual(self.engine._calculate_night_hours(s), 8.0)

    def test_multi_night_shift(self):
        # 20:00 dia 1 -> 10:00 dia 3: dos noches completas = 16h
        s = shift(dt(20), dt(10, day_offset=2))
        self.assertAlmostEqual(self.engine._calculate_night_hours(s), 16.0)

    def test_no_double_count_adjacent_windows(self):
        # 22:00 dia 1 -> 06:00 dia 2 debe ser 8h, no 16h
        s = shift(dt(22), dt(6, day_offset=1))
        self.assertAlmostEqual(self.engine._calculate_night_hours(s), 8.0)


class ValidateShiftTest(unittest.TestCase):
    def setUp(self):
        self.engine = ComplianceEngine("ES")

    def _rules(self, violations):
        return [v.rule for v in violations]

    def test_valid_shift_no_violations(self):
        s = shift(dt(8), dt(16))
        self.assertEqual(self.engine.validate_shift(s), [])

    def test_end_before_start_hard_stop(self):
        s = shift(dt(16), dt(8))
        violations = self.engine.validate_shift(s)
        self.assertIn("Invalid Shift Range", self._rules(violations))
        self.assertEqual(violations[0].severity, "hard_stop")

    def test_daily_max_hours_es(self):
        # 10h en ES supera las 9h del art 34.3 -> hard stop
        s = shift(dt(9), dt(19))
        violations = self.engine.validate_shift(s)
        self.assertIn("Max Daily Hours", self._rules(violations))
        self.assertEqual(violations[0].severity, "hard_stop")

    def test_daily_max_hours_es_boundary_ok(self):
        s = shift(dt(8), dt(17))  # 9h exactas
        violations = self.engine.validate_shift(s)
        self.assertNotIn("Max Daily Hours", self._rules(violations))

    def test_daily_max_hours_pt(self):
        pt = ComplianceEngine("PT")
        s = shift(dt(9), dt(18))  # 9h en PT supera las 8h
        violations = pt.validate_shift(s)
        self.assertIn("Max Daily Hours", self._rules(violations))

    def test_night_work_limit(self):
        # 22:00 dia 1 -> 06:00 dia 3: 16h nocturnas en 2 noches > 8h max
        s = shift(dt(22), dt(6, day_offset=2), is_night=True)
        violations = self.engine.validate_shift(s)
        self.assertIn("Night Work Limit", self._rules(violations))

    def test_night_work_within_limit(self):
        # 22:00 -> 06:00: 8h nocturnas, dentro del maximo
        s = shift(dt(22), dt(6, day_offset=1), is_night=True)
        violations = self.engine.validate_shift(s)
        self.assertNotIn("Night Work Limit", self._rules(violations))

    def test_timezone_aware_warns_and_normalizes(self):
        aware_start = dt(8).replace(tzinfo=__import__("datetime").timezone.utc)
        aware_end = dt(16).replace(tzinfo=__import__("datetime").timezone.utc)
        s = shift(aware_start, aware_end)
        violations = self.engine.validate_shift(s)
        self.assertIn("Timezone Not Supported", self._rules(violations))
        # pese a la advertencia no hay hard stops por el turno valido
        self.assertNotIn("Invalid Shift Range", self._rules(violations))

    def test_daily_rest_with_previous_end(self):
        s = shift(dt(8), dt(16))
        prev_end = dt(7)  # solo 1h de descanso
        violations = self.engine.validate_shift(s, previous_shift_end=prev_end)
        self.assertIn("Daily Rest", self._rules(violations))


class WeeklyScheduleTest(unittest.TestCase):
    def setUp(self):
        self.engine = ComplianceEngine("ES")

    def test_empty_schedule_no_violations(self):
        self.assertEqual(self.engine.validate_weekly_schedule([]), [])

    def test_overlapping_shifts(self):
        shifts = [
            shift(dt(8), dt(14)),
            shift(dt(13), dt(19)),  # se superpone con el anterior
        ]
        violations = self.engine.validate_weekly_schedule(shifts)
        self.assertIn("Overlapping Shifts", [v.rule for v in violations])

    def test_insufficient_rest_same_day(self):
        shifts = [
            shift(dt(8), dt(14)),
            shift(dt(15), dt(18)),  # 1h de descanso < 12h
        ]
        violations = self.engine.validate_weekly_schedule(shifts)
        self.assertIn("Daily Rest", [v.rule for v in violations])

    def test_weekly_hours_warning(self):
        # 5 turnos de 9h = 45h > 40h
        shifts = [shift(dt(8), dt(17), employee_id=f"e{i}") for i in range(5)]
        violations = self.engine.validate_weekly_schedule(shifts)
        self.assertIn("Weekly Hours", [v.rule for v in violations])


class IOTest(unittest.TestCase):
    def setUp(self):
        self.engine = ComplianceEngine("ES")
        self.tmp = Path(tempfile.mkdtemp(prefix="aion_test_"))

    def tearDown(self):
        for f in self.tmp.iterdir():
            f.unlink()

    def test_shift_from_dict_and_to_dict(self):
        s = Shift.from_dict({
            "start": "2026-01-05T08:00:00",
            "end": "2026-01-05T16:00:00",
            "is_night": False,
            "employee_id": "emp1",
        })
        self.assertEqual(s.start, datetime(2026, 1, 5, 8, 0))
        d = s.to_dict()
        self.assertEqual(d["employee_id"], "emp1")

    def test_shift_from_dict_invalid_dates(self):
        with self.assertRaises(ValueError):
            Shift.from_dict({"start": "no-es-fecha", "end": "2026-01-05T16:00:00"})
        with self.assertRaises(ValueError):
            Shift.from_dict({"start": "2026-01-05T08:00:00"})  # falta end

    def test_load_schedule_file(self):
        path = self.tmp / "schedule.json"
        path.write_text(json.dumps([
            {"start": "2026-01-05T08:00:00", "end": "2026-01-05T16:00:00",
             "is_night": False, "employee_id": "emp1"},
            {"start": "2026-01-05T16:00:00", "end": "2026-01-05T20:00:00",
             "is_night": False, "employee_id": "emp1"},
        ]), encoding="utf-8")
        shifts = self.engine.load_schedule(path)
        self.assertEqual(len(shifts), 2)

    def test_load_schedule_missing_file(self):
        with self.assertRaises(ValueError):
            self.engine.load_schedule(self.tmp / "nope.json")

    def test_export_violations(self):
        violations = [ComplianceViolation("Test Rule", "warning", "msg")]
        out = self.tmp / "violations.json"
        self.engine.export_violations(violations, out)
        data = json.loads(out.read_text(encoding="utf-8"))
        self.assertEqual(data["total"], 1)
        self.assertEqual(data["violations"][0]["rule"], "Test Rule")


if __name__ == "__main__":
    unittest.main()
