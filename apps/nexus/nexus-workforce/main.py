"""
Nexus Workforce Enterprise - Offline Desktop App
Motor de RRHH, Nómina y Convenios Laborales Españoles
100% Python - Sin dependencias externas
"""

import sqlite3
import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
from typing import Tuple, Dict, Optional, List
from dataclasses import dataclass, field


# ==========================================
# 1. CAPA DE DATOS (MODELO)
# ==========================================

class NexusDatabase:
    """Manejo de persistencia con SQLite local."""

    def __init__(self, db_name: str = "nexus_core.db"):
        self.db_name = db_name
        self._initialize_db()

    def _execute(self, query: str, params: tuple = ()) -> sqlite3.Cursor:
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor

    def _initialize_db(self):
        self._execute('''
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                convention TEXT NOT NULL,
                shift_type TEXT NOT NULL,
                base_salary REAL NOT NULL,
                vac_balance INTEGER NOT NULL
            )
        ''')
        self._execute('''
            CREATE TABLE IF NOT EXISTS leaves_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                emp_id INTEGER,
                type TEXT,
                status TEXT,
                timestamp TEXT,
                FOREIGN KEY(emp_id) REFERENCES employees(id)
            )
        ''')

        if not self._execute("SELECT 1 FROM employees LIMIT 1").fetchone():
            initial_data = [
                (1001, 'Ana García', 'cc_bcn', 'Rotativo', 1450.0, 22),
                (1002, 'Juan Pérez', 'comercio', 'Oficina', 1600.0, 30),
                (1003, 'Carlos Ruiz', 'oficinas', 'Rotativo', 1800.0, 23),
                (1004, 'Elena López', 'cc_bcn', 'Nocturno', 1450.0, 22),
                (1005, 'David Costa', 'cc_bcn', 'Rotativo', 1500.0, 22),
                (1006, 'María Fernández', 'hosteleria_cat', 'Nocturno', 1650.0, 30),
                (1007, 'Pablo Martín', 'contact_center', 'Rotativo', 1550.0, 32),
            ]
            with sqlite3.connect(self.db_name) as conn:
                conn.executemany('INSERT INTO employees VALUES (?, ?, ?, ?, ?, ?)', initial_data)

    def get_all_employees(self) -> List[tuple]:
        return self._execute("SELECT * FROM employees").fetchall()

    def get_employee(self, emp_id: int) -> Optional[tuple]:
        return self._execute("SELECT * FROM employees WHERE id=?", (emp_id,)).fetchone()

    def update_vacation(self, emp_id: int, days_deducted: int):
        self._execute("UPDATE employees SET vac_balance = vac_balance - ? WHERE id=?", (days_deducted, emp_id))

    def log_leave(self, emp_id: int, leave_type: str, status: str):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self._execute("INSERT INTO leaves_log (emp_id, type, status, timestamp) VALUES (?, ?, ?, ?)",
                     (emp_id, leave_type, status, timestamp))


# ==========================================
# 2. CAPA DE NEGOCIO (CONTROLADOR)
# ==========================================

@dataclass(frozen=True)
class EstatutoTrabajadores:
    """Leyes Marco de Ambito Estatal (Espana)"""
    JORNADA_MAXIMA_ANUAL_HORAS: float = 1826.0
    HORAS_EXTRA_MAXIMAS_ANUALES: int = 80
    DESCANSO_MINIMO_ENTRE_JORNADAS_HORAS: float = 12.0
    DESCANSO_SEMANAL_DIAS: float = 1.5
    PAUSA_INTRAJORNADA_MINUTOS: int = 15
    PERMISO_MATRIMONIO_DIAS: int = 15
    PERMISO_ACCIDENTE_ENFERMEDAD_GRAVE_DIAS: int = 5
    PERMISO_FALLECIMIENTO_DIAS: int = 2
    PERMISO_MUDANZA_DIAS: int = 1


@dataclass
class ConvenioColectivo:
    codigo: str
    nombre: str
    ccaa: str
    jornada_maxima_anual: float
    dias_vacaciones_anuales: int
    tipo_vacaciones: str
    plus_nocturnidad_pct: float
    irpf_pct: float
    pausa_pvd_minutos: Optional[int] = None


