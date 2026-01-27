# Практическое задание 6: Итоговый проект

## 🎯 Цель
Создать полноценный проект автотестов, применив все изученные знания: селекторы, проверки, Page Object Model, Custom Commands, API тестирование и CI/CD.

## 🏗️ Описание проекта

Вы будете тестировать **интернет-магазин** (можно использовать демо-сайт или свой проект).

### Функциональность для тестирования:
1. 🔐 Авторизация и регистрация
2. 🛍️ Каталог товаров
3. 🛒 Корзина покупок
4. 💳 Оформление заказа
5. 👤 Профиль пользователя

## 📁 Структура проекта

```
cypress-shop-tests/
├── cypress/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.cy.js
│   │   │   └── registration.cy.js
│   │   ├── shop/
│   │   │   ├── catalog.cy.js
│   │   │   ├── product-details.cy.js
│   │   │   └── search.cy.js
│   │   ├── cart/
│   │   │   ├── add-to-cart.cy.js
│   │   │   ├── cart-management.cy.js
│   │   │   └── checkout.cy.js
│   │   ├── profile/
│   │   │   ├── profile-edit.cy.js
│   │   │   └── order-history.cy.js
│   │   └── api/
│   │       ├── products-api.cy.js
│   │       └── orders-api.cy.js
│   ├── fixtures/
│   │   ├── users.json
│   │   ├── products.json
│   │   └── test-data.json
│   ├── support/
│   │   ├── pages/
│   │   │   ├── BasePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── CatalogPage.js
│   │   │   ├── ProductPage.js
│   │   │   ├── CartPage.js
│   │   │   └── CheckoutPage.js
│   │   ├── commands/
│   │   │   ├── auth.js
│   │   │   ├── cart.js
│   │   │   └── api.js
│   │   └── e2e.js
│   └── downloads/
├── .github/
│   └── workflows/
│       └── cypress.yml
├── cypress.config.js
├── package.json
└── README.md
```

## 📝 Требования к реализации

### 1. Page Object Model

**BasePage.js:**
```javascript
class BasePage {
  elements = {
    header: () => cy.get('header'),
    logo: () => cy.get('.logo'),
    cartIcon: () => cy.get('.cart-icon'),
    userMenu: () => cy.get('.user-menu'),
    searchInput: () => cy.get('#search')
  }
  
  visit(url) {
    cy.visit(url)
    return this
  }
  
  search(query) {
    this.elements.searchInput().type(`${query}{enter}`)
    return this
  }
  
  openCart() {
    this.elements.cartIcon().click()
    return this
  }
}

export default BasePage
```

**LoginPage.js:**
```javascript
import BasePage from './BasePage'

class LoginPage extends BasePage {
  elements = {
    emailInput: () => cy.get('#email'),
    passwordInput: () => cy.get('#password'),
    submitButton: () => cy.get('#login-btn'),
    errorMessage: () => cy.get('.error-message')
  }
  
  visit() {
    super.visit('/login')
    return this
  }
  
  login(email, password) {
    this.elements.emailInput().type(email)
    this.elements.passwordInput().type(password)
    this.elements.submitButton().click()
    return this
  }
  
  shouldShowError(message) {
    this.elements.errorMessage()
      .should('be.visible')
      .and('contain', message)
    return this
  }
}

export default new LoginPage()
```

### 2. Custom Commands

**cypress/support/commands/auth.js:**
```javascript
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#login-btn').click()
    cy.url().should('include', '/dashboard')
  })
})

Cypress.Commands.add('loginAsAdmin', () => {
  cy.fixture('users').then((users) => {
    cy.login(users.admin.email, users.admin.password)
  })
})

Cypress.Commands.add('loginAsUser', () => {
  cy.fixture('users').then((users) => {
    cy.login(users.regular.email, users.regular.password)
  })
})
```

