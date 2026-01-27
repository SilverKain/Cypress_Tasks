# Урок 9: Переменные и алиасы

## 🎯 Цели урока
- Понять работу с переменными в Cypress
- Освоить систему алиасов (aliases)
- Научиться сохранять и переиспользовать данные
- Изучить продвинутые техники работы с данными

## 📖 Асинхронность в Cypress

Важно понимать: Cypress команды **асинхронные**. Это означает, что код выполняется не сразу.

### ❌ Неправильно:

```javascript
// Это НЕ работает!
const button = cy.get('button')  // button это не элемент!
button.click()  // ошибка!

// Это тоже НЕ работает!
let text = cy.get('h1').text()  // text это не строка!
console.log(text)  // undefined
```

### ✅ Правильно:

```javascript
// Используем цепочки команд
cy.get('button').click()

// Или then() для получения значения
cy.get('h1').then(($h1) => {
  const text = $h1.text()
  console.log(text)  // теперь работает!
})
```

## 🏷️ Алиасы (Aliases)

**Alias** - это способ сохранить результат команды для повторного использования.

### Базовое использование

```javascript
// Создаем alias
cy.get('.user-name').as('username')

// Используем alias
cy.get('@username').should('contain', 'Иван')
cy.get('@username').click()

// Можно использовать много раз
cy.get('@username').invoke('text').then(cy.log)
```

### Алиасы для элементов

```javascript
describe('Работа с алиасами элементов', () => {
  beforeEach(() => {
    cy.visit('/profile')
    
    // Сохраняем часто используемые элементы
    cy.get('#username').as('usernameField')
    cy.get('#email').as('emailField')
    cy.get('#save-btn').as('saveButton')
  })

  it('Обновляет имя пользователя', () => {
    cy.get('@usernameField')
      .clear()
      .type('Новое имя')
    
    cy.get('@saveButton').click()
    
    cy.get('@usernameField')
      .should('have.value', 'Новое имя')
  })

  it('Проверяет валидацию email', () => {
    cy.get('@emailField')
      .clear()
      .type('неверный-email')
    
    cy.get('@saveButton').click()
    
    cy.contains('Неверный формат email')
      .should('be.visible')
  })
})
```

### Алиасы для данных

```javascript
describe('Алиасы для данных', () => {
  beforeEach(() => {
    // Сохраняем фикстуру
    cy.fixture('user').as('userData')
  })

  it('Использует данные из фикстуры', function() {
    cy.visit('/register')
    
    // Доступ через this
    cy.get('#name').type(this.userData.name)
    cy.get('#email').type(this.userData.email)
    cy.get('#password').type(this.userData.password)
    cy.get('#submit').click()
  })

  it('Другой тест с теми же данными', function() {
    cy.visit('/login')
    
    cy.get('#email').type(this.userData.email)
    cy.get('#password').type(this.userData.password)
    cy.get('#login').click()
  })
})
```

### Алиасы для запросов

```javascript
describe('API алиасы', () => {
  it('Сохраняет результат запроса', () => {
    // Перехватываем запрос и создаем alias
    cy.intercept('GET', '/api/user/*').as('getUser')
    
    cy.visit('/profile/123')
    
    // Ждем запрос
    cy.wait('@getUser').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body).to.have.property('id', 123)
    })
    
    // Можем переиспользовать
    cy.get('@getUser').its('response.body.name').should('exist')
  })

  it('Работает с множественными запросами', () => {
    cy.intercept('GET', '/api/products').as('getProducts')
    cy.intercept('POST', '/api/cart').as('addToCart')
    
    cy.visit('/shop')
    
    cy.wait('@getProducts')
    cy.get('.product').first().click()
    cy.get('#add-to-cart').click()
    
    cy.wait('@addToCart')
      .its('response.statusCode')
      .should('eq', 201)
  })
})
```

## 💾 Сохранение значений

### Использование then() и wrap()

