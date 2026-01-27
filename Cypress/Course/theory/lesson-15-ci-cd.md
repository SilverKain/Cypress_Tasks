# Урок 15: Настройка CI/CD

## 🎯 Цели урока
- Интегрировать Cypress в CI/CD pipeline
- Настроить автоматический запуск тестов
- Научиться работать с отчетами
- Оптимизировать тесты для CI

## 📖 Что такое CI/CD?

**CI/CD** (Continuous Integration / Continuous Deployment) - автоматический запуск тестов при каждом изменении кода.

```
Код → Push → CI запускает тесты → ✅ Деплой или ❌ Блокировка
```

## 🚀 Подготовка проекта

### package.json scripts

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:chrome": "cypress run --browser chrome",
    "cy:run:firefox": "cypress run --browser firefox",
    "cy:run:headed": "cypress run --headed",
    "cy:run:spec": "cypress run --spec",
    "test": "cypress run"
  }
}
```

### cypress.config.js для CI

```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    video: true,  // Видео для CI
    screenshotOnRunFailure: true,
    reporter: 'mochawesome',  // Красивые отчеты
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    }
  }
})
```

## 🐙 GitHub Actions

### Базовая настройка

**Файл: .github/workflows/cypress.yml**

```yaml
name: Cypress Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout код
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Установка зависимостей
        run: npm ci
      
      - name: Запуск Cypress тестов
        uses: cypress-io/github-action@v5
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
          browser: chrome
      
      - name: Сохранение скриншотов
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
      
      - name: Сохранение видео
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-videos
          path: cypress/videos
```

### Параллельный запуск

```yaml
name: Cypress Parallel

on: [push]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        containers: [1, 2, 3, 4]  # 4 параллельных процесса
    
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        with:
          record: true
          parallel: true
          group: 'Tests'
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

### Множественные браузеры

```yaml
name: Multi-Browser Tests

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chrome, firefox, edge]
    
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        with:
          browser: ${{ matrix.browser }}
          start: npm start
```

## 🦊 GitLab CI

**Файл: .gitlab-ci.yml**

```yaml
image: cypress/browsers:node18.12.0-chrome107

stages:
  - test

cypress:
  stage: test
  script:
    - npm ci
    - npm start &
    - npx wait-on http://localhost:3000
    - npm run cy:run
  artifacts:
    when: on_failure
    paths:
      - cypress/screenshots
      - cypress/videos
    expire_in: 1 week
```

## 🔵 Azure Pipelines

**Файл: azure-pipelines.yml**

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Install Node.js'

  - script: npm ci
    displayName: 'Install dependencies'

  - script: npm start &
    displayName: 'Start application'

  - script: npx cypress run
    displayName: 'Run Cypress tests'

  - task: PublishTestResults@2
    condition: always()
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'cypress/results/*.xml'
```

## 🐳 Docker

### Dockerfile

```dockerfile
FROM cypress/included:12.0.0

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "cy:run"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
  
  cypress:
    image: cypress/included:12.0.0
    depends_on:
      - app
    environment:
      - CYPRESS_BASE_URL=http://app:3000
    working_dir: /e2e
    volumes:
      - ./cypress:/e2e/cypress
      - ./cypress.config.js:/e2e/cypress.config.js
    command: npx cypress run
```

## 📊 Отчеты

### Mochawesome Reporter

**Установка:**
```bash
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
```

**cypress.config.js:**
```javascript
module.exports = defineConfig({
  e2e: {
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome',
      overwrite: false,
      html: true,
      json: true,
      charts: true
    }
  }
})
```

**Объединение отчетов:**
```json
{
  "scripts": {
    "cy:run": "cypress run",
    "postcy:run": "npm run merge-reports && npm run generate-report",
    "merge-reports": "mochawesome-merge cypress/reports/mochawesome/*.json > cypress/reports/combined-report.json",
    "generate-report": "marge cypress/reports/combined-report.json -o cypress/reports/html"
  }
}
```

### Cypress Dashboard (официальное)

```bash
# Получить Record Key
npx cypress open

# Запуск с записью
npx cypress run --record --key <your-key>
```

**package.json:**
```json
{
  "scripts": {
    "cy:run:record": "cypress run --record --key $CYPRESS_RECORD_KEY"
  }
}
```

## ⚡ Оптимизация для CI

### Параллельный запуск

```javascript
// cypress.config.js
module.exports = defineConfig({
  e2e: {
    // Разделить тесты по файлам
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  }
})
```

### Кэширование

**GitHub Actions:**
```yaml
- name: Cache Cypress binary
  uses: actions/cache@v3
  with:
    path: ~/.cache/Cypress
    key: cypress-${{ runner.os }}-${{ hashFiles('package-lock.json') }}

- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: node_modules
    key: node-modules-${{ hashFiles('package-lock.json') }}
```

### Выборочный запуск

```yaml
# Запуск только измененных тестов
- name: Get changed files
  id: changed-files
  uses: tj-actions/changed-files@v35
  with:
    files: |
      cypress/e2e/**

- name: Run tests for changed files
  if: steps.changed-files.outputs.any_changed == 'true'
  run: |
    for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
      npx cypress run --spec "$file"
    done
```

## 🔐 Переменные окружения

### В CI

**GitHub Secrets:**
```yaml
- name: Run tests
  env:
    CYPRESS_BASE_URL: ${{ secrets.BASE_URL }}
    CYPRESS_API_KEY: ${{ secrets.API_KEY }}
  run: npm run cy:run
```

**В тесте:**
```javascript
describe('API Tests', () => {
  it('Uses environment variable', () => {
    const apiKey = Cypress.env('API_KEY')
    cy.request({
      url: '/api/data',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })
  })
})
```

## 📧 Уведомления

### Slack notification

```yaml
- name: Slack Notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Cypress Tests: ${{ job.status }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email уведомления

```yaml
- name: Send email
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: 'Cypress Tests Failed'
    to: team@example.com
    from: ci@example.com
```

## 🎓 Best Practices для CI

```javascript
// ✅ Используйте baseUrl
// cypress.config.js
baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000'

// ✅ Таймауты для медленных CI
defaultCommandTimeout: 10000,
pageLoadTimeout: 60000

// ✅ Retry для нестабильных тестов
retries: {
  runMode: 2,  // для CI
  openMode: 0  // для локальной разработки
}

// ✅ Выключить video для успешных тестов
video: true,
videoUploadOnPasses: false
```

## 📝 Задание

1. Создайте GitHub Actions workflow для своего проекта
2. Настройте сохранение артефактов (скриншоты, видео)
3. Добавьте Mochawesome reporter
4. Настройте параллельный запуск на 2 контейнерах

## 🔗 Полезные ссылки

- [Cypress CI Guide](https://docs.cypress.io/guides/continuous-integration/introduction)
- [GitHub Actions](https://github.com/cypress-io/github-action)
- [Cypress Dashboard](https://www.cypress.io/dashboard)

---

**Поздравляем! Вы завершили курс по Cypress!** 🎉

**Следующие шаги:**
- Практикуйтесь на реальных проектах
- Изучите продвинутые плагины
- Присоединитесь к сообществу Cypress
