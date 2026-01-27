# Урок 8: Работа с данными и фикстурами

## 🎯 Цели урока
- Научиться работать с тестовыми данными
- Освоить fixtures для хранения данных
- Понять как использовать динамические данные
- Изучить лучшие практики управления данными

## 📖 Что такое Fixtures?

**Fixtures** (фикстуры) - это файлы с тестовыми данными, которые можно переиспользовать в разных тестах. Это как база данных для ваших тестов.

```
cypress/
├── fixtures/
│   ├── users.json          ← тестовые пользователи
│   ├── products.json       ← тестовые продукты
│   └── config.json         ← конфигурация
```

## 📁 Создание и использование Fixtures

### Простой пример

**Файл: cypress/fixtures/user.json**
```json
{
  "name": "Иван Петров",
  "email": "ivan@example.com",
  "password": "SecurePass123!",
  "age": 25
}
```

**Использование в тесте:**
```javascript
describe('Регистрация пользователя', () => {
  it('Регистрирует нового пользователя', () => {
    // Загружаем фикстуру
    cy.fixture('user').then((user) => {
      cy.visit('/register')
      cy.get('#name').type(user.name)
      cy.get('#email').type(user.email)
      cy.get('#password').type(user.password)
      cy.get('#submit').click()
      
      cy.contains(`Добро пожаловать, ${user.name}!`)
    })
  })
})
```

### Множественные данные

**Файл: cypress/fixtures/users.json**
```json
{
  "admin": {
    "email": "admin@example.com",
    "password": "AdminPass123!",
    "role": "administrator"
  },
  "regular": {
    "email": "user@example.com",
    "password": "UserPass123!",
    "role": "user"
  },
  "guest": {
    "email": "guest@example.com",
    "password": "GuestPass123!",
    "role": "guest"
  }
}
```

**Использование:**
```javascript
describe('Авторизация разных пользователей', () => {
  beforeEach(() => {
    cy.fixture('users').as('users')
  })

  it('Админ может войти в систему', function() {
    cy.visit('/login')
    cy.get('#email').type(this.users.admin.email)
    cy.get('#password').type(this.users.admin.password)
    cy.get('#login-btn').click()
    
    cy.url().should('include', '/admin/dashboard')
  })

  it('Обычный пользователь может войти', function() {
    cy.visit('/login')
    cy.get('#email').type(this.users.regular.email)
    cy.get('#password').type(this.users.regular.password)
    cy.get('#login-btn').click()
    
    cy.url().should('include', '/dashboard')
  })
})
```

## 🗃️ Типы данных в Fixtures

### 1. JSON (самый распространенный)

```json
{
  "products": [
    {
      "id": 1,
      "name": "Ноутбук",
      "price": 50000,
      "inStock": true
    },
    {
      "id": 2,
      "name": "Мышь",
      "price": 1500,
      "inStock": false
    }
  ]
}
```

### 2. JavaScript файлы

**Файл: cypress/fixtures/testData.js**
```javascript
module.exports = {
  getRandomUser: () => ({
    name: `User${Date.now()}`,
    email: `user${Date.now()}@example.com`,
    password: 'TestPass123!'
  }),
  
  products: {
    laptop: { name: 'Ноутбук', price: 50000 },
    mouse: { name: 'Мышь', price: 1500 }
  }
}
```

**Использование:**
```javascript
import testData from '../fixtures/testData.js'

it('Регистрация с уникальными данными', () => {
  const user = testData.getRandomUser()
  
  cy.visit('/register')
  cy.get('#email').type(user.email)
  cy.get('#password').type(user.password)
  cy.get('#submit').click()
})
```

### 3. CSV файлы

**Файл: cypress/fixtures/products.csv**
```csv
id,name,price,category
1,Ноутбук,50000,Электроника
2,Мышь,1500,Аксессуары
3,Клавиатура,3000,Аксессуары
```

**Использование (требует плагин):**
```javascript
cy.task('readCsv', 'products.csv').then((products) => {
  products.forEach(product => {
    cy.log(`${product.name} - ${product.price}₽`)
  })
})
```

## 🔄 Динамические данные

### Генерация данных с Faker

**Установка:**
```bash
npm install --save-dev @faker-js/faker
```

**Использование:**
```javascript
import { faker } from '@faker-js/faker/locale/ru'

describe('Регистрация с Faker', () => {
  it('Создает пользователя со случайными данными', () => {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number()
    }
    
    cy.visit('/register')
    cy.get('#firstName').type(user.firstName)
    cy.get('#lastName').type(user.lastName)
    cy.get('#email').type(user.email)
    cy.get('#password').type(user.password)
    cy.get('#phone').type(user.phone)
    cy.get('#submit').click()
    
    cy.contains(`Здравствуйте, ${user.firstName}!`)
  })
})
```

