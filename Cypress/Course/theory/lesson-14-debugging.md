# Урок 14: Отладка и устранение неполадок

## 🎯 Цели урока
- Освоить инструменты отладки Cypress
- Научиться находить и исправлять ошибки
- Понять типичные проблемы и их решения
- Изучить техники troubleshooting

## 🔍 Инструменты отладки

### Time Travel

Cypress записывает снимки для каждой команды:

```javascript
it('Отладка с Time Travel', () => {
  cy.visit('/app')
  cy.get('.button').click()  // Наведите мышью в Test Runner
  cy.get('.result').should('be.visible')  // Увидите состояние DOM
})
```

### Command Log

Показывает все выполненные команды:

```javascript
cy.log('🔍 Начинаем проверку')
cy.visit('/login')
cy.log('✅ Страница загружена')
cy.get('#email').type('test@test.com')
cy.log('📧 Email введен')
```

### Debugger

```javascript
cy.get('.element').then(($el) => {
  debugger  // Остановка для Chrome DevTools
  console.log($el)
})

// Или используйте cy.debug()
cy.get('.element').debug()
```

### Pause

```javascript
it('Тест с паузой', () => {
  cy.visit('/app')
  cy.pause()  // Остановка, можно продолжить вручную
  cy.get('.button').click()
})
```

## 🐛 Распространенные ошибки

### 1. Element not found

```javascript
// ❌ Ошибка: CypressError: Timed out retrying: Expected to find element: `.missing`

// Причины:
// - Элемент не существует
// - Неправильный селектор
// - Элемент еще не загрузился

// ✅ Решение 1: Увеличить таймаут
cy.get('.slow-element', { timeout: 10000 }).should('be.visible')

// ✅ Решение 2: Дождаться загрузки
cy.get('.loading').should('not.exist')
cy.get('.content').should('be.visible')

// ✅ Решение 3: Проверить селектор
cy.get('body').then(($body) => {
  if ($body.find('.optional-element').length > 0) {
    cy.get('.optional-element').click()
  }
})
```

### 2. Element is detached from DOM

```javascript
// ❌ Ошибка: The element is detached from the DOM

// Причина: элемент был удален и создан заново

// ✅ Решение: Получать элемент заново
cy.get('.dynamic-list').within(() => {
  cy.get('.item').first().click()
})

// Вместо сохранения ссылки
let button
cy.get('.button').then(($btn) => {
  button = $btn  // ❌ может стать detached
})
```

### 3. Element is covered

```javascript
// ❌ Ошибка: Element is being covered by another element

// Причина: модальное окно, overlay, другой элемент

// ✅ Решение 1: Принудительный клик
cy.get('.button').click({ force: true })

// ✅ Решение 2: Закрыть overlay
cy.get('.modal-close').click()
cy.get('.button').click()

// ✅ Решение 3: Скроллинг
cy.get('.button').scrollIntoView().click()
```

### 4. Async/Await проблемы

```javascript
// ❌ Неправильно
const text = cy.get('.element').text()
console.log(text)  // undefined

// ✅ Правильно
cy.get('.element').then(($el) => {
  const text = $el.text()
  console.log(text)
})

// ❌ Неправильно
async function test() {
  await cy.visit('/page')  // ❌ не используйте await с Cypress
}

// ✅ Правильно
function test() {
  cy.visit('/page')  // Cypress сам управляет очередью команд
  cy.get('.element').should('be.visible')
}
```

## 🔧 Техники отладки

### Логирование состояния

```javascript
cy.get('.element')
  .should('be.visible')
  .then(($el) => {
    console.log('Element:', $el)
    console.log('Text:', $el.text())
    console.log('HTML:', $el.html())
    console.log('Classes:', $el.attr('class'))
  })
```

### Скриншоты и видео

```javascript
// Скриншот в определенный момент
cy.screenshot('before-action')
cy.get('.button').click()
cy.screenshot('after-action')

// Скриншот при ошибке (автоматически)
// Настройка в cypress.config.js:
// screenshotOnRunFailure: true
```

### Проверка Network requests

```javascript
cy.intercept('GET', '/api/data').as('getData')

cy.visit('/page')

cy.wait('@getData').then((interception) => {
  console.log('Request:', interception.request)
  console.log('Response:', interception.response)
  console.log('Status:', interception.response.statusCode)
  console.log('Body:', interception.response.body)
})
```

