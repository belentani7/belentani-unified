import sys
sys.path.insert(0, 'apps/secure-t')

# Test imports first
try:
    from factory.storage import init_manifest, record, stats
    print("storage.py imports OK")
except Exception as e:
    print(f"storage.py import error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

try:
    from factory.generators.artifacts import gen_flashcards, gen_cheatsheet, gen_diagram, gen_video_outline, gen_diagram_html, gen_quiz_pdf
    print("artifacts.py imports OK")
except Exception as e:
    print(f"artifacts.py import error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

try:
    from factory.generators.curriculum import gen_program, gen_course, load_blueprint
    print("curriculum.py imports OK")
except Exception as e:
    print(f"curriculum.py import error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Now test with the blueprint
import yaml
from pathlib import Path

# Load blueprint
with open('specs/test-cybersec.yaml', 'r', encoding='utf-8') as f:
    bp = yaml.safe_load(f)
print(f"Blueprint cargado: {bp['nombre']}")

# Generate a minimal course
from factory.i18n import translate
from factory.llm import llm
from factory.schema import Course, Lesson, Module, Program

# Simple test - just generate the program structure
program = gen_program(bp['slug'], n_modulos=1, lecciones=3)
print(f"\nPrograma generado: {program.title}")
print(f"Módulos: {len(program.courses[0].modules)}")

# Now test artifacts generation
from factory.generators import curriculum
from factory.config import S

# Set output directory
S.OUT_DIR = "out_test"

# Generate a course
n_mod, n_les = 3, 2  # smoke scale
course = curriculum.gen_course(bp, n_mod, n_les)

print(f"\nCurso generado: {course.title}")
print(f"Módulos: {len(course.modules)}")
for m in course.modules:
    print(f"  Módulo {m.id}: {len(m.lessons)} lecciones")

# Create output directory
out_dir = Path(S.OUT_DIR) / course.slug
out_dir.mkdir(parents=True, exist_ok=True)

# Test artifact generation
print("\n=== Generando flashcards ===")
gen_flashcards(course, out_dir)
print("✅ Flashcards generadas")

print("\n=== Generando cheatsheet ===")
gen_cheatsheet(course, out_dir)
print("✅ Cheatsheet generado")

print("\n=== Generando diagrama Mermaid ===")
gen_diagram(course, out_dir)
print("✅ Diagrama Mermaid generado")

print("\n=== Generando outline de video ===")
gen_video_outline(course, out_dir)
print("✅ Video outline generado")

print("\n=== Generando diagrama HTML interactivo ===")
gen_diagram_html(course, out_dir)
print("✅ Diagrama HTML generado")

print("\n=== Generando quiz PDF ===")
gen_quiz_pdf(course, out_dir)
print("✅ Quiz PDF generado")

# Test storage recording
print("\n=== Registrando en manifest ===")
from factory.storage import record, stats
for f in out_dir.glob("*"):
    record("content", f, scale="smoke", program=bp['slug'])
print("✅ Manifest actualizado")

print("\n=== Estadísticas ===")
stats()

print("\n🎉 ¡Todas las pruebas completadas exitosamente!")
PYEOF