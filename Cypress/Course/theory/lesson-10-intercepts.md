# Урок 10: Перехват сетевых запросов (Intercepts)

## 🎯 Цели урока
- Научиться перехватывать HTTP запросы
- Понять как мокировать API ответы
- Освоить тестирование без backend
- Изучить продвинутые техники работы с сетью

## 📖 Что такое cy.intercept()?

**cy.intercept()** - мощный инструмент для контроля сетевых запросов. Позволяет:
- 👀 Наблюдать за запросами
- 🔄 Изменять запросы и ответы
- 🎭 Подменять данные (мокирование)
- ⏱️ Контролировать время ответа

## 🔍 Базовое использование

### Простой перехват

```javascript
describe('Перехват запросов', () => {
  it('Ждет загрузки данных', () => {
    // Перехватываем GET запрос
    cy.intercept('GET', '/api/products').as('getProducts')
    
    cy.visit('/shop')
    
    // Ждем пока запрос выполнится
    cy.wait('@getProducts')
    
    // Проверяем что данные загрузились
    cy.get('.product-card').should('have.length.greaterThan', 0)
  })
})
```

### Проверка запроса и ответа

```javascript
it('Проверяет детали запроса', () => {
  cy.intercept('GET', '/api/user/*').as('getUser')
  
  cy.visit('/profile/123')
  
  cy.wait('@getUser').then((interception) => {
    // Проверяем URL
    expect(interception.request.url).to.include('/api/user/123')
    
    // Проверяем заголовки
    expect(interception.request.headers).to.have.property('authorization')
    
    // Проверяем ответ
    expect(interception.response.statusCode).to.eq(200)
    expect(interception.response.body).to.have.property('id', 123)
    expect(interception.response.body.name).to.be.a('string')
  })
})
```

## 🎭 Мокирование ответов

### Фиксированный ответ

```javascript
describe('Мокирование API', () => {
  it('Возвращает моковые данные', () => {
    // Подменяем ответ
    cy.intercept('GET', '/api/products', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Товар 1', price: 1000 },
        { id: 2, name: 'Товар 2', price: 2000 }
      ]
    }).as('getProducts')
    
    cy.visit('/shop')
    cy.wait('@getProducts')
    
    // Видим только моковые товары
    cy.get('.product-card').should('have.length', 2)
    cy.contains('Товар 1').should('be.visible')
  })
})
```

### Ответ из фикстуры

```javascript
it('Использует данные из фикстуры', () => {
  cy.intercept('GET', '/api/users', {
    fixture: 'users.json'
  }).as('getUsers')
  
  cy.visit('/users')
  cy.wait('@getUsers')
  
  cy.get('.user-item').should('exist')
})
```

### Динамические ответы

```javascript
it('Генерирует динамический ответ', () => {
  cy.intercept('GET', '/api/time', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        timestamp: Date.now(),
        message: 'Текущее время'
      }
    })
  }).as('getTime')
  
  cy.visit('/clock')
  cy.wait('@getTime')
})
```

## 🔄 Модификация запросов и ответов

### Изменение заголовков

```javascript
describe('Модификация запросов', () => {
  it('Добавляет заголовки к запросу', () => {
    cy.intercept('GET', '/api/protected', (req) => {
      // Добавляем токен авторизации
      req.headers['authorization'] = 'Bearer fake-token-123'
      req.continue()
    })
    
    cy.visit('/protected-page')
  })

  it('Изменяет ответ сервера', () => {
    cy.intercept('GET', '/api/config', (req) => {
      req.continue((res) => {
        // Модифицируем ответ
        res.body.featureFlag = true
        res.body.maxItems = 100
      })
    })
    
    cy.visit('/app')
  })
})
```

### Условная модификация

```javascript
it('Изменяет только определенные запросы', () => {
  cy.intercept('GET', '/api/products/*', (req) => {
    if (req.url.includes('products/999')) {
      // Возвращаем 404 для несуществующего товара
      req.reply({
        statusCode: 404,
        body: { error: 'Товар не найден' }
      })
    } else {
      // Остальные запросы проходят обычно
      req.continue()
    }
  })
})
```

## ⚡ Тестирование состояний загрузки

### Симуляция задержки

```javascript
describe('Состояния загрузки', () => {
  it('Показывает индикатор загрузки', () => {
    cy.intercept('GET', '/api/products', (req) => {
      // Задержка 2 секунды
      req.on('response', (res) => {
        res.setDelay(2000)
      })
    }).as('slowProducts')
    
    cy.visit('/shop')
    
    // Проверяем что показывается лоадер
    cy.get('.loading-spinner').should('be.visible')
    
    cy.wait('@slowProducts')
    
    // Лоадер исчез
    cy.get('.loading-spinner').should('not.exist')
    cy.get('.product-card').should('be.visible')
  })
})
```

### Тестирование ошибок

```javascript
describe('Обработка ошибок', () => {
  it('Показывает сообщение при ошибке сервера', () => {
    cy.intercept('GET', '/api/products', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('serverError')
    
    cy.visit('/shop')
    cy.wait('@serverError')
    
    cy.contains('Произошла ошибка').should('be.visible')
    cy.get('.retry-button').should('be.visible')
  })

  it('Обрабатывает сетевую ошибку', () => {
    cy.intercept('GET', '/api/products', {
      forceNetworkError: true
    }).as('networkError')
    
    cy.visit('/shop')
    
    cy.contains('Нет подключения к интернету').should('be.visible')
  })
})
```

## 📊 POST, PUT, DELETE запросы

### POST запросы