### Timestamp для уникальности

```javascript
describe('Уникальные данные', () => {
  it('Создает пользователя с уникальным email', () => {
    const timestamp = Date.now()
    const user = {
      email: `user${timestamp}@example.com`,
      username: `user${timestamp}`
    }
    
    cy.visit('/register')
    cy.get('#email').type(user.email)
    cy.get('#username').type(user.username)
    cy.get('#submit').click()
  })
})
```

## 🎯 Продвинутые техники

### Использование before() для загрузки данных

```javascript
describe('Тесты с предзагрузкой данных', () => {
  let testData
  
  before(() => {
    // Загружаем данные один раз для всех тестов
    cy.fixture('products').then((data) => {
      testData = data
    })
  })

  it('Первый тест', () => {
    cy.visit('/products')
    cy.contains(testData.products[0].name)
  })

  it('Второй тест', () => {
    cy.visit('/products')
    cy.contains(testData.products[1].name)
  })
})
```

### Alias для фикстур

```javascript
describe('Использование alias', () => {
  beforeEach(() => {
    cy.fixture('users').as('usersData')
    cy.fixture('products').as('productsData')
  })

  it('Использует данные через alias', function() {
    cy.visit('/shop')
    
    // Доступ через this
    const product = this.productsData[0]
    cy.contains(product.name).click()
  })
})
```

### Переопределение данных

```javascript
describe('Переопределение фикстур', () => {
  it('Изменяет данные для конкретного теста', () => {
    cy.fixture('user').then((user) => {
      // Изменяем email для этого теста
      user.email = 'special@example.com'
      
      cy.visit('/register')
      cy.get('#email').type(user.email)
      cy.get('#submit').click()
    })
  })
})
```

## 🏗️ Практические паттерны

### Паттерн: Фабрика данных

**Файл: cypress/support/factories.js**
```javascript
export const UserFactory = {
  admin: () => ({
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin'
  }),
  
  regular: (overrides = {}) => ({
    email: `user${Date.now()}@example.com`,
    password: 'User123!',
    role: 'user',
    ...overrides  // можно переопределить любое поле
  }),
  
  fromFixture: (name) => {
    return cy.fixture('users').then(users => users[name])
  }
}

export const ProductFactory = {
  create: (overrides = {}) => ({
    name: 'Тестовый продукт',
    price: 1000,
    inStock: true,
    category: 'Электроника',
    ...overrides
  })
}
```

**Использование:**
```javascript
import { UserFactory, ProductFactory } from '../support/factories'

describe('Фабрики данных', () => {
  it('Создает пользователя с кастомными данными', () => {
    const user = UserFactory.regular({
      email: 'custom@example.com'
    })
    
    cy.visit('/register')
    cy.get('#email').type(user.email)
    cy.get('#password').type(user.password)
    cy.get('#submit').click()
  })

  it('Создает продукт', () => {
    const product = ProductFactory.create({
      name: 'Специальный товар',
      price: 5000
    })
    
    cy.visit('/admin/products/new')
    cy.get('#name').type(product.name)
    cy.get('#price').type(product.price)
    cy.get('#submit').click()
  })
})
```

### Паттерн: Конфигурация окружений

**Файл: cypress/fixtures/config.json**
```json
{
  "development": {
    "apiUrl": "http://localhost:3000/api",
    "timeout": 10000
  },
  "staging": {
    "apiUrl": "https://staging.example.com/api",
    "timeout": 15000
  },
  "production": {
    "apiUrl": "https://api.example.com",
    "timeout": 20000
  }
}
```

**Использование:**
```javascript
describe('API тесты', () => {
  let config
  
  before(() => {
    cy.fixture('config').then((data) => {
      const env = Cypress.env('ENV') || 'development'
      config = data[env]
    })
  })

  it('Делает API запрос', () => {
    cy.request(`${config.apiUrl}/users`)
      .its('status')
      .should('eq', 200)
  })
})
```

### Паттерн: Комбинирование фикстур

