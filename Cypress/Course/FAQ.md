# ❓ FAQ - Часто задаваемые вопросы

## 🚀 Установка и настройка

### Q: Cypress не устанавливается, ошибка при установке

**A:** Попробуйте:
```bash
# Очистить кэш npm
npm cache clean --force

# Удалить node_modules
rm -rf node_modules package-lock.json

# Установить заново
npm install

# Или установить Cypress напрямую
npm install cypress --save-dev
```

### Q: Cypress открывается но не показывает тесты

**A:** Проверьте:
1. Структуру папок - тесты должны быть в `cypress/e2e/`
2. Расширение файлов - должно быть `.cy.js`
3. Конфигурацию в `cypress.config.js`

```javascript
// cypress.config.js
module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  }
})
```

### Q: "Cannot find module 'cypress'"

**A:** Cypress не установлен локально в проекте:
```bash
npm install --save-dev cypress
```

## 🔍 Селекторы и элементы

### Q: "Timed out retrying: Expected to find element"

**A:** Элемент не найден. Причины:
1. **Неправильный селектор** - проверьте в DevTools
2. **Элемент еще не загрузился** - увеличьте таймаут:
   ```javascript
   cy.get('.element', { timeout: 10000 })
   ```
3. **Элемент в iframe** - используйте специальный подход
4. **Элемент динамический** - дождитесь загрузки:
   ```javascript
   cy.get('.loading').should('not.exist')
   cy.get('.content').should('be.visible')
   ```

### Q: Как работать с элементами внутри iframe?

**A:** Cypress не поддерживает iframe напрямую. Используйте:
```javascript
cy.get('iframe')
  .its('0.contentDocument.body')
  .should('not.be.empty')
  .then(cy.wrap)
  .find('#element-in-iframe')
  .click()
```

Или установите плагин:
```bash
npm install -D cypress-iframe
```

### Q: Как выбрать n-й элемент из списка?

**A:**
```javascript
cy.get('.item').eq(2)  // третий элемент (индекс с 0)
cy.get('.item').first()
cy.get('.item').last()
```

## ⚡ Асинхронность и команды

### Q: Почему переменная undefined?

**A:** Cypress команды асинхронные:
```javascript
// ❌ Не работает
let text = cy.get('h1').text()
console.log(text)  // undefined

// ✅ Правильно
cy.get('h1').then($h1 => {
  const text = $h1.text()
  console.log(text)
})
```

### Q: Можно ли использовать async/await?

**A:** НЕТ! Cypress использует свою систему команд:
```javascript
// ❌ Неправильно
async function test() {
  await cy.visit('/')
}

// ✅ Правильно
function test() {
  cy.visit('/')
  cy.get('.element').should('be.visible')
}
```

### Q: Как сохранить значение для использования позже?

**A:** Используйте алиасы или замыкания:
```javascript
// Вариант 1: Алиас
cy.get('.price').invoke('text').as('price')
cy.get('@price').then(price => {
  cy.log(price)
})

// Вариант 2: then()
cy.get('.price').invoke('text').then(price => {
  cy.wrap(price).as('savedPrice')
  // используем price здесь
})
```

## 🖱️ Взаимодействия

### Q: "Element is being covered by another element"

**A:** Элемент перекрыт другим элементом. Решения:
```javascript
// 1. Принудительный клик
cy.get('.button').click({ force: true })

// 2. Скролл к элементу
cy.get('.button').scrollIntoView().click()

// 3. Закрыть перекрывающий элемент
cy.get('.modal-close').click()
cy.get('.button').click()
```

### Q: Как сделать hover?

**A:**
```javascript
// Вариант 1: trigger
cy.get('.element').trigger('mouseover')

// Вариант 2: плагин
// npm install -D @cypress/hover
cy.get('.element').realHover()

// Вариант 3: показать скрытый элемент
cy.get('.dropdown').invoke('show')
cy.get('.dropdown-item').click()
```

### Q: Как делать drag and drop?

**A:**
```javascript
// Простой способ
cy.get('.draggable').trigger('dragstart')
cy.get('.droppable').trigger('drop')

// Или плагин
// npm install -D @4tw/cypress-drag-drop
cy.get('.item').drag('.target')
```

## 📡 API и Network

### Q: Как перехватить все запросы к API?

**A:**
```javascript
cy.intercept('/api/**').as('apiCalls')

// Или конкретный паттерн
cy.intercept('GET', '/api/users/*').as('getUser')
cy.intercept('POST', '/api/**').as('postRequests')
```

### Q: Как замокировать API для offline тестирования?

**A:**
```javascript
beforeEach(() => {
  cy.intercept('GET', '/api/products', {
    fixture: 'products.json'
  })
  
  cy.intercept('POST', '/api/login', {
    statusCode: 200,
    body: { token: 'fake-token', user: {...} }
  })
})
```

### Q: Как проверить что запрос был отправлен?

