# Практическое задание 5: API тестирование

## 🎯 Цель
Освоить тестирование API с помощью Cypress, научиться работать с HTTP запросами, мокировать данные и валидировать ответы.

## 📋 Что нужно сделать

### Часть 1: Базовое API тестирование

#### 1. GET запросы

Создайте файл `cypress/e2e/api/users-api.cy.js`:

```javascript
describe('API: Пользователи', () => {
  const apiUrl = 'https://jsonplaceholder.typicode.com'
  
  it('Получает список пользователей', () => {
    cy.request(`${apiUrl}/users`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.length(10)
      expect(response.body[0]).to.have.property('id')
      expect(response.body[0]).to.have.property('name')
      expect(response.body[0]).to.have.property('email')
    })
  })

  it('Получает конкретного пользователя', () => {
    cy.request(`${apiUrl}/users/1`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.id).to.eq(1)
      expect(response.body.name).to.be.a('string')
      expect(response.body.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    })
  })

  it('Возвращает 404 для несуществующего пользователя', () => {
    cy.request({
      url: `${apiUrl}/users/999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })
})
```

#### 2. POST запросы

```javascript
describe('API: Создание данных', () => {
  const apiUrl = 'https://jsonplaceholder.typicode.com'
  
  it('Создает нового пользователя', () => {
    const newUser = {
      name: 'Иван Петров',
      username: 'ivan',
      email: 'ivan@example.com'
    }
    
    cy.request('POST', `${apiUrl}/users`, newUser).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('id')
      expect(response.body.name).to.eq(newUser.name)
      expect(response.body.email).to.eq(newUser.email)
    })
  })

  it('Создает новый пост', () => {
    cy.request('POST', `${apiUrl}/posts`, {
      title: 'Тестовый пост',
      body: 'Содержание поста',
      userId: 1
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.id).to.exist
    })
  })
})
```

### Часть 2: Интеграция UI и API

Создайте файл `cypress/e2e/api/integration.cy.js`:

```javascript
describe('Интеграция UI и API', () => {
  it('Мокирует API и проверяет UI', () => {
    // Мокируем API ответ
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Тестовый Пользователь 1', email: 'test1@test.com' },
        { id: 2, name: 'Тестовый Пользователь 2', email: 'test2@test.com' }
      ]
    }).as('getUsers')
    
    cy.visit('/users')
    cy.wait('@getUsers')
    
    // Проверяем что UI отображает моковые данные
    cy.contains('Тестовый Пользователь 1').should('be.visible')
    cy.contains('Тестовый Пользователь 2').should('be.visible')
  })

  it('Тестирует создание с реальным API', () => {
    cy.visit('/users/new')
    
    // Перехватываем запрос
    cy.intercept('POST', '/api/users').as('createUser')
    
    // Заполняем форму
    cy.get('#name').type('Новый Пользователь')
    cy.get('#email').type('new@example.com')
    cy.get('#submit').click()
    
    // Проверяем запрос
    cy.wait('@createUser').then((interception) => {
      expect(interception.request.body.name).to.eq('Новый Пользователь')
      expect(interception.response.statusCode).to.eq(201)
    })
  })
})
```

### Часть 3: Работа с заголовками и авторизацией

```javascript
describe('API: Авторизация', () => {
  it('Отправляет токен авторизации', () => {
    cy.request({
      method: 'GET',
      url: '/api/profile',
      headers: {
        'Authorization': 'Bearer fake-token-123'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('Проверяет CORS заголовки', () => {
    cy.request('/api/data').then((response) => {
      expect(response.headers).to.have.property('access-control-allow-origin')
    })
  })
})
```

### Часть 4: Data-Driven тестирование

```javascript
describe('API: Параметризованные тесты', () => {
  const testCases = [
    { userId: 1, expectedPosts: 10 },
    { userId: 2, expectedPosts: 10 },
    { userId: 3, expectedPosts: 10 }
  ]
  
  testCases.forEach((testCase) => {
    it(`Проверяет посты пользователя ${testCase.userId}`, () => {
      cy.request(`https://jsonplaceholder.typicode.com/users/${testCase.userId}/posts`)
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.length(testCase.expectedPosts)
        })
    })
  })
})
```

## ✅ Критерии выполнения

1. **Базовые тесты (обязательно):**
   - [ ] Тест GET запроса списка
   - [ ] Тест GET запроса одного элемента
   - [ ] Тест POST запроса
   - [ ] Проверка статус кодов
   - [ ] Валидация структуры ответа

2. **Продвинутые тесты:**
   - [ ] Мокирование API через intercept
   - [ ] Проверка заголовков
   - [ ] PUT/DELETE запросы
   - [ ] Проверка времени ответа
   - [ ] Data-driven тесты

3. **Интеграция:**
   - [ ] Тест взаимодействия UI и API
   - [ ] Проверка отправляемых данных
   - [ ] Валидация ошибок API

## 🎓 Дополнительные задания

### Задание 1: REST API CRUD

Реализуйте полный CRUD для ресурса:

```javascript
describe('CRUD: Посты', () => {
  let createdPostId
  
  it('CREATE: Создает пост', () => {
    // ваш код
  })
  
  it('READ: Читает созданный пост', () => {
    // ваш код
  })
  
  it('UPDATE: Обновляет пост', () => {
    // ваш код
  })
  
  it('DELETE: Удаляет пост', () => {
    // ваш код
  })
})
```

### Задание 2: Производительность

Проверьте производительность API:

```javascript
it('API отвечает быстро', () => {
  const startTime = Date.now()
  
  cy.request('/api/data').then((response) => {
    const endTime = Date.now()
    const duration = endTime - startTime
    
    expect(duration).to.be.lessThan(1000) // менее 1 секунды
    expect(response.status).to.eq(200)
  })
})
```

### Задание 3: Цепочка запросов

```javascript
it('Выполняет цепочку зависимых запросов', () => {
  // 1. Создаем пользователя
  cy.request('POST', '/api/users', {...})
    .then((userResponse) => {
      const userId = userResponse.body.id
      
      // 2. Создаем пост от этого пользователя
      return cy.request('POST', '/api/posts', {
        userId: userId,
        title: 'Пост'
      })
    })
    .then((postResponse) => {
      const postId = postResponse.body.id
      
      // 3. Получаем созданный пост
      return cy.request(`/api/posts/${postId}`)
    })
    .then((getResponse) => {
      expect(getResponse.status).to.eq(200)
    })
})
```

## 📚 Полезные ссылки

- [Cypress cy.request()](https://docs.cypress.io/api/commands/request)
- [Cypress cy.intercept()](https://docs.cypress.io/api/commands/intercept)
- [JSONPlaceholder - Fake API](https://jsonplaceholder.typicode.com/)

## 💡 Подсказки

1. Используйте `cy.request()` для прямых API вызовов
2. Используйте `cy.intercept()` для контроля запросов из UI
3. Проверяйте не только статус, но и структуру данных
4. Для тестирования авторизации используйте команды для установки токенов
5. Создайте custom commands для частых API операций

---

**Следующее задание:** [Задание 6: Итоговый проект](exercise-06-final-project.md)
