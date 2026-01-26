# QA Fundamentals — Учебный сайт

Учебный сайт по ручному тестированию для модуля "Module 1: QA Foundation — Week 1–2". Данные загружаются из колоды Anki: anki-week1-2-qa-fundamentals.txt (таб‑разделитель, HTML включён).

## Возможности
- Флеш‑карточки: переворот, перемешивание, скрытие изученных
- Поиск и фильтр по разделам ("БАЗОВЫЕ ПОНЯТИЯ QA", "7 ПРИНЦИПОВ ТЕСТИРОВАНИЯ", и т.д.)
- Викторина (множественный выбор): определение → термин
- Локальный прогресс: изученные карточки и лучший результат (localStorage)
- Настройки доступности: увеличенный шрифт, высокая контрастность

## Запуск локально (Windows)

Запустите простой HTTP‑сервер в корне папки MD, чтобы `fetch` мог загрузить файл колоды.

### Вариант 1: Python (если установлен)
```powershell
python -m http.server 8000 -d "d:\Work\QA\MD"
```
Затем откройте в браузере:
```
http://localhost:8000/qa-fundamentals-site/index.html
```

### Вариант 2: PowerShell (без Python)
```powershell
# Установить простой сервер (1 раз):
Install-Module -Name Polaris -Scope CurrentUser -Force

# Запустить:
Import-Module Polaris
$server = New-PolarisServer -Port 8000
Add-PolarisStaticRoute -Polaris $server -Folder "d:\Work\QA\MD" -Route "/"
Start-Polaris -Polaris $server
```
Откройте:
```
http://localhost:8000/qa-fundamentals-site/index.html
```

## Структура
- qa-fundamentals-site/index.html — разметка страницы
- qa-fundamentals-site/styles.css — стили (тёмная тема, доступность)
- qa-fundamentals-site/script.js — логика (загрузка Anki, карточки, викторина)
- anki-week1-2-qa-fundamentals.txt — источник данных (в корне MD)

## Примечание
- Файл Anki парсится построчно: разделы помечены `# ===== ... =====`, карточки — строки с таб‑разделителем.
- Если открыть файл напрямую (file://), загрузка данных будет заблокирована браузером — используйте HTTP‑сервер.