```javascript
describe('Сохранение значений', () => {
  it('Сохраняет текст элемента', () => {
    cy.get('.product-price')
      .invoke('text')
      .then((price) => {
        // Сохраняем в alias
        cy.wrap(price).as('productPrice')
      })
    
    // Используем позже
    cy.get('@productPrice').then((price) => {
      cy.log(`Цена: ${price}`)
    })
  })

  it('Сохраняет множественные значения', () => {
    cy.get('.product-name').invoke('text').as('productName')
    cy.get('.product-price').invoke('text').as('productPrice')
    cy.get('.product-rating').invoke('text').as('productRating')
    
    // Используем все вместе
    cy.get('@productName').then(function(name) {
      cy.get('@productPrice').then(function(price) {
        cy.get('@productRating').then(function(rating) {
          cy.log(`${name}: ${price} (${rating}⭐)`)
        })
      })
    })
  })
})
```

### Вычисления и трансформации

```javascript
describe('Работа с вычислениями', () => {
  it('Суммирует цены товаров', () => {
    let total = 0
    
    cy.get('.product-price').each(($el) => {
      const price = parseFloat($el.text().replace(/[^\d.]/g, ''))
      total += price
    }).then(() => {
      cy.wrap(total).as('totalPrice')
    })
    
    cy.get('@totalPrice').should('be.greaterThan', 0)
    
    cy.get('@totalPrice').then((total) => {
      cy.log(`Общая сумма: ${total}₽`)
      expect(total).to.be.lessThan(100000)
    })
  })

  it('Сравнивает значения до и после', () => {
    // Сохраняем начальное значение
    cy.get('.cart-count')
      .invoke('text')
      .then(parseInt)
      .as('initialCount')
    
    // Добавляем товар
    cy.get('#add-to-cart').click()
    
    // Проверяем что увеличилось
    cy.get('.cart-count')
      .invoke('text')
      .then(parseInt)
      .then(function(currentCount) {
        expect(currentCount).to.eq(this.initialCount + 1)
      })
  })
})
```

## 🔄 Переиспользование данных

### Паттерн: Сохранение состояния

```javascript
describe('Сложный сценарий с состоянием', () => {
  beforeEach(() => {
    cy.visit('/shop')
  })

  it('Покупает товар с сохранением данных', () => {
    // Шаг 1: Выбираем товар
    cy.get('.product-card')
      .first()
      .within(() => {
        cy.get('.product-name').invoke('text').as('selectedProductName')
        cy.get('.product-price').invoke('text').as('selectedProductPrice')
        cy.get('.add-to-cart').click()
      })
    
    // Шаг 2: Проверяем корзину
    cy.get('.cart-icon').click()
    
    cy.get('@selectedProductName').then(function(name) {
      cy.get('.cart-items').should('contain', name)
    })
    
    // Шаг 3: Оформляем заказ
    cy.get('#checkout').click()
    
    cy.get('@selectedProductName').then(function(name) {
      cy.get('@selectedProductPrice').then(function(price) {
        // Проверяем итоговую страницу
        cy.get('.order-summary')
          .should('contain', name)
          .and('contain', price)
      })
    })
  })
})
```

### Паттерн: Цепочка зависимых тестов

```javascript
describe('Последовательные действия', () => {
  it('Создает пользователя и использует его данные', () => {
    // Генерируем уникального пользователя
    const timestamp = Date.now()
    const userData = {
      email: `user${timestamp}@example.com`,
      password: 'TestPass123!',
      name: 'Тестовый Пользователь'
    }
    
    cy.wrap(userData).as('newUser')
    
    // Регистрация
    cy.visit('/register')
    cy.get('#email').type(userData.email)
    cy.get('#password').type(userData.password)
    cy.get('#name').type(userData.name)
    cy.get('#submit').click()
    
    cy.url().should('include', '/welcome')
    
    // Выход
    cy.get('#logout').click()
    
    // Вход с теми же данными
    cy.get('@newUser').then((user) => {
      cy.visit('/login')
      cy.get('#email').type(user.email)
      cy.get('#password').type(user.password)
      cy.get('#login').click()
      
      cy.contains(`Добро пожаловать, ${user.name}`)
    })
  })
})
```

## 🎯 Продвинутые техники

### Динамические алиасы