**cypress/support/commands/cart.js:**
```javascript
Cypress.Commands.add('addToCart', (productId) => {
  cy.get(`[data-product-id="${productId}"]`).click()
  cy.get('#add-to-cart').click()
  cy.contains('Товар добавлен').should('be.visible')
})

Cypress.Commands.add('clearCart', () => {
  cy.get('.cart-icon').click()
  cy.get('.clear-cart-btn').click()
  cy.get('.confirm-btn').click()
})

Cypress.Commands.add('getCartCount', () => {
  return cy.get('.cart-count').invoke('text').then(parseInt)
})
```

### 3. Fixtures

**cypress/fixtures/users.json:**
```json
{
  "admin": {
    "email": "admin@shop.com",
    "password": "Admin123!",
    "name": "Администратор"
  },
  "regular": {
    "email": "user@shop.com",
    "password": "User123!",
    "name": "Иван Петров"
  },
  "newUser": {
    "email": "newuser@shop.com",
    "password": "NewUser123!",
    "name": "Новый Пользователь",
    "phone": "+7 999 123-45-67"
  }
}
```

**cypress/fixtures/products.json:**
```json
{
  "laptop": {
    "id": 1,
    "name": "Ноутбук Dell XPS 15",
    "price": 89990,
    "category": "Ноутбуки"
  },
  "mouse": {
    "id": 2,
    "name": "Мышь Logitech MX Master",
    "price": 5990,
    "category": "Аксессуары"
  }
}
```

### 4. Примеры тестов

**cypress/e2e/auth/login.cy.js:**
```javascript
import loginPage from '../../support/pages/LoginPage'
import dashboardPage from '../../support/pages/DashboardPage'

describe('Авторизация', () => {
  beforeEach(() => {
    loginPage.visit()
  })

  it('Успешный вход с валидными данными', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.regular.email, users.regular.password)
      dashboardPage.shouldBeVisible()
    })
  })

  it('Ошибка при неверном пароле', () => {
    loginPage.login('user@shop.com', 'wrong-password')
    loginPage.shouldShowError('Неверный email или пароль')
  })

  it('Ошибка при невалидном email', () => {
    loginPage.login('invalid-email', 'password')
    loginPage.shouldShowError('Введите корректный email')
  })

  it('Кнопка входа заблокирована при пустых полях', () => {
    loginPage.elements.submitButton().should('be.disabled')
  })
})
```

**cypress/e2e/shop/catalog.cy.js:**
```javascript
import catalogPage from '../../support/pages/CatalogPage'

describe('Каталог товаров', () => {
  beforeEach(() => {
    catalogPage.visit()
  })

  it('Отображает все товары', () => {
    catalogPage.getProductCards()
      .should('have.length.greaterThan', 0)
  })

  it('Фильтрует товары по категории', () => {
    catalogPage.selectCategory('Ноутбуки')
    catalogPage.getProductCards().each(($card) => {
      cy.wrap($card).should('contain', 'Ноутбук')
    })
  })

  it('Сортирует по цене (возрастание)', () => {
    catalogPage.sortBy('price-asc')
    
    let prices = []
    catalogPage.getProductCards().each(($card) => {
      cy.wrap($card)
        .find('.price')
        .invoke('text')
        .then((priceText) => {
          prices.push(parseFloat(priceText.replace(/\D/g, '')))
        })
    }).then(() => {
      const sorted = [...prices].sort((a, b) => a - b)
      expect(prices).to.deep.equal(sorted)
    })
  })

  it('Поиск находит товары', () => {
    catalogPage.search('ноутбук')
    catalogPage.getProductCards().should('exist')
    catalogPage.getProductCards().first().should('contain', 'Ноутбук')
  })
})
```

