@echo off
chcp 65001 > nul
echo.
echo تشغيل الموقع على الرابط:
echo http://localhost:8000
echo.
echo لا تغلق هذه النافذة ما دام الموقع مفتوحاً.
echo.
python -m http.server 8000
pause
