# 📖 Cypress Cheat Sheet - Шпаргалка

## 🚀 Быстрый старт

```bash
# Установка
npm install --save-dev cypress

# Открыть Test Runner
npx cypress open

# Запуск в headless режиме
npx cypress run

# Конкретный файл
npx cypress run --spec "cypress/e2e/test.cy.js"

# Конкретный браузер
npx cypress run --browser chrome
```

## 🔍 Селекторы

```javascript
// По ID
cy.get('#element-id')

// По классу
cy.get('.class-name')

// По атрибуту
cy.get('[data-cy="submit"]')
cy.get('[type="email"]')

// Комбинированные
cy.get('button.primary')
cy.get('input[name="email"]')

// Contains (по тексту)
cy.contains('Нажми меня')
cy.contains('button', 'Отправить')

// Множественные элементы
cy.get('.item').first()
cy.get('.item').last()
cy.get('.item').eq(2)

// Родитель/потомки
cy.get('#parent').find('.child')
cy.get('.child').parent()
cy.get('.element').siblings()
```

## 🖱️ Действия

```javascript
// Клики
cy.get('button').click()
cy.get('button').dblclick()
cy.get('button').rightclick()

// Ввод текста
cy.get('input').type('текст')
cy.get('input').clear()
cy.get('input').clear().type('новый текст')

// Специальные клавиши
cy.get('input').type('{enter}')
cy.get('input').type('{esc}')
cy.get('input').type('{ctrl+a}')

// Чекбоксы и радио
cy.get('[type="checkbox"]').check()
cy.get('[type="checkbox"]').uncheck()
cy.get('[type="radio"]').check('value')

// Select
cy.get('select').select('option-value')
cy.get('select').select(['multiple', 'values'])

// Фокус
cy.get('input').focus()
cy.get('input').blur()

// Скролл
cy.get('.element').scrollIntoView()
cy.scrollTo('bottom')
cy.scrollTo(0, 500)

// Hover (через trigger)
cy.get('.element').trigger('mouseover')
```

## ✅ Assertions (Проверки)

```javascript
// Существование
cy.get('.element').should('exist')
cy.get('.element').should('not.exist')

// Видимость
cy.get('.element').should('be.visible')
cy.get('.element').should('be.hidden')
cy.get('.element').should('not.be.visible')

// Доступность
cy.get('button').should('be.enabled')
cy.get('button').should('be.disabled')

// Текст
cy.get('h1').should('have.text', 'Заголовок')
cy.get('p').should('contain', 'часть текста')
cy.get('div').should('include.text', 'текст')

// Значение
cy.get('input').should('have.value', 'значение')
cy.get('input').should('be.empty')

// Атрибуты
cy.get('a').should('have.attr', 'href', '/page')
cy.get('img').should('have.attr', 'src')

// Классы
cy.get('.element').should('have.class', 'active')
cy.get('.element').should('not.have.class', 'disabled')

// CSS
cy.get('.element').should('have.css', 'color', 'rgb(255, 0, 0)')

// Длина/количество
cy.get('.items').should('have.length', 5)
cy.get('.items').should('have.length.greaterThan', 3)
cy.get('.items').should('have.length.lessThan', 10)

// URL
cy.url().should('include', '/dashboard')
cy.url().should('eq', 'https://example.com/page')

// Цепочки
cy.get('.element')
  .should('be.visible')
  .and('contain', 'текст')
  .and('have.class', 'active')
```

## 🌐 Навигация

```javascript
// Открыть URL
cy.visit('/')
cy.visit('/login')
cy.visit('https://example.com')

// Навигация
cy.go('back')
cy.go('forward')
cy.reload()

// URL проверки
cy.url().should('include', '/dashboard')
cy.location('pathname').should('eq', '/users')
cy.location('search').should('eq', '?id=123')
```

## 📡 HTTP Запросы

```javascript
// Простой запрос
cy.request('/api/users')

// С параметрами
cy.request({
  method: 'POST',
  url: '/api/login',
  body: {
    email: 'user@test.com',
    password: 'pass123'
  }
})

// Проверка ответа
cy.request('/api/data').then((response) => {
  expect(response.status).to.eq(200)
  expect(response.body).to.have.property('id')
})

// Intercept (мокирование)
cy.intercept('GET', '/api/users', {
  statusCode: 200,
  body: [{ id: 1, name: 'Test' }]
}).as('getUsers')

cy.wait('@getUsers')

// Модификация запроса
cy.intercept('GET', '/api/data', (req) => {
  req.headers['authorization'] = 'Bearer token'
  req.continue()
})
```

## 💾 Fixtures & Data