```javascript
describe('Динамические алиасы', () => {
  it('Создает алиасы в цикле', () => {
    cy.get('.product-card').each(($card, index) => {
      cy.wrap($card)
        .find('.product-name')
        .invoke('text')
        .as(`product${index}Name`)
      
      cy.wrap($card)
        .find('.product-price')
        .invoke('text')
        .as(`product${index}Price`)
    })
    
    // Используем созданные алиасы
    cy.get('@product0Name').should('exist')
    cy.get('@product1Price').should('exist')
  })
})
```

### Глобальное состояние (осторожно!)

```javascript
// В support/commands.js
let globalState = {}

Cypress.Commands.add('saveToGlobalState', (key, value) => {
  globalState[key] = value
})

Cypress.Commands.add('getFromGlobalState', (key) => {
  return cy.wrap(globalState[key])
})

// В тесте
describe('Глобальное состояние', () => {
  it('Сохраняет данные глобально', () => {
    cy.visit('/products')
    cy.get('.product-id').first().invoke('text').then((id) => {
      cy.saveToGlobalState('selectedProductId', id)
    })
  })

  it('Использует сохраненные данные', () => {
    cy.getFromGlobalState('selectedProductId').then((id) => {
      cy.visit(`/products/${id}`)
      cy.get('.product-id').should('have.text', id)
    })
  })
})
```

### Комбинирование алиасов

```javascript
describe('Комбинирование данных', () => {
  beforeEach(() => {
    cy.fixture('user').as('user')
    cy.fixture('products').as('products')
  })

  it('Использует несколько источников данных', function() {
    // Берем данные из разных фикстур
    const user = this.user
    const product = this.products[0]
    
    // Логин
    cy.visit('/login')
    cy.get('#email').type(user.email)
    cy.get('#password').type(user.password)
    cy.get('#login').click()
    
    // Покупка товара
    cy.visit('/shop')
    cy.contains(product.name).click()
    cy.get('#add-to-cart').click()
    
    // Проверка
    cy.get('.cart-items').should('contain', product.name)
  })
})
```

## 🎓 Лучшие практики

### ✅ DO (Делать)

```javascript
// Используйте алиасы для часто используемых элементов
cy.get('.modal').as('modal')
cy.get('@modal').should('be.visible')  // ✅

// Создавайте алиасы в beforeEach
beforeEach(() => {
  cy.get('.navbar').as('navbar')
})  // ✅

// Используйте описательные имена
cy.get('.price').as('productPrice')  // ✅

// Оборачивайте значения в wrap()
cy.wrap(myValue).as('myAlias')  // ✅
```

### ❌ DON'T (Не делать)

```javascript
// Не используйте const/let для элементов
const button = cy.get('button')  // ❌

// Не забывайте @ при использовании алиаса
cy.get('myAlias')  // ❌ должно быть '@myAlias'

// Не переиспользуйте имена алиасов
cy.get('.first').as('element')
cy.get('.second').as('element')  // ❌ перезапишет первый

// Не ожидайте синхронного поведения
let text = cy.get('h1').text()
console.log(text)  // ❌ undefined
```

## 💡 Практические советы

1. **Именование**: Используйте camelCase для алиасов: `@userName`, `@productPrice`
2. **Область видимости**: Алиасы доступны только в текущем тесте и хуках
3. **Обновление**: Алиасы обновляются при каждом `beforeEach`
4. **Производительность**: Алиасы не сохраняют элемент, они сохраняют запрос

## 📝 Задание для самопроверки

1. Создайте тест который:
   - Сохраняет 3 разных элемента в алиасы
   - Использует эти алиасы в разных местах теста
   
2. Напишите тест который:
   - Сохраняет цену товара до добавления в корзину
   - Проверяет что та же цена отображается в корзине

3. Создайте тест с API который:
   - Перехватывает 2 разных запроса
   - Сохраняет их в алиасы
   - Проверяет данные из обоих запросов

## 🔗 Полезные ссылки

- [Cypress Variables and Aliases](https://docs.cypress.io/guides/core-concepts/variables-and-aliases)
- [Cypress as() Command](https://docs.cypress.io/api/commands/as)
- [Cypress wrap() Command](https://docs.cypress.io/api/commands/wrap)

---

**Следующий урок:** [Урок 10: Перехватчики запросов](lesson-10-intercepts.md)
