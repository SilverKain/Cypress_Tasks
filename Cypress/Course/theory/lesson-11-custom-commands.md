# Урок 11: Пользовательские команды (Custom Commands)

## 🎯 Цели урока
- Научиться создавать свои команды Cypress
- Понять как переиспользовать код
- Освоить лучшие практики создания команд
- Изучить продвинутые техники

## 📖 Что такое Custom Commands?

**Custom Commands** - это ваши собственные команды Cypress, которые можно использовать как встроенные:

```javascript
// Вместо этого:
cy.get('#email').type('user@example.com')
cy.get('#password').type('password123')
cy.get('#login').click()

// Пишем просто:
cy.login('user@example.com', 'password123')
```

## 🛠️ Создание команд

### Базовая команда

**Файл: cypress/support/commands.js**

```javascript
// Создаем команду
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('#login-btn').click()
})

// Использование в тесте
describe('Тесты с логином', () => {
  it('Пользователь входит в систему', () => {
    cy.login('user@example.com', 'Pass123!')
    cy.url().should('include', '/dashboard')
  })
})
```

### Команда с опциями

```javascript
Cypress.Commands.add('login', (email, password, options = {}) => {
  const {
    visitPage = true,
    rememberMe = false
  } = options
  
  if (visitPage) {
    cy.visit('/login')
  }
  
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  
  if (rememberMe) {
    cy.get('#remember-me').check()
  }
  
  cy.get('#login-btn').click()
})

// Использование
cy.login('user@test.com', 'pass', { rememberMe: true })
cy.login('user@test.com', 'pass', { visitPage: false })
```

## 🎨 Типы команд

### Parent Commands (Родительские)

Начинают цепочку команд:

```javascript
Cypress.Commands.add('getByDataCy', (selector) => {
  return cy.get(`[data-cy="${selector}"]`)
})

// Использование
cy.getByDataCy('submit-button').click()
cy.getByDataCy('user-name').should('contain', 'Иван')
```

### Child Commands (Дочерние)

Работают с предыдущим элементом:

```javascript
Cypress.Commands.add('clickLink', { prevSubject: 'element' }, (subject, linkText) => {
  return cy.wrap(subject).find(`a:contains("${linkText}")`).click()
})

// Использование
cy.get('.navigation').clickLink('Главная')
```

### Dual Commands (Двойные)

Могут быть и родительскими, и дочерними:

```javascript
Cypress.Commands.add('highlight', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).then($el => {
      $el.css('background-color', 'yellow')
    })
    return cy.wrap(subject)
  } else {
    return cy.get('body').then($body => {
      $body.css('background-color', 'yellow')
    })
  }
})

// Оба варианта работают
cy.highlight()  // подсвечивает body
cy.get('.element').highlight()  // подсвечивает элемент
```

## 🏗️ Практические примеры

### Команда для работы с формами

```javascript
Cypress.Commands.add('fillForm', (formData) => {
  Object.keys(formData).forEach(key => {
    const value = formData[key]
    const selector = `[name="${key}"]`
    
    cy.get(selector).then($el => {
      const tagName = $el.prop('tagName').toLowerCase()
      const type = $el.attr('type')
      
      if (tagName === 'select') {
        cy.get(selector).select(value)
      } else if (type === 'checkbox') {
        if (value) {
          cy.get(selector).check()
        }
      } else if (type === 'radio') {
        cy.get(`${selector}[value="${value}"]`).check()
      } else {
        cy.get(selector).clear().type(value)
      }
    })
  })
})

// Использование
cy.fillForm({
  firstName: 'Иван',
  lastName: 'Петров',
  email: 'ivan@example.com',
  country: 'Россия',
  newsletter: true
})
```

### Команда для API

```javascript
Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token)
    return response
  })
})

// Использование
cy.apiLogin('user@example.com', 'Pass123!')
cy.visit('/dashboard')  // уже авторизованы
```

### Команда для ожидания

```javascript
Cypress.Commands.add('waitForStable', (selector, timeout = 5000) => {
  let lastLength = 0
  
  cy.get(selector, { timeout })
    .should(($elements) => {
      const currentLength = $elements.length
      if (currentLength === lastLength) {
        return  // стабильно
      }
      lastLength = currentLength
      throw new Error('Список еще изменяется')
    })
})

// Использование - ждем пока список перестанет меняться
cy.waitForStable('.product-card')
```

### Команда для drag & drop

```javascript
Cypress.Commands.add('dragAndDrop', (sourceSelector, targetSelector) => {
  cy.get(sourceSelector).then($source => {
    cy.get(targetSelector).then($target => {
      const dataTransfer = new DataTransfer()
      
      $source.trigger('dragstart', { dataTransfer })
      $target.trigger('drop', { dataTransfer })
      $source.trigger('dragend')
    })
  })
})

// Использование
cy.dragAndDrop('.draggable-item', '.drop-zone')
```