**cypress/e2e/cart/checkout.cy.js:**
```javascript
import catalogPage from '../../support/pages/CatalogPage'
import cartPage from '../../support/pages/CartPage'
import checkoutPage from '../../support/pages/CheckoutPage'

describe('Оформление заказа', () => {
  beforeEach(() => {
    cy.loginAsUser()
    cy.clearCart()
  })

  it('Полный флоу покупки', () => {
    // Добавляем товары
    catalogPage.visit()
    cy.addToCart(1)
    cy.addToCart(2)
    
    // Открываем корзину
    cartPage.visit()
    cartPage.getItemCount().should('eq', 2)
    
    // Переходим к оформлению
    cartPage.proceedToCheckout()
    
    // Заполняем данные доставки
    checkoutPage
      .fillShippingAddress({
        street: 'Ленина 10',
        city: 'Москва',
        zip: '101000'
      })
      .selectPaymentMethod('card')
      .agreeToTerms()
      .submitOrder()
    
    // Проверяем успех
    cy.contains('Заказ оформлен').should('be.visible')
    cy.url().should('include', '/order-success')
  })

  it('Применяет промокод', () => {
    cy.addToCart(1)
    cartPage.visit()
    
    const initialTotal = cartPage.getTotalPrice()
    
    cartPage.applyCoupon('SALE10')
    
    cartPage.getTotalPrice().then((newTotal) => {
      expect(newTotal).to.be.lessThan(initialTotal)
    })
  })
})
```

### 5. API тесты

**cypress/e2e/api/products-api.cy.js:**
```javascript
describe('API: Продукты', () => {
  it('Получает список продуктов', () => {
    cy.request('/api/products').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
      expect(response.body[0]).to.have.property('id')
      expect(response.body[0]).to.have.property('name')
      expect(response.body[0]).to.have.property('price')
    })
  })

  it('Мокирует список продуктов', () => {
    cy.intercept('GET', '/api/products', {
      fixture: 'products.json'
    }).as('getProducts')
    
    cy.visit('/shop')
    cy.wait('@getProducts')
    
    cy.fixture('products').then((products) => {
      cy.contains(products.laptop.name).should('be.visible')
    })
  })
})
```

### 6. CI/CD

**.github/workflows/cypress.yml:**
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
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Cypress run
        uses: cypress-io/github-action@v5
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
          browser: chrome
      
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
      
      - name: Upload videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
```

## ✅ Чеклист выполнения

### Обязательные требования:
- [ ] Создана структура Page Object для 5+ страниц
- [ ] Реализовано 3+ custom commands
- [ ] Созданы fixtures с тестовыми данными
- [ ] Написано 15+ UI тестов
- [ ] Написано 5+ API тестов
- [ ] Настроен CI/CD pipeline
- [ ] Все тесты проходят успешно

### Дополнительные требования:
- [ ] Использован Faker для генерации данных
- [ ] Настроены отчеты (Mochawesome)
- [ ] Добавлены тесты для edge cases
- [ ] Реализована параллелизация в CI
- [ ] Написаны тесты для мобильной версии
- [ ] Добавлены performance тесты

## 🎓 Критерии оценки

**Отлично (90-100%):**
- Все обязательные требования выполнены
- Код чистый и хорошо структурированный
- Использованы все изученные техники
- Тесты надежные и покрывают основные сценарии
- CI/CD работает безупречно
- Выполнены дополнительные требования

**Хорошо (70-89%):**
- Все обязательные требования выполнены
- Есть небольшие недочеты в структуре
- Некоторые best practices не применены
- Большинство тестов проходят

**Удовлетворительно (50-69%):**
- Выполнена большая часть требований
- Есть значительные недочеты
- Тесты нестабильны

## 💡 Советы

1. **Начните с планирования** - набросайте структуру перед кодированием
2. **Используйте то, что изучили** - примените все паттерны из курса
3. **Пишите чистый код** - другие должны понимать ваши тесты
4. **Тестируйте реалистичные сценарии** - представьте реальных пользователей
5. **Документируйте** - опишите как запускать проект в README

## 🚀 Запуск проекта

```bash
# Установка
npm install

# Локальный запуск
npm run cy:open

# CI режим
npm run cy:run

# Конкретный файл
npm run cy:run -- --spec "cypress/e2e/cart/*.cy.js"
```

## 📚 Дополнительные ресурсы

- [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app)
- [Cypress Example Recipes](https://github.com/cypress-io/cypress-example-recipes)

---

**Поздравляем с завершением курса! 🎉**

Теперь вы готовы к реальным проектам автоматизации тестирования!