DICCIONARIO_CONVENIOS: Dict[str, ConvenioColectivo] = {
    "cc_bcn": ConvenioColectivo(
        codigo="cc_bcn", nombre="Call Center BCN", ccaa="CAT",
        jornada_maxima_anual=1752.0, dias_vacaciones_anuales=22,
        tipo_vacaciones="NATURALES", plus_nocturnidad_pct=0.18, irpf_pct=0.14,
        pausa_pvd_minutos=5
    ),
    "comercio": ConvenioColectivo(
        codigo="comercio", nombre="Comercio BCN", ccaa="CAT",
        jornada_maxima_anual=1764.0, dias_vacaciones_anuales=30,
        tipo_vacaciones="LABORABLES", plus_nocturnidad_pct=0.0, irpf_pct=0.15
    ),
    "oficinas": ConvenioColectivo(
        codigo="oficinas", nombre="Oficinas y Despachos", ccaa="CAT",
        jornada_maxima_anual=1764.0, dias_vacaciones_anuales=23,
        tipo_vacaciones="LABORABLES", plus_nocturnidad_pct=0.0, irpf_pct=0.18
    ),
    "hosteleria_cat": ConvenioColectivo(
        codigo="hosteleria_cat", nombre="Hosteleria de Catalunya", ccaa="CAT",
        jornada_maxima_anual=1792.0, dias_vacaciones_anuales=30,
        tipo_vacaciones="NATURALES", plus_nocturnidad_pct=0.25, irpf_pct=0.14
    ),
    "contact_center": ConvenioColectivo(
        codigo="contact_center", nombre="Contact Center (Estatal)", ccaa="ESTATAL",
        jornada_maxima_anual=1752.0, dias_vacaciones_anuales=32,
        tipo_vacaciones="NATURALES", plus_nocturnidad_pct=0.18, irpf_pct=0.15,
        pausa_pvd_minutos=5
    ),
}


class PayrollEngine:
    """Motor de calculo de nomina y convenios."""

    @classmethod
    def calculate(cls, emp_data: tuple) -> Dict[str, float]:
        _, _, conv_code, shift, base, _ = emp_data
        convenio = DICCIONARIO_CONVENIOS.get(conv_code, DICCIONARIO_CONVENIOS["cc_bcn"])

        bruto = base
        plus_nocturno = (bruto * convenio.plus_nocturnidad_pct) if shift == 'Nocturno' else 0.0
        bruto += plus_nocturno

        irpf = bruto * convenio.irpf_pct
        ss = bruto * 0.0635
        neto = bruto - irpf - ss

        return {
            "convenio": convenio.nombre,
            "base": base,
            "nocturnidad": plus_nocturno,
            "bruto": bruto,
            "irpf": irpf,
            "ss": ss,
            "neto": neto,
            "jornada_max": convenio.jornada_maxima_anual,
            "vacaciones": convenio.dias_vacaciones_anuales,
        }


class HRController:
    """Logica de ausencias segun el Estatuto de los Trabajadores."""

    def __init__(self, db: NexusDatabase):
        self.db = db

    def request_leave(self, emp_id: int, leave_type: str) -> Tuple[bool, str]:
        emp = self.db.get_employee(emp_id)
        if not emp:
            return False, "Empleado no encontrado en la base de datos."

        leave_rules = {
            'VACACIONES': {'days': 5, 'deduct': True, 'msg': 'Vacaciones procesadas (5 dias descontados).'},
            'BODA': {'days': 15, 'deduct': False, 'msg': 'Permiso retribuido: 15 dias (Art. 37 ET).'},
            'ENFERMEDAD_HIJO': {'days': 2, 'deduct': False, 'msg': 'Permiso retribuido: 2 dias (Art. 37.3.b).'},
            'MUERTE_PARIENTE': {'days': 4, 'deduct': False, 'msg': 'Permiso 4 dias por fallecimiento.'},
            'MUDANZA': {'days': 1, 'deduct': False, 'msg': 'Permiso 1 dia por mudanza.'},
        }

        rule = leave_rules.get(leave_type)
        if not rule:
            return False, "Tipo de permiso invalido."

        if rule['deduct']:
            if emp[5] < rule['days']:
                self.db.log_leave(emp_id, leave_type, 'RECHAZADO - Sin saldo')
                return False, f"Saldo insuficiente. Tiene {emp[5]} dias, requiere {rule['days']}."
            self.db.update_vacation(emp_id, rule['days'])

        self.db.log_leave(emp_id, leave_type, 'APROBADO')
        return True, rule['msg']


class LegalValidator:
    """Validador legal de turnos y descansos."""

    def __init__(self, estatuto: EstatutoTrabajadores):
        self.et = estatuto

    def validate_shift(self, horas_jornada: float, horas_descanso_previo: float) -> List[str]:
        alertas = []

        if horas_descanso_previo < self.et.DESCANSO_MINIMO_ENTRE_JORNADAS_HORAS:
            alertas.append(
                f"VIOLACION LEGAL (Art. 34.3 ET): Descanso entre jornadas es de {horas_descanso_previo}h. "
                f"El minimo legal obligatorio es {self.et.DESCANSO_MINIMO_ENTRE_JORNADAS_HORAS}h."
            )

        if horas_jornada > 6.0:
            alertas.append(
                f"RECORDATORIO OBLIGATORIO (Art. 34.4 ET): Jornada superior a 6h. "
                f"Requiere pausa minima de {self.et.PAUSA_INTRAJORNADA_MINUTOS} minutos."
            )

        return alertas


