# Урок 12: Page Object Model (POM)

## 🎯 Цели урока
- Понять паттерн Page Object Model
- Научиться структурировать тесты
- Повысить поддерживаемость кода
- Освоить best practices организации

## 📖 Что такое Page Object Model?

**Page Object Model (POM)** - паттерн проектирования, который:
- 📦 Инкапсулирует элементы и действия страницы в классе
- 🔄 Упрощает поддержку тестов
- 📝 Делает код читаемым и переиспользуемым
- 🛡️ Защищает от изменений UI

### Без POM (плохо):

```javascript
describe('Логин', () => {
  it('Пользователь входит', () => {
    cy.visit('/login')
    cy.get('#email').type('user@example.com')
    cy.get('#password').type('Pass123!')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
})
```

### С POM (хорошо):

```javascript
describe('Логин', () => {
  it('Пользователь входит', () => {
    loginPage.visit()
    loginPage.fillEmail('user@example.com')
    loginPage.fillPassword('Pass123!')
    loginPage.submit()
    dashboardPage.shouldBeVisible()
  })
})
```

## 🏗️ Структура Page Object

### Базовый Page Object

**Файл: cypress/support/pages/LoginPage.js**

```javascript
class LoginPage {
  // Селекторы
  elements = {
    emailInput: () => cy.get('#email'),
    passwordInput: () => cy.get('#password'),
    submitButton: () => cy.get('button[type="submit"]'),
    errorMessage: () => cy.get('.error-message'),
    rememberMeCheckbox: () => cy.get('#remember-me')
  }
  
  // Действия
  visit() {
    cy.visit('/login')
  }
  
  fillEmail(email) {
    this.elements.emailInput().clear().type(email)
    return this  // для цепочки
  }
  
  fillPassword(password) {
    this.elements.passwordInput().clear().type(password)
    return this
  }
  
  checkRememberMe() {
    this.elements.rememberMeCheckbox().check()
    return this
  }
  
  submit() {
    this.elements.submitButton().click()
  }
  
  login(email, password) {
    this.fillEmail(email)
    this.fillPassword(password)
    this.submit()
  }
  
  // Проверки
  shouldShowError(message) {
    this.elements.errorMessage()
      .should('be.visible')
      .and('contain', message)
  }
  
  shouldBeOnLoginPage() {
    cy.url().should('include', '/login')
  }
}

export default new LoginPage()
```

### Использование Page Object

```javascript
import loginPage from '../support/pages/LoginPage'
import dashboardPage from '../support/pages/DashboardPage'

describe('Авторизация', () => {
  beforeEach(() => {
    loginPage.visit()
  })

  it('Успешный логин', () => {
    loginPage
      .fillEmail('user@example.com')
      .fillPassword('Pass123!')
      .submit()
    
    dashboardPage.shouldBeVisible()
  })

  it('Логин с запоминанием', () => {
    loginPage.login('user@example.com', 'Pass123!')
    loginPage.checkRememberMe()
    loginPage.submit()
  })

  it('Ошибка при неверных данных', () => {
    loginPage.login('wrong@example.com', 'wrong')
    loginPage.shouldShowError('Неверные учетные данные')
  })
})
```

## 📦 Расширенные примеры

### Page Object для сложной страницы

**Файл: cypress/support/pages/ProductPage.js**

