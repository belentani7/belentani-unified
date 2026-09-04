@echo off
echo ========================================
echo  Nexus Enterprise - Build Script
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no encontrado. Instala Python 3.8+
    pause
    exit /b 1
)

echo [1/3] Instalando dependencias...
pip install pyinstaller --quiet

echo [2/3] Compilando ejecutable...
pyinstaller --noconsole --onefile --windowed --name "Nexus_Enterprise" main.py

echo [3/3] Limpiando archivos temporales...
rmdir /s /q build 2>nul
del /q *.spec 2>nul

echo.
echo ========================================
echo  BUILD COMPLETADO
echo  Ejecutable: dist\Nexus_Enterprise.exe
echo ========================================
pause
