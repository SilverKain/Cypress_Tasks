@echo off
chcp 65001 >nul
echo 🎯 Настройка курса Cypress для мобильного изучения...

REM Проверяем, что мы в правильной папке
if not exist "README.md" (
    echo ❌ Ошибка: Запустите скрипт из папки Course
    pause
    exit /b 1
)

echo 📁 Проверяем структуру курса...

REM Проверяем наличие основных файлов
if not exist "LEARNING_PLAN.md" (
    echo ❌ Не найден файл: LEARNING_PLAN.md
    pause
    exit /b 1
)

if not exist "theory\lesson-01-introduction.md" (
    echo ❌ Не найден файл: theory\lesson-01-introduction.md
    pause
    exit /b 1
)

echo ✅ Структура курса корректна

REM Создаем .gitignore
echo # Node modules > .gitignore
echo node_modules/ >> .gitignore
echo npm-debug.log* >> .gitignore
echo. >> .gitignore
echo # Cypress >> .gitignore
echo cypress/videos/ >> .gitignore
echo cypress/screenshots/ >> .gitignore
echo cypress/downloads/ >> .gitignore
echo. >> .gitignore
echo # IDE files >> .gitignore
echo .vscode/ >> .gitignore
echo .idea/ >> .gitignore
echo. >> .gitignore
echo # OS files >> .gitignore
echo .DS_Store >> .gitignore
echo Thumbs.db >> .gitignore
echo. >> .gitignore
echo # Logs >> .gitignore
echo *.log >> .gitignore

echo 🔧 Инициализация Git репозитория...
git init

echo 📝 Создаем первый коммит...
git add .
git commit -m "🎓 Добавить курс Cypress для начинающих"

echo.
echo 🎉 Готово! Теперь создайте репозиторий на GitHub:
echo.
echo 1️⃣ Зайдите на github.com
echo 2️⃣ Нажмите 'New repository'  
echo 3️⃣ Назовите: cypress-learning-course
echo 4️⃣ Сделайте публичным для удобства
echo 5️⃣ НЕ добавляйте README ^(уже есть^)
echo.
echo 6️⃣ Выполните команды:
echo    git remote add origin https://github.com/ВАШ_USERNAME/cypress-learning-course.git
echo    git branch -M main  
echo    git push -u origin main
echo.
echo 📱 После этого можете читать курс на телефоне через:
echo    - GitHub мобильное приложение
echo    - Браузер: github.com/ВАШ_USERNAME/cypress-learning-course
echo.
echo ✨ Удачного изучения!
echo.

pause
EOF