### Инспекция DOM

```javascript
cy.get('body').then(($body) => {
  console.log('Все кнопки:', $body.find('button').length)
  console.log('Все ссылки:', $body.find('a').length)
  
  // Проверка существования
  if ($body.find('.element').length > 0) {
    cy.log('✅ Элемент найден')
  } else {
    cy.log('❌ Элемент не найден')
  }
})
```

## 📊 Анализ упавших тестов

### Читаем ошибку

```
CypressError: Timed out retrying after 4000ms: 
Expected to find element: `.submit-button`, 
but never found it.

at Context.eval (webpack:///./cypress/e2e/test.cy.js:12:0)
```

**Что делать:**
1. ✅ Проверить селектор `.submit-button`
2. ✅ Открыть страницу вручную - есть ли элемент?
3. ✅ Проверить капитализацию, опечатки
4. ✅ Использовать Chrome DevTools для поиска

### Воспроизведение локально

```bash
# Запустить конкретный тест
npx cypress open --spec cypress/e2e/test.cy.js

# С конкретным браузером
npx cypress run --browser chrome --spec cypress/e2e/test.cy.js

# Headed mode (видеть что происходит)
npx cypress run --headed --spec cypress/e2e/test.cy.js
```

## 💡 Полезные команды

### Получение информации

```javascript
// URL
cy.url().then(url => cy.log(url))

// Title
cy.title().then(title => cy.log(title))

// Cookies
cy.getCookies().then(cookies => console.log(cookies))

// LocalStorage
cy.window().then(win => {
  console.log('LocalStorage:', win.localStorage)
})

// Viewport
cy.viewport('iphone-6')  // Тестируем на мобильном
```

### Условная логика

```javascript
cy.get('body').then(($body) => {
  // Если элемент существует
  if ($body.find('.modal').length > 0) {
    cy.get('.modal-close').click()
  }
  
  // Если текст содержит
  if ($body.text().includes('Ошибка')) {
    cy.log('⚠️ Найдена ошибка на странице')
  }
})
```

## 🎓 Лучшие практики отладки

### 1. Добавляйте контекст

```javascript
cy.log('🔍 Шаг 1: Авторизация')
cy.login()

cy.log('🔍 Шаг 2: Открытие корзины')
cy.get('.cart').click()

cy.log('🔍 Шаг 3: Проверка товара')
cy.contains('Товар 1').should('be.visible')
```

### 2. Изолируйте проблему

```javascript
// Если тест падает, упростите его
it('Полный сценарий', () => {
  cy.login()
  cy.visit('/products')
  cy.get('.product').first().click()
  cy.get('#add-to-cart').click()  // ❌ Падает здесь
})

// Создайте минимальный тест
it('Отладка: только клик', () => {
  cy.visit('/product/1')  // Напрямую
  cy.get('#add-to-cart').debug().click()  // Изолируем проблему
})
```

### 3. Используйте .only()

```javascript
describe('Тесты', () => {
  it('Тест 1', () => {})
  
  it.only('Тест 2 - отлаживаем только его', () => {
    cy.visit('/page')
    cy.debug()
  })
  
  it('Тест 3', () => {})
})
```

## 📝 Troubleshooting Checklist

При падении теста проверьте:

- [ ] Правильный ли селектор?
- [ ] Элемент существует на странице?
- [ ] Достаточно ли таймаута?
- [ ] Нет ли перекрывающих элементов?
- [ ] Загрузилась ли страница полностью?
- [ ] Правильные ли тестовые данные?
- [ ] Работает ли в другом браузере?
- [ ] Очищено ли состояние от предыдущего теста?
- [ ] Есть ли ошибки в консоли браузера?
- [ ] Правильно ли работает API?

## 🔗 Полезные ссылки

- [Debugging Guide](https://docs.cypress.io/guides/guides/debugging)
- [Troubleshooting](https://docs.cypress.io/guides/references/troubleshooting)
- [Error Messages](https://docs.cypress.io/guides/references/error-messages)

---

**Следующий урок:** [Урок 15: CI/CD интеграция](lesson-15-ci-cd.md)