```javascript
describe('Сложный сценарий', () => {
  it('Использует данные из нескольких фикстур', () => {
    // Параллельная загрузка
    cy.fixture('user').as('user')
    cy.fixture('products').as('products')
    cy.fixture('address').as('address')

    cy.visit('/checkout')

    cy.get('@user').then((user) => {
      cy.get('#email').type(user.email)
    })

    cy.get('@products').then((products) => {
      // Добавляем первый продукт
      cy.get(`[data-product="${products[0].id}"]`).click()
    })

    cy.get('@address').then((address) => {
      cy.get('#street').type(address.street)
      cy.get('#city').type(address.city)
      cy.get('#zip').type(address.zip)
    })

    cy.get('#submit-order').click()
  })
})
```

## 📊 Работа с большими наборами данных

### Data-Driven тестирование

```javascript
describe('Data-Driven тесты', () => {
  // Загружаем список пользователей
  before(() => {
    cy.fixture('users-list').as('usersList')
  })

  it('Проверяет логин для всех пользователей', function() {
    this.usersList.forEach((user) => {
      cy.visit('/login')
      cy.get('#email').type(user.email)
      cy.get('#password').type(user.password)
      cy.get('#login').click()
      
      if (user.shouldSucceed) {
        cy.url().should('include', '/dashboard')
        cy.contains(`Привет, ${user.name}`)
      } else {
        cy.contains('Неверные учетные данные')
      }
      
      cy.clearCookies()
    })
  })
})
```

### Использование каждого элемента массива

**Файл: cypress/fixtures/test-cases.json**
```json
{
  "loginTests": [
    {
      "description": "Валидный логин",
      "email": "valid@example.com",
      "password": "ValidPass123!",
      "expectedUrl": "/dashboard"
    },
    {
      "description": "Невалидный email",
      "email": "invalid",
      "password": "Pass123!",
      "expectedError": "Неверный формат email"
    },
    {
      "description": "Пустой пароль",
      "email": "test@example.com",
      "password": "",
      "expectedError": "Пароль обязателен"
    }
  ]
}
```

**Использование:**
```javascript
describe('Параметризованные тесты', () => {
  before(() => {
    cy.fixture('test-cases').as('testCases')
  })

  it('Выполняет все тест-кейсы', function() {
    this.testCases.loginTests.forEach((testCase) => {
      cy.log(`Тест: ${testCase.description}`)
      
      cy.visit('/login')
      cy.get('#email').type(testCase.email)
      
      if (testCase.password) {
        cy.get('#password').type(testCase.password)
      }
      
      cy.get('#login').click()
      
      if (testCase.expectedUrl) {
        cy.url().should('include', testCase.expectedUrl)
      }
      
      if (testCase.expectedError) {
        cy.contains(testCase.expectedError).should('be.visible')
      }
    })
  })
})
```

## 🎓 Лучшие практики

### ✅ DO (Делать)

```javascript
// Используйте описательные имена файлов
// ✅ users.json, products.json, test-scenarios.json

// Группируйте связанные данные
// ✅
{
  "admin": { ... },
  "regular": { ... }
}

// Используйте фабрики для динамических данных
// ✅
const user = UserFactory.create({ email: 'custom@test.com' })

// Держите фикстуры простыми
// ✅ Один файл = один тип данных
```

### ❌ DON'T (Не делать)

```javascript
// Не храните чувствительные данные в fixtures
// ❌
{
  "apiKey": "real-secret-key-123",
  "password": "real-password"
}

// Не создавайте слишком большие файлы
// ❌ users.json с 1000 записей

// Не дублируйте данные
// ❌ Одни и те же данные в разных файлах

// Не используйте жестко заданные ID
// ❌
{
  "userId": 12345  // может измениться в БД
}
```

## 💡 Советы

1. **Версионный контроль**: Включайте фикстуры в Git
2. **Документируйте**: Добавляйте комментарии в JSON или README
3. **Валидируйте**: Проверяйте структуру фикстур в тестах
4. **Обновляйте**: Регулярно синхронизируйте с реальными данными

## 📝 Задание для самопроверки

1. Создайте фикстуру `products.json` с 5 продуктами
2. Напишите тест, который:
   - Загружает фикстуру
   - Проходится по всем продуктам
   - Проверяет наличие обязательных полей
3. Создайте фабрику для генерации случайных пользователей
4. Используйте Faker для генерации тестовых данных

## 🔗 Полезные ссылки

- [Cypress Fixtures](https://docs.cypress.io/api/commands/fixture)
- [Faker.js](https://fakerjs.dev/)
- [Data-Driven Testing](https://docs.cypress.io/guides/references/best-practices#Creating-Tiny-Tests-With-A-Single-Assertion)

---

**Следующий урок:** [Урок 9: Переменные и алиасы](lesson-09-variables-aliases.md)