```javascript
describe('Создание данных', () => {
  it('Перехватывает создание пользователя', () => {
    cy.intercept('POST', '/api/users').as('createUser')
    
    cy.visit('/register')
    cy.get('#name').type('Иван')
    cy.get('#email').type('ivan@example.com')
    cy.get('#submit').click()
    
    cy.wait('@createUser').then((interception) => {
      // Проверяем отправленные данные
      expect(interception.request.body).to.deep.include({
        name: 'Иван',
        email: 'ivan@example.com'
      })
      
      // Проверяем ответ
      expect(interception.response.statusCode).to.eq(201)
      expect(interception.response.body).to.have.property('id')
    })
  })

  it('Мокирует успешное создание', () => {
    cy.intercept('POST', '/api/products', {
      statusCode: 201,
      body: {
        id: 999,
        name: 'Новый товар',
        createdAt: new Date().toISOString()
      }
    }).as('createProduct')
    
    cy.visit('/admin/products/new')
    cy.get('#name').type('Новый товар')
    cy.get('#submit').click()
    
    cy.wait('@createProduct')
    cy.contains('Товар создан').should('be.visible')
  })
})
```

### PUT и DELETE

```javascript
describe('Обновление и удаление', () => {
  it('Обновляет данные', () => {
    cy.intercept('PUT', '/api/products/1', {
      statusCode: 200,
      body: { id: 1, name: 'Обновленный товар' }
    }).as('updateProduct')
    
    cy.visit('/products/1/edit')
    cy.get('#name').clear().type('Обновленный товар')
    cy.get('#save').click()
    
    cy.wait('@updateProduct')
  })

  it('Удаляет элемент', () => {
    cy.intercept('DELETE', '/api/products/*', {
      statusCode: 204
    }).as('deleteProduct')
    
    cy.visit('/products')
    cy.get('[data-product="1"]').find('.delete-btn').click()
    cy.get('.confirm-delete').click()
    
    cy.wait('@deleteProduct')
    cy.get('[data-product="1"]').should('not.exist')
  })
})
```

## 🎯 Продвинутые паттерны

### Множественные перехваты

```javascript
describe('Сложный сценарий', () => {
  it('Работает с несколькими API', () => {
    cy.intercept('GET', '/api/user').as('getUser')
    cy.intercept('GET', '/api/cart').as('getCart')
    cy.intercept('GET', '/api/recommendations').as('getRecommendations')
    
    cy.visit('/dashboard')
    
    // Ждем все запросы
    cy.wait(['@getUser', '@getCart', '@getRecommendations'])
    
    // Проверяем что всё загрузилось
    cy.get('.user-name').should('exist')
    cy.get('.cart-items').should('exist')
    cy.get('.recommendations').should('exist')
  })
})
```

### Последовательность запросов

```javascript
it('Проверяет порядок запросов', () => {
  const requests = []
  
  cy.intercept('GET', '/api/**', (req) => {
    requests.push(req.url)
    req.continue()
  })
  
  cy.visit('/complex-page')
  
  cy.wait(2000).then(() => {
    expect(requests[0]).to.include('/api/config')
    expect(requests[1]).to.include('/api/user')
    expect(requests[2]).to.include('/api/data')
  })
})
```

### Паттерн: API State Management

```javascript
describe('Управление состоянием через API', () => {
  beforeEach(() => {
    // Мокируем начальное состояние
    cy.intercept('GET', '/api/cart', {
      body: { items: [], total: 0 }
    }).as('getCart')
  })

  it('Добавляет товар в корзину', () => {
    let cartItems = []
    
    // Мокируем добавление
    cy.intercept('POST', '/api/cart/items', (req) => {
      cartItems.push(req.body)
      req.reply({
        statusCode: 201,
        body: { items: cartItems, total: cartItems.length }
      })
    }).as('addToCart')
    
    // Мокируем последующие GET
    cy.intercept('GET', '/api/cart', (req) => {
      req.reply({
        body: { items: cartItems, total: cartItems.length }
      })
    })
    
    cy.visit('/shop')
    cy.get('.product').first().click()
    cy.get('#add-to-cart').click()
    
    cy.wait('@addToCart')
    cy.get('.cart-count').should('have.text', '1')
  })
})
```

## 🎓 Лучшие практики

### ✅ DO (Делать)

```javascript
// Используйте алиасы для всех перехватов
cy.intercept('GET', '/api/users').as('getUsers')  // ✅

// Проверяйте важные данные
cy.wait('@getUsers').its('response.statusCode').should('eq', 200)  // ✅

// Мокируйте для изоляции тестов
cy.intercept('GET', '/api/**', { fixture: 'data.json' })  // ✅
```

### ❌ DON'T (Не делать)

```javascript
// Не забывайте wait для async операций
cy.intercept('GET', '/api/data').as('getData')
cy.visit('/')
// ❌ забыли cy.wait('@getData')

// Не используйте intercept без необходимости
// ❌ если можно обойтись без мока, обойдитесь
```

## 📝 Задание

1. Создайте тест который мокирует список товаров
2. Добавьте задержку 3 секунды и проверьте лоадер
3. Создайте тест с ошибкой 500 и проверьте сообщение об ошибке
4. Перехватите POST запрос и проверьте отправленные данные

## 🔗 Полезные ссылки

- [Cypress intercept()](https://docs.cypress.io/api/commands/intercept)
- [Network Requests](https://docs.cypress.io/guides/guides/network-requests)

---

**Следующий урок:** [Урок 11: Пользовательские команды](lesson-11-custom-commands.md)