**A:**
```javascript
cy.intercept('POST', '/api/submit').as('submit')

cy.get('#form').submit()

cy.wait('@submit').then((interception) => {
  expect(interception.request.body).to.deep.include({
    name: 'Test'
  })
})
```

## 🗄️ Данные и фикстуры

### Q: Как генерировать случайные данные?

**A:** Используйте Faker:
```bash
npm install -D @faker-js/faker
```

```javascript
import { faker } from '@faker-js/faker/locale/ru'

it('test', () => {
  const email = faker.internet.email()
  const name = faker.person.fullName()
  
  cy.get('#email').type(email)
  cy.get('#name').type(name)
})
```

### Q: Как использовать переменные окружения?

**A:**
```javascript
// cypress.config.js
env: {
  apiUrl: 'http://localhost:4000',
  username: 'testuser'
}

// В тесте
const apiUrl = Cypress.env('apiUrl')
cy.request(`${apiUrl}/users`)

// Или через командную строку
// CYPRESS_apiUrl=http://prod.com npx cypress run
```

## 🔐 Авторизация

### Q: Как ускорить тесты с логином?

**A:** Используйте cy.session():
```javascript
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#submit').click()
    cy.url().should('include', '/dashboard')
  })
})
```

### Q: Как авторизоваться через API?

**A:**
```javascript
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.request('POST', '/api/login', { email, password })
    .then((response) => {
      window.localStorage.setItem('token', response.body.token)
    })
})

// Использование
cy.loginViaAPI('user@test.com', 'pass')
cy.visit('/dashboard')  // уже авторизованы
```

## 🐛 Отладка

### Q: Тест падает но я не понимаю почему

**A:** Шаги отладки:
```javascript
// 1. Добавьте cy.debug()
cy.get('.element').debug().click()

// 2. Используйте cy.pause()
cy.pause()  // остановит выполнение

// 3. Логируйте данные
cy.get('.element').then($el => {
  console.log($el)
  cy.log($el.text())
})

// 4. Делайте скриншоты
cy.screenshot('before-action')
cy.get('.button').click()
cy.screenshot('after-action')
```

### Q: Как посмотреть что в элементе?

**A:**
```javascript
cy.get('.element').then($el => {
  console.log('Text:', $el.text())
  console.log('HTML:', $el.html())
  console.log('Value:', $el.val())
  console.log('Classes:', $el.attr('class'))
  console.log('All attributes:', $el[0].attributes)
})
```

## ⚙️ Конфигурация

### Q: Как изменить таймауты?

**A:**
```javascript
// В cypress.config.js (глобально)
module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 10000
  }
})

// В конкретной команде
cy.get('.element', { timeout: 20000 })

// В тесте
Cypress.config('defaultCommandTimeout', 10000)
```

### Q: Как запустить тесты в разных браузерах?

**A:**
```bash
# Chrome
npx cypress run --browser chrome

# Firefox
npx cypress run --browser firefox

# Edge
npx cypress run --browser edge

# Electron (по умолчанию)
npx cypress run --browser electron
```

## 📊 CI/CD

### Q: Тесты проходят локально но падают в CI

**A:** Возможные причины:
1. **Разные таймауты** - увеличьте в CI
2. **Разрешение экрана** - установите viewport
3. **Нет базового URL** - настройте baseUrl
4. **Данные** - используйте моки вместо реального API

```javascript
// cypress.config.js
module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,  // отключить видео для скорости
    retries: {
      runMode: 2,  // retry в CI
      openMode: 0
    }
  }
})
```

### Q: Как сохранить скриншоты в CI?

**A:** GitHub Actions пример:
```yaml
- name: Upload screenshots
  uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: cypress-screenshots
    path: cypress/screenshots
```

## 🎯 Best Practices

### Q: Какие селекторы лучше использовать?

**A:** Приоритет:
1. ✅ `[data-cy="element"]` - специально для тестов
2. ✅ `[data-testid="element"]` - альтернатива
3. ✅ `#unique-id` - уникальные ID
4. ⚠️ `[aria-label="Close"]` - ARIA атрибуты
5. ❌ `.class-name` - могут меняться
6. ❌ текст - может меняться, локализация

### Q: Сколько проверок должно быть в тесте?

**A:** Один тест = одна функциональность:
```javascript
// ❌ Плохо - слишком много
it('проверяет всё', () => {
  // 50 строк проверок
})

// ✅ Хорошо - фокусированные тесты
it('отображает список товаров', () => {
  cy.get('.product').should('have.length.greaterThan', 0)
})

it('добавляет товар в корзину', () => {
  cy.get('.add-to-cart').click()
  cy.get('.cart-count').should('have.text', '1')
})
```

## 🔗 Полезные ссылки

- [Cypress Docs](https://docs.cypress.io/)
- [Troubleshooting](https://docs.cypress.io/guides/references/troubleshooting)
- [Error Messages](https://docs.cypress.io/guides/references/error-messages)
- [Community Discord](https://discord.com/invite/cypress)

---

**Не нашли ответ?** Посмотрите в [официальной документации](https://docs.cypress.io/) или спросите в сообществе!