# ==========================================
# 3. CAPA DE PRESENTACION (VISTA - GUI)
# ==========================================

class NexusEnterpriseGUI:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.db = NexusDatabase()
        self.hr = HRController(self.db)
        self.legal = LegalValidator(EstatutoTrabajadores())

        self._setup_window()
        self._setup_styles()
        self._build_layout()

    def _setup_window(self):
        self.root.title("Nexus OS | Enterprise Edition (Offline)")
        self.root.geometry("1100x750")
        self.root.configure(bg='#0f172a')
        self.root.minsize(900, 650)

    def _setup_styles(self):
        style = ttk.Style()
        style.theme_use('clam')

        BG_DARK, BG_PANEL, ACCENT, TEXT = '#0f172a', '#1e293b', '#2563eb', '#f1f5f9'

        style.configure('TNotebook', background=BG_DARK, borderwidth=0)
        style.configure('TNotebook.Tab', background=BG_PANEL, foreground=TEXT,
                       padding=[20, 10], font=('Helvetica', 10, 'bold'))
        style.map('TNotebook.Tab', background=[('selected', ACCENT)])

        style.configure('TFrame', background=BG_DARK)
        style.configure('Panel.TFrame', background=BG_PANEL, relief='ridge', borderwidth=1)

        style.configure('TLabel', background=BG_DARK, foreground=TEXT, font=('Helvetica', 11))
        style.configure('Header.TLabel', font=('Helvetica', 18, 'bold'), foreground='#60a5fa')

        style.configure('TButton', background=ACCENT, foreground=TEXT,
                       font=('Helvetica', 10, 'bold'), padding=8)
        style.map('TButton', background=[('active', '#3b82f6')])

        style.configure('Treeview', background=BG_PANEL, foreground=TEXT,
                       fieldbackground=BG_PANEL, rowheight=30, font=('Helvetica', 10))
        style.configure('Treeview.Heading', background='#334155', foreground=TEXT,
                       font=('Helvetica', 10, 'bold'))

    def _build_layout(self):
        notebook = ttk.Notebook(self.root)
        notebook.pack(expand=True, fill='both', padx=15, pady=15)

        tab_db = ttk.Frame(notebook)
        tab_ops = ttk.Frame(notebook)
        tab_pay = ttk.Frame(notebook)
        tab_legal = ttk.Frame(notebook)

        notebook.add(tab_db, text='  Directorio HR  ')
        notebook.add(tab_ops, text='  Operaciones  ')
        notebook.add(tab_pay, text='  Nomina & Costes  ')
        notebook.add(tab_legal, text='  Validador Legal  ')

        self._build_hr_tab(tab_db)
        self._build_ops_tab(tab_ops)
        self._build_payroll_tab(tab_pay)
        self._build_legal_tab(tab_legal)

    def _build_hr_tab(self, parent):
        ttk.Label(parent, text="Directorio de Plantilla Activa", style='Header.TLabel').pack(pady=15, anchor='w')

        tree_frame = ttk.Frame(parent)
        tree_frame.pack(expand=True, fill='both', pady=10)

        scrollbar = ttk.Scrollbar(tree_frame)
        scrollbar.pack(side='right', fill='y')

        self.tree = ttk.Treeview(tree_frame, columns=('ID', 'Nombre', 'Convenio', 'Turno', 'Vacaciones', 'Jornada Max'),
                                 show='headings', yscrollcommand=scrollbar.set)

        for col in ('ID', 'Nombre', 'Convenio', 'Turno', 'Vacaciones', 'Jornada Max'):
            self.tree.heading(col, text=col)
            self.tree.column(col, anchor='center' if col != 'Nombre' else 'w', width=120)

        self.tree.column('Nombre', width=180)
        self.tree.pack(expand=True, fill='both')
        scrollbar.config(command=self.tree.yview)

        self.refresh_tree()

        btn_frame = ttk.Frame(parent)
        btn_frame.pack(fill='x', pady=10)
        ttk.Button(btn_frame, text="Actualizar Datos", command=self.refresh_tree).pack(side='right')

    def refresh_tree(self):
        for row in self.tree.get_children():
            self.tree.delete(row)
        for emp in self.db.get_all_employees():
            convenio = DICCIONARIO_CONVENIOS.get(emp[2])
            conv_name = convenio.nombre if convenio else 'Desconocido'
            jornada = convenio.jornada_maxima_anual if convenio else 0
            self.tree.insert('', tk.END, values=(emp[0], emp[1], conv_name, emp[3], emp[5], f"{jornada}h"))

    def _build_ops_tab(self, parent):
        ttk.Label(parent, text="Gestion de Permisos y Ausencias", style='Header.TLabel').pack(pady=15, anchor='w')

        panel = ttk.Frame(parent, style='Panel.TFrame')
        panel.pack(fill='x', pady=10, padx=5, ipady=10)

        ttk.Label(panel, text="ID Empleado:", background='#1e293b').grid(row=0, column=0, padx=20, pady=10, sticky='w')
        self.ent_id = ttk.Entry(panel, font=('Helvetica', 11))
        self.ent_id.grid(row=0, column=1, padx=10, pady=10)
        self.ent_id.insert(0, "1001")

        ttk.Label(panel, text="Tipo de Ausencia:", background='#1e293b').grid(row=1, column=0, padx=20, pady=10, sticky='w')
        self.cmb_leave = ttk.Combobox(panel, values=['VACACIONES', 'BODA', 'ENFERMEDAD_HIJO', 'MUERTE_PARIENTE', 'MUDANZA'],
                                     state='readonly', font=('Helvetica', 11))
        self.cmb_leave.grid(row=1, column=1, padx=10, pady=10)
        self.cmb_leave.current(0)

        ttk.Button(panel, text="Procesar Solicitud", command=self.handle_leave).grid(row=2, column=0, columnspan=2, pady=15)

        self.txt_log = tk.Text(parent, height=12, bg='#000000', fg='#10b981', font=('Consolas', 10), borderwidth=0)
        self.txt_log.pack(expand=True, fill='both', pady=10)
        self.txt_log.insert(tk.END, "[SYSTEM] Modulo de Operaciones iniciado. Esperando transacciones...\n")

    def handle_leave(self):
        try:
            emp_id = int(self.ent_id.get())
        except ValueError:
            messagebox.showerror("Error", "El ID debe ser numerico.")
            return

        success, msg = self.hr.request_leave(emp_id, self.cmb_leave.get())
        timestamp = datetime.now().strftime("%H:%M:%S")
        prefix = "[SUCCESS]" if success else "[FAILED]"

        self.txt_log.insert(tk.END, f"{timestamp} {prefix} ID {emp_id}: {msg}\n")
        self.txt_log.see(tk.END)
        self.refresh_tree()

    def _build_payroll_tab(self, parent):
        ttk.Label(parent, text="Simulador de Nomina por Convenio", style='Header.TLabel').pack(pady=15, anchor='w')

        panel = ttk.Frame(parent)
        panel.pack(fill='x', pady=5)

        ttk.Label(panel, text="Buscar ID:").pack(side='left')
        self.ent_pay_id = ttk.Entry(panel, width=15)
        self.ent_pay_id.pack(side='left', padx=10)
        self.ent_pay_id.insert(0, "1004")
        ttk.Button(panel, text="Generar Recibo", command=self.generate_payslip).pack(side='left')

        self.canvas = tk.Canvas(parent, bg='#f8fafc', highlightthickness=0)
        self.canvas.pack(expand=True, fill='both', pady=20)

    def generate_payslip(self):
        self.canvas.delete("all")
        try:
            emp_id = int(self.ent_pay_id.get())
        except ValueError:
            return

        emp_data = self.db.get_employee(emp_id)
        if not emp_data:
            self.canvas.create_text(50, 50, text="Empleado no encontrado.", fill="red",
                                   font=('Helvetica', 14), anchor='w')
            return

        pay_data = PayrollEngine.calculate(emp_data)

        y = 30
        self.canvas.create_text(50, y, text="NEXUS ENTERPRISE - RECIBO DE NOMINA",
                               font=('Helvetica', 16, 'bold'), fill='#0f172a', anchor='w')
        y += 40
        self.canvas.create_text(50, y, text=f"Empleado: {emp_data[1]} (ID: {emp_data[0]})",
                               font=('Helvetica', 12), fill='#334155', anchor='w')
        y += 25
        self.canvas.create_text(50, y, text=f"Convenio: {pay_data['convenio']}",
                               font=('Helvetica', 12), fill='#334155', anchor='w')
        y += 25
        self.canvas.create_text(50, y, text=f"Jornada Max Anual: {pay_data['jornada_max']}h | Vacaciones: {pay_data['vacaciones']} dias",
                               font=('Helvetica', 10), fill='#6b7280', anchor='w')
        y += 30

        self.canvas.create_line(50, y, 600, y, fill='#cbd5e1')
        y += 20
        self.canvas.create_text(50, y, text="Conceptos Salariales", font=('Helvetica', 12, 'bold'),
                               fill='#0f172a', anchor='w')
        y += 30

        items = [
            ("Salario Base", f"+ {pay_data['base']:.2f} EUR", '#10b981'),
        ]
        if pay_data['nocturnidad'] > 0:
            items.append(("Plus Nocturnidad", f"+ {pay_data['nocturnidad']:.2f} EUR", '#10b981'))
        items.extend([
            ("Deduccion IRPF", f"- {pay_data['irpf']:.2f} EUR", '#ef4444'),
            ("Seguridad Social", f"- {pay_data['ss']:.2f} EUR", '#ef4444'),
        ])

        for label, amount, color in items:
            self.canvas.create_text(50, y, text=label, font=('Helvetica', 12), fill='#334155', anchor='w')
            self.canvas.create_text(550, y, text=amount, font=('Helvetica', 12), fill=color, anchor='e')
            y += 25

        y += 10
        self.canvas.create_line(50, y, 600, y, fill='#cbd5e1')
        y += 20
        self.canvas.create_text(50, y, text="LIQUIDO A PERCIBIR (NETO)",
                               font=('Helvetica', 14, 'bold'), fill='#0f172a', anchor='w')
        self.canvas.create_text(550, y, text=f"{pay_data['neto']:.2f} EUR",
                               font=('Helvetica', 16, 'bold'), fill='#2563eb', anchor='e')

    def _build_legal_tab(self, parent):
        ttk.Label(parent, text="Validador Legal de Turnos (Estatuto de los Trabajadores)",
                 style='Header.TLabel').pack(pady=15, anchor='w')

        panel = ttk.Frame(parent, style='Panel.TFrame')
        panel.pack(fill='x', pady=10, padx=5, ipady=10)

        ttk.Label(panel, text="Horas Jornada:", background='#1e293b').grid(row=0, column=0, padx=20, pady=10, sticky='w')
        self.ent_horas = ttk.Entry(panel, width=10, font=('Helvetica', 11))
        self.ent_horas.grid(row=0, column=1, padx=10, pady=10)
        self.ent_horas.insert(0, "8.0")

        ttk.Label(panel, text="Horas Descanso Previo:", background='#1e293b').grid(row=1, column=0, padx=20, pady=10, sticky='w')
        self.ent_descanso = ttk.Entry(panel, width=10, font=('Helvetica', 11))
        self.ent_descanso.grid(row=1, column=1, padx=10, pady=10)
        self.ent_descanso.insert(0, "10.0")

        ttk.Button(panel, text="Validar Turno", command=self.validate_legal).grid(row=2, column=0, columnspan=2, pady=15)

        self.txt_legal = tk.Text(parent, height=15, bg='#000000', fg='#f59e0b', font=('Consolas', 10), borderwidth=0)
        self.txt_legal.pack(expand=True, fill='both', pady=10)
        self.txt_legal.insert(tk.END, "[LEGAL] Modulo de Validacion Legal iniciado.\n")
        self.txt_legal.insert(tk.END, "[LEGAL] Normativa: Estatuto de los Trabajadores (RDL 2/2015)\n")
        self.txt_legal.insert(tk.END, "[LEGAL] Directiva UE 2003/88/CE\n\n")

    def validate_legal(self):
        try:
            horas = float(self.ent_horas.get())
            descanso = float(self.ent_descanso.get())
        except ValueError:
            messagebox.showerror("Error", "Introduce valores numericos.")
            return

        alertas = self.legal.validate_shift(horas, descanso)
        timestamp = datetime.now().strftime("%H:%M:%S")

        self.txt_legal.insert(tk.END, f"\n--- Validacion {timestamp} ---\n")
        self.txt_legal.insert(tk.END, f"Jornada: {horas}h | Descanso previo: {descanso}h\n")

        if alertas:
            for alerta in alertas:
                self.txt_legal.insert(tk.END, f"[ALERTA] {alerta}\n", 'alert')
        else:
            self.txt_legal.insert(tk.END, "[OK] Turno valido. Sin violaciones legales detectadas.\n")

        self.txt_legal.see(tk.END)


# ==========================================
# 4. INICIO DE LA APLICACION
# ==========================================

if __name__ == "__main__":
    root = tk.Tk()
    app = NexusEnterpriseGUI(root)
    root.mainloop()