```javascript
// Загрузить фикстуру
cy.fixture('users.json').then((data) => {
  cy.log(data)
})

// Алиас для фикстуры
cy.fixture('users').as('usersData')

// Использование алиаса
cy.get('@usersData').then((users) => {
  cy.get('#email').type(users[0].email)
})
```

## 🏷️ Алиасы

```javascript
// Создать алиас
cy.get('.element').as('myElement')

// Использовать алиас
cy.get('@myElement').click()

// Алиас для запроса
cy.intercept('GET', '/api/users').as('getUsers')
cy.wait('@getUsers')

// Алиас для данных
cy.wrap({ name: 'Test' }).as('data')
cy.get('@data').should('have.property', 'name')
```

## ⏱️ Ожидания

```javascript
// Явное ожидание (НЕ РЕКОМЕНДУЕТСЯ)
cy.wait(1000)  // миллисекунды

// Ожидание запроса
cy.wait('@apiCall')

// Ожидание с таймаутом
cy.get('.element', { timeout: 10000 })
  .should('be.visible')

// Ожидание условия
cy.get('.loading').should('not.exist')
cy.get('.content').should('be.visible')
```

## 🪟 Окна и вкладки

```javascript
// Window
cy.window().then((win) => {
  console.log(win)
})

// Document
cy.document().then((doc) => {
  expect(doc.title).to.eq('Title')
})

// Viewport (размер окна)
cy.viewport(1280, 720)
cy.viewport('iphone-6')
cy.viewport('macbook-15')

// Title
cy.title().should('include', 'Главная')
```

## 🍪 Cookies & Storage

```javascript
// Cookies
cy.getCookie('session')
cy.getCookies()
cy.setCookie('name', 'value')
cy.clearCookie('name')
cy.clearCookies()

// LocalStorage
cy.window().then((win) => {
  win.localStorage.setItem('key', 'value')
  expect(win.localStorage.getItem('key')).to.eq('value')
})

cy.clearLocalStorage()

// SessionStorage
cy.window().then((win) => {
  win.sessionStorage.setItem('key', 'value')
})
```

## 🎯 Custom Commands

```javascript
// Создание (в support/commands.js)
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('#submit').click()
})

// Использование
cy.login('user@test.com', 'pass123')

// Child command
Cypress.Commands.add('clickLink', 
  { prevSubject: 'element' }, 
  (subject, text) => {
    return cy.wrap(subject).contains(text).click()
  }
)

// Использование
cy.get('.menu').clickLink('Home')
```

## 📝 Хуки

```javascript
describe('Тесты', () => {
  before(() => {
    // Один раз перед всеми тестами
  })

  beforeEach(() => {
    // Перед каждым тестом
    cy.visit('/')
  })

  afterEach(() => {
    // После каждого теста
  })

  after(() => {
    // Один раз после всех тестов
  })

  it('Тест 1', () => {})
  it('Тест 2', () => {})
})
```

## 🔄 Итерации

```javascript
// Each
cy.get('.item').each(($el, index) => {
  cy.wrap($el).should('be.visible')
})

// Map (через then)
cy.get('.price').then($prices => {
  const prices = [...$prices].map(el => el.innerText)
  cy.log(prices)
})

// Filter
cy.get('.item')
  .filter('.active')
  .should('have.length', 1)
```

## 🐛 Отладка

```javascript
// Логирование
cy.log('Сообщение')

// Debug
cy.get('.element').debug()

// Pause
cy.pause()

// Скриншот
cy.screenshot()
cy.screenshot('my-screenshot')

// then для инспекции
cy.get('.element').then($el => {
  debugger
  console.log($el)
})
```

## ⚙️ Конфигурация

```javascript
// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    video: true,
    screenshotOnRunFailure: true,
    
    env: {
      apiUrl: 'http://localhost:4000'
    }
  }
})

// Использование env
const apiUrl = Cypress.env('apiUrl')
```

## 🎨 Best Practices

```javascript
// ✅ DO
cy.get('[data-cy="submit"]').click()
cy.get('.loading').should('not.exist')
cy.get('.content').should('be.visible')

// ❌ DON'T
cy.get('button.btn-primary').click()  // хрупкий селектор
cy.wait(3000)  // жесткое ожидание
const text = cy.get('h1').text()  // не работает так
```

## 🔗 Полезные ссылки

- [Документация Cypress](https://docs.cypress.io/)
- [API Reference](https://docs.cypress.io/api/table-of-contents)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Examples](https://github.com/cypress-io/cypress-example-recipes)

---

**Совет:** Держите эту шпаргалку под рукой во время работы с Cypress!