```javascript
class ProductPage {
  elements = {
    // Основные элементы
    productTitle: () => cy.get('h1.product-title'),
    productPrice: () => cy.get('.product-price'),
    productImage: () => cy.get('.product-image'),
    productDescription: () => cy.get('.product-description'),
    
    // Действия
    addToCartButton: () => cy.get('#add-to-cart'),
    quantityInput: () => cy.get('#quantity'),
    increaseQuantity: () => cy.get('.quantity-increase'),
    decreaseQuantity: () => cy.get('.quantity-decrease'),
    
    // Вкладки
    reviewsTab: () => cy.get('[data-tab="reviews"]'),
    specificationsTab: () => cy.get('[data-tab="specifications"]'),
    
    // Отзывы
    reviewsList: () => cy.get('.reviews-list'),
    reviewItem: () => cy.get('.review-item'),
    addReviewButton: () => cy.get('#add-review'),
    reviewRating: () => cy.get('.review-rating'),
    reviewText: () => cy.get('#review-text'),
    submitReview: () => cy.get('#submit-review')
  }
  
  // Навигация
  visit(productId) {
    cy.visit(`/products/${productId}`)
    return this
  }
  
  // Получение данных
  getTitle() {
    return this.elements.productTitle().invoke('text')
  }
  
  getPrice() {
    return this.elements.productPrice()
      .invoke('text')
      .then(text => parseFloat(text.replace(/[^\d.]/g, '')))
  }
  
  // Действия с количеством
  setQuantity(amount) {
    this.elements.quantityInput().clear().type(amount)
    return this
  }
  
  increaseQty(times = 1) {
    for (let i = 0; i < times; i++) {
      this.elements.increaseQuantity().click()
    }
    return this
  }
  
  // Добавление в корзину
  addToCart() {
    this.elements.addToCartButton().click()
    return this
  }
  
  addMultipleToCart(quantity) {
    this.setQuantity(quantity)
    this.addToCart()
    return this
  }
  
  // Работа с вкладками
  openReviewsTab() {
    this.elements.reviewsTab().click()
    return this
  }
  
  openSpecificationsTab() {
    this.elements.specificationsTab().click()
    return this
  }
  
  // Отзывы
  addReview(rating, text) {
    this.elements.addReviewButton().click()
    this.elements.reviewRating().find(`[data-rating="${rating}"]`).click()
    this.elements.reviewText().type(text)
    this.elements.submitReview().click()
    return this
  }
  
  getReviewsCount() {
    return this.elements.reviewItem().its('length')
  }
  
  // Проверки
  shouldBeVisible() {
    this.elements.productTitle().should('be.visible')
    cy.url().should('include', '/products/')
    return this
  }
  
  shouldHaveTitle(title) {
    this.elements.productTitle().should('have.text', title)
    return this
  }
  
  shouldHavePrice(price) {
    this.elements.productPrice().should('contain', price)
    return this
  }
  
  shouldShowAddedToCartMessage() {
    cy.contains('Товар добавлен в корзину').should('be.visible')
    return this
  }
}

export default new ProductPage()
```

### Base Page Object (наследование)

**Файл: cypress/support/pages/BasePage.js**

```javascript
class BasePage {
  // Общие элементы для всех страниц
  elements = {
    header: () => cy.get('header'),
    footer: () => cy.get('footer'),
    navigation: () => cy.get('nav'),
    logo: () => cy.get('.logo'),
    searchInput: () => cy.get('#search'),
    userMenu: () => cy.get('.user-menu'),
    cartIcon: () => cy.get('.cart-icon'),
    notificationBar: () => cy.get('.notification-bar')
  }
  
  // Общие действия
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
  
  openUserMenu() {
    this.elements.userMenu().click()
    return this
  }
  
  logout() {
    this.openUserMenu()
    cy.contains('Выход').click()
    return this
  }
  
  // Общие проверки
  shouldHaveTitle(title) {
    cy.title().should('include', title)
    return this
  }
  
  shouldShowNotification(message) {
    this.elements.notificationBar()
      .should('be.visible')
      .and('contain', message)
    return this
  }
  
  shouldBeLoggedIn() {
    this.elements.userMenu().should('be.visible')
    return this
  }
}

export default BasePage
```

**Файл: cypress/support/pages/DashboardPage.js**

```javascript
import BasePage from './BasePage'

class DashboardPage extends BasePage {
  elements = {
    ...this.elements,  // наследуем элементы из BasePage
    welcomeMessage: () => cy.get('.welcome-message'),
    statsWidget: () => cy.get('.stats-widget'),
    recentOrders: () => cy.get('.recent-orders'),
    quickActions: () => cy.get('.quick-actions')
  }
  
  visit() {
    super.visit('/dashboard')
    return this
  }
  
  getWelcomeMessage() {
    return this.elements.welcomeMessage().invoke('text')
  }
  
  shouldBeVisible() {
    cy.url().should('include', '/dashboard')
    this.elements.welcomeMessage().should('be.visible')
    return this
  }
}

export default new DashboardPage()
```

## 🎯 Продвинутые паттерны

### Component Objects (для переиспользуемых компонентов)

**Файл: cypress/support/components/Modal.js**

