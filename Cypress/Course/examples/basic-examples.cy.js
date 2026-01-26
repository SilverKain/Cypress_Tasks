// Пример 1: Базовый тест с навигацией
describe('Пример 1: Навигация', () => {
  it('Переходит между страницами', () => {
    cy.visit('https://example.cypress.io')
    
    // Проверяем главную страницу
    cy.contains('Kitchen Sink').should('be.visible')
    cy.url().should('eq', 'https://example.cypress.io/')
    
    // Переходим в раздел Commands
    cy.contains('Commands').click()
    cy.url().should('include', '/commands')
    
    // Возвращаемся назад
    cy.go('back')
    cy.url().should('eq', 'https://example.cypress.io/')
  })
})

// Пример 2: Работа с формами
describe('Пример 2: Формы', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/actions')
  })

  it('Заполняет текстовые поля', () => {
    // Email поле
    cy.get('.action-email')
      .type('test@example.com')
      .should('have.value', 'test@example.com')
    
    // Очищаем и вводим новое значение
    cy.get('.action-email')
      .clear()
      .type('new@example.com')
      .should('have.value', 'new@example.com')
  })

  it('Работает с чекбоксами и радиокнопками', () => {
    // Отмечаем чекбокс
    cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]')
      .check().should('be.checked')
    
    // Снимаем отметку
    cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]')
      .uncheck().should('not.be.checked')
    
    // Выбираем радиокнопку
    cy.get('.action-radios [type="radio"]').not('[disabled]')
      .check().should('be.checked')
  })

  it('Работает с select и multiple select', () => {
    // Обычный select
    cy.get('.action-select')
      .select('bananas')
      .should('have.value', 'bananas')
    
    // Multiple select
    cy.get('.action-select-multiple')
      .select(['apples', 'oranges', 'bananas'])
      .invoke('val').should('deep.equal', ['apples', 'oranges', 'bananas'])
  })
})

// Пример 3: Проверки и утверждения
describe('Пример 3: Assertions', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/assertions')
  })

  it('Демонстрирует различные типы проверок', () => {
    // Проверка текста
    cy.get('.assertion-table')
      .find('tbody tr').first()
      .should('contain', 'Tabitha')
      .and('contain', 'twhite@yahoo.com')
    
    // Проверка атрибутов
    cy.get('.assertion-table')
      .find('tbody tr').first()
      .find('td').first()
      .should('have.text', 'Tabitha')
    
    // Проверка класса
    cy.get('.assertion-table').should('have.class', 'table')
    
    // Проверка видимости
    cy.get('.assertion-table').should('be.visible')
    
    // Комплексная проверка
    cy.get('.assertion-table tbody tr')
      .should('have.length.greaterThan', 0)
      .and('be.visible')
  })

  it('Использует should с функциями', () => {
    cy.get('.assertion-table tbody tr')
      .should(($tr) => {
        expect($tr).to.have.length.greaterThan(0)
        expect($tr.first()).to.contain('Tabitha')
      })
  })
})

// Пример 4: Работа с API
describe('Пример 4: API тестирование', () => {
  it('Выполняет GET запрос', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('id', 1)
        expect(response.body).to.have.property('userId')
        expect(response.body.title).to.be.a('string')
      })
  })

  it('Выполняет POST запрос', () => {
    cy.request({
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: {
        title: 'Тестовый пост',
        body: 'Содержание тестового поста',
        userId: 1
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.title).to.eq('Тестовый пост')
      expect(response.body.id).to.exist
    })
  })
})

// Пример 5: Алиасы и переменные
describe('Пример 5: Алиасы', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/aliasing')
  })

  it('Использует алиасы для элементов', () => {
    // Создаем алиас для элемента
    cy.get('.as-table').as('table')
    
    // Используем алиас
    cy.get('@table')
      .find('tbody tr').first()
      .should('contain', 'Tabitha')
    
    cy.get('@table')
      .find('tbody tr')
      .should('have.length.greaterThan', 0)
  })

  it('Использует алиасы для запросов', () => {
    // Алиас для перехвата запроса
    cy.intercept('GET', '/users*').as('getUsers')
    
    // Триггерим запрос
    cy.get('.network-btn').click()
    
    // Ожидаем запрос
    cy.wait('@getUsers').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body).to.have.length.greaterThan(0)
    })
  })
})

// Пример 6: Пользовательские команды
describe('Пример 6: Custom Commands', () => {
  // Предполагается, что в cypress/support/commands.js добавлена команда:
  // Cypress.Commands.add('loginViaAPI', (username, password) => {
  //   cy.request({
  //     method: 'POST',
  //     url: '/api/login',
  //     body: { username, password }
  //   }).then((response) => {
  //     window.localStorage.setItem('authToken', response.body.token)
  //   })
  // })

  it('Использует пользовательскую команду для логина', () => {
    // Эта команда должна быть определена в commands.js
    // cy.loginViaAPI('testuser', 'password123')
    
    cy.visit('/')
    
    // Проверяем, что пользователь залогинен
    cy.window().its('localStorage')
      .invoke('getItem', 'authToken')
      .should('exist')
  })
})

// Пример 7: Работа с файлами
describe('Пример 7: Файлы и фикстуры', () => {
  beforeEach(() => {
    // Загружаем тестовые данные
    cy.fixture('test-data').as('testData')
  })

  it('Использует данные из фикстуры', () => {
    cy.get('@testData').then((data) => {
      cy.visit('/login')
      
      cy.get('#username').type(data.users.validUser.email)
      cy.get('#password').type(data.users.validUser.password)
      cy.get('#login-btn').click()
      
      cy.url().should('include', data.urls.dashboard)
    })
  })

  it('Работает с загрузкой файлов', () => {
    cy.visit('/file-upload')
    
    // Загрузка файла (требует cypress-file-upload плагин)
    // cy.get('[data-cy="file-upload"]')
    //   .attachFile('sample.pdf')
    
    // cy.get('.file-name').should('contain', 'sample.pdf')
  })
})

// Пример 8: Асинхронные операции
describe('Пример 8: Асинхронность', () => {
  it('Ожидает появления элемента', () => {
    cy.visit('/dynamic-loading')
    
    cy.get('#loading-btn').click()
    
    // Ожидаем появления результата (может занять время)
    cy.get('#result', { timeout: 10000 })
      .should('contain', 'Hello World!')
  })

  it('Ожидает исчезновения элемента', () => {
    cy.visit('/dynamic-loading')
    
    cy.get('#loading-btn').click()
    
    // Проверяем, что лоадер исчезнет
    cy.get('#loading').should('not.exist')
    cy.get('#result').should('be.visible')
  })
})