## 🔐 Команды авторизации

### Быстрый логин через UI

```javascript
Cypress.Commands.add('loginViaUI', (role = 'user') => {
  const users = {
    user: { email: 'user@test.com', password: 'User123!' },
    admin: { email: 'admin@test.com', password: 'Admin123!' },
    guest: { email: 'guest@test.com', password: 'Guest123!' }
  }
  
  const user = users[role]
  
  cy.session([role], () => {
    cy.visit('/login')
    cy.get('#email').type(user.email)
    cy.get('#password').type(user.password)
    cy.get('#login').click()
    cy.url().should('include', '/dashboard')
  })
})

// Использование
cy.loginViaUI('admin')
cy.visit('/admin/panel')
```

### Логин через API с сессией

```javascript
Cypress.Commands.add('loginAsUser', (userType = 'regular') => {
  cy.session(
    userType,
    () => {
      cy.fixture('users').then((users) => {
        const user = users[userType]
        
        cy.request({
          method: 'POST',
          url: '/api/login',
          body: {
            email: user.email,
            password: user.password
          }
        }).then((response) => {
          window.localStorage.setItem('authToken', response.body.token)
        })
      })
    },
    {
      validate() {
        cy.request('/api/me').its('status').should('eq', 200)
      }
    }
  )
})
```

## 🎯 Продвинутые техники

### Команда с retry логикой

```javascript
Cypress.Commands.add('waitUntilExists', (selector, maxAttempts = 10) => {
  let attempts = 0
  
  function checkExistence() {
    attempts++
    
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        return cy.get(selector)
      } else if (attempts < maxAttempts) {
        cy.wait(500)
        checkExistence()
      } else {
        throw new Error(`Элемент ${selector} не найден после ${maxAttempts} попыток`)
      }
    })
  }
  
  checkExistence()
})
```

### Команда с логированием

```javascript
Cypress.Commands.add('clickWithLog', { prevSubject: 'element' }, (subject, label) => {
  cy.log(`🖱️ Клик на: ${label}`)
  
  return cy.wrap(subject)
    .should('be.visible')
    .should('not.be.disabled')
    .click()
    .then(() => {
      cy.log(`✅ Успешно кликнули на: ${label}`)
    })
})

// Использование
cy.get('#submit').clickWithLog('Кнопка отправки')
```

### Команда для работы с localStorage

```javascript
Cypress.Commands.add('setLocalStorage', (key, value) => {
  cy.window().then((window) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  })
})

Cypress.Commands.add('getLocalStorage', (key) => {
  return cy.window().then((window) => {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  })
})

// Использование
cy.setLocalStorage('user', { name: 'Иван', id: 123 })
cy.getLocalStorage('user').then((user) => {
  expect(user.name).to.eq('Иван')
})
```

## 📦 Организация команд

### Группировка по функциональности

```
cypress/support/
├── commands/
│   ├── auth.js          ← команды авторизации
│   ├── forms.js         ← работа с формами
│   ├── api.js           ← API команды
│   └── ui.js            ← UI команды
└── e2e.js               ← импортирует всё
```

**Файл: cypress/support/commands/auth.js**
```javascript
Cypress.Commands.add('login', (email, password) => {
  // ...
})

Cypress.Commands.add('logout', () => {
  // ...
})
```

**Файл: cypress/support/e2e.js**
```javascript
import './commands/auth'
import './commands/forms'
import './commands/api'
import './commands/ui'
```

## 🎓 Лучшие практики

### ✅ DO (Делать)

```javascript
// Описательные имена
Cypress.Commands.add('loginAsAdmin', () => { ... })  // ✅

// Возвращайте chainable
Cypress.Commands.add('getButton', () => {
  return cy.get('button')  // ✅ можно продолжить цепочку
})

// Используйте опции для гибкости
Cypress.Commands.add('action', (param, options = {}) => { ... })  // ✅

// Документируйте команды
/**
 * Авторизация пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 */
Cypress.Commands.add('login', (email, password) => { ... })  // ✅
```

### ❌ DON'T (Не делать)

```javascript
// Не переопределяйте встроенные команды без необходимости
Cypress.Commands.overwrite('visit', () => { ... })  // ❌

// Не делайте слишком сложные команды
Cypress.Commands.add('doEverything', () => {
  // 100 строк кода
})  // ❌

// Не забывайте return для цепочек
Cypress.Commands.add('getItem', () => {
  cy.get('.item')  // ❌ нет return
})
```

## 📝 Задание

1. Создайте команду `cy.registerUser(userData)` для регистрации
2. Создайте команду `cy.addToCart(productId)` для добавления в корзину
3. Создайте команду `cy.assertNotification(message)` для проверки уведомлений
4. Организуйте команды в отдельные файлы

## 🔗 Полезные ссылки

- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)

---

**Следующий урок:** [Урок 12: Page Object Model](lesson-12-page-object.md)
