# Smoke test: carga la app estática headless, captura errores de consola y verifica secciones.
import sys
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8899/index.html"
errors = []

with sync_playwright() as p:
    try:
        browser = p.chromium.launch()
    except Exception as e:
        print("LAUNCH_ERR:", str(e)[:200]); sys.exit(1)
    page = browser.new_page(viewport={"width": 420, "height": 800})
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append("PAGEERROR: " + str(e)))
    four04 = []
    page.on("response", lambda r: four04.append(r.url) if r.status >= 400 else None)

    page.goto(BASE, wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(800)

    print("TITLE:", page.title())
    print("H1 hero:", "Aprende gratis" in page.content())
    print("DATA.events len:", page.evaluate("() => (window.MA && window.MA.DATA && window.MA.DATA.events || []).length"))
    print("DATA keys:", page.evaluate("() => window.MA ? Object.keys(window.MA.DATA).join(',') : 'no MA'"))

    results = {}
    # Navega a cada sección y comprueba que no pete y que pinte algo
    sections = ["cursos", "ia", "office", "cv", "derechos", "herramientas", "eventos", "voz"]
    for s in sections:
        try:
            page.click(f'button[data-section="{s}"]', timeout=5000)
            page.wait_for_timeout(400)
            h = page.locator("#app").inner_text()
            results[s] = (len(h.strip()) > 0, h[:60].replace("\n", " "))
        except Exception as ex:
            results[s] = (False, "CLICK_ERR " + str(ex)[:80])

    # Verifica un curso
    try:
        page.click('button[data-section="cursos"]', timeout=5000)
        page.wait_for_timeout(400)
        c = page.locator('[data-course="chatgpt"]').first
        if c.count():
            c.click(); page.wait_for_timeout(400)
            body = page.locator("#app").inner_text()
            results["curso_chatgpt"] = ("Crear tu cuenta" in body, "detalle lección vista")
    except Exception as ex:
        results["curso_chatgpt"] = (False, "ERR " + str(ex)[:80])

    browser.close()

print("=== RESULTADOS ===")
for k, v in results.items():
    print(f"{k:16} {'OK' if v[0] else 'FALLO'}  {v[1]}")
print("=== 4XX/5XX ===")
for u in four04[:20]: print(" ", u)
print("=== ERRORES CONSOLA ===")
if errors:
    for e in errors[:20]: print(" ", e)
else:
    print("  (ninguno)")