```javascript
class Modal {
  elements = {
    container: () => cy.get('.modal'),
    title: () => cy.get('.modal-title'),
    content: () => cy.get('.modal-content'),
    closeButton: () => cy.get('.modal-close'),
    confirmButton: () => cy.get('.modal-confirm'),
    cancelButton: () => cy.get('.modal-cancel')
  }
  
  shouldBeVisible() {
    this.elements.container().should('be.visible')
    return this
  }
  
  shouldHaveTitle(title) {
    this.elements.title().should('have.text', title)
    return this
  }
  
  confirm() {
    this.elements.confirmButton().click()
    return this
  }
  
  cancel() {
    this.elements.cancelButton().click()
    return this
  }
  
  close() {
    this.elements.closeButton().click()
    return this
  }
}

export default new Modal()
```

**Использование компонента:**

```javascript
import productPage from '../support/pages/ProductPage'
import modal from '../support/components/Modal'

describe('Удаление товара', () => {
  it('Подтверждает удаление', () => {
    productPage.visit(123)
    productPage.clickDelete()
    
    modal.shouldBeVisible()
    modal.shouldHaveTitle('Подтверждение удаления')
    modal.confirm()
    
    cy.contains('Товар удален').should('be.visible')
  })
})
```

### Fluent Interface (цепочки)

```javascript
class CartPage {
  // ... elements ...
  
  // Все методы возвращают this
  addProduct(id) {
    // ...
    return this
  }
  
  removeProduct(id) {
    // ...
    return this
  }
  
  updateQuantity(id, qty) {
    // ...
    return this
  }
  
  applyCoupon(code) {
    // ...
    return this
  }
  
  proceedToCheckout() {
    // ...
    return this
  }
}

// Использование
cartPage
  .visit()
  .addProduct(1)
  .addProduct(2)
  .applyCoupon('SALE10')
  .proceedToCheckout()
```

## 📂 Структура проекта

```
cypress/
├── e2e/
│   ├── auth/
│   │   ├── login.cy.js
│   │   └── registration.cy.js
│   ├── shop/
│   │   ├── products.cy.js
│   │   └── cart.cy.js
│   └── admin/
│       └── dashboard.cy.js
├── support/
│   ├── pages/
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   ├── ProductPage.js
│   │   ├── CartPage.js
│   │   └── CheckoutPage.js
│   ├── components/
│   │   ├── Modal.js
│   │   ├── Navigation.js
│   │   └── ProductCard.js
│   ├── commands/
│   │   └── auth.js
│   └── e2e.js
└── fixtures/
    └── products.json
```

## 🎓 Лучшие практики

### ✅ DO (Делать)

```javascript
// Используйте функции для селекторов (ленивая загрузка)
elements = {
  button: () => cy.get('#btn')  // ✅
}

// Возвращайте this для цепочек
fillForm() {
  // ...
  return this  // ✅
}

// Инкапсулируйте логику
login(email, password) {
  this.fillEmail(email)
  this.fillPassword(password)
  this.submit()
}  // ✅

// Группируйте связанные действия
shouldShowSuccessState() {
  this.elements.message().should('be.visible')
  cy.url().should('include', '/success')
}  // ✅
```

### ❌ DON'T (Не делать)

```javascript
// Не храните элементы как константы
elements = {
  button: cy.get('#btn')  // ❌ будет вызван сразу
}

// Не смешивайте логику страниц
class LoginPage {
  checkoutProduct() { ... }  // ❌ не относится к логину
}

// Не делайте assertions в действиях
clickButton() {
  this.button().click().should('...') // ❌
}

// Разделяйте: действия отдельно, проверки отдельно
clickButton() {
  this.button().click()  // ✅ действие
}
shouldShowResult() {
  cy.get('...').should('...') // ✅ проверка
}
```

## 💡 Советы

1. **Один файл = одна страница/компонент**
2. **Используйте наследование для общей логики**
3. **Разделяйте действия и проверки**
4. **Делайте методы атомарными**
5. **Документируйте сложные методы**

## 📝 Задание

1. Создайте Page Object для страницы регистрации
2. Создайте Page Object для страницы корзины с методами:
   - `addProduct()`
   - `removeProduct()`
   - `getTotalPrice()`
3. Создайте Component Object для карточки товара
4. Перепишите существующий тест используя POM

## 🔗 Полезные ссылки

- [Page Object Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)

---

**Следующий урок:** [Урок 13: Лучшие практики](lesson-13-best-practices.md)
