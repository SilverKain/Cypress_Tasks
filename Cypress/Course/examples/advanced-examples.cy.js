// Page Object Model пример
class LoginPage {
  // Селекторы
  get emailInput() { return cy.get('[data-testid="email"]') }
  get passwordInput() { return cy.get('[data-testid="password"]') }
  get loginButton() { return cy.get('[data-testid="login-btn"]') }
  get errorMessage() { return cy.get('[data-testid="error-message"]') }

  // Методы
  login(email, password) {
    this.emailInput.type(email)
    this.passwordInput.type(password)
    this.loginButton.click()
  }

  loginWithValidData() {
    return cy.fixture('users').then((users) => {
      this.login(users.valid.email, users.valid.password)
    })
  }

  expectErrorMessage(message) {
    this.errorMessage.should('contain', message)
  }
}

class DashboardPage {
  get welcomeMessage() { return cy.get('[data-testid="welcome"]') }
  get userMenu() { return cy.get('[data-testid="user-menu"]') }
  
  expectWelcomeMessage(username) {
    this.welcomeMessage.should('contain', `Добро пожаловать, ${username}`)
  }
}

// Использование Page Objects
describe('Аутентификация с Page Objects', () => {
  const loginPage = new LoginPage()
  const dashboardPage = new DashboardPage()

  beforeEach(() => {
    cy.visit('/login')
  })

  it('Успешный логин', () => {
    loginPage.loginWithValidData()
    dashboardPage.expectWelcomeMessage('Тестовый пользователь')
  })

  it('Неуспешный логин', () => {
    loginPage.login('wrong@email.com', 'wrongpassword')
    loginPage.expectErrorMessage('Неверные учетные данные')
  })
})

// Продвинутая работа с API
describe('Интеграция Frontend + API', () => {
  beforeEach(() => {
    // Перехватываем все API вызовы
    cy.intercept('POST', '/api/auth/login').as('loginAPI')
    cy.intercept('GET', '/api/user/profile').as('profileAPI')
    cy.intercept('GET', '/api/products*').as('productsAPI')
  })

  it('Проверяет полный флоу логина', () => {
    cy.visit('/login')
    
    // Логинимся через UI
    cy.get('#email').type('test@example.com')
    cy.get('#password').type('password123')
    cy.get('#login-btn').click()

    // Проверяем API запрос логина
    cy.wait('@loginAPI').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body).to.have.property('token')
      expect(interception.request.body).to.deep.equal({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    // Проверяем запрос профиля
    cy.wait('@profileAPI').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body.email).to.eq('test@example.com')
    })

    // Проверяем UI
    cy.url().should('include', '/dashboard')
    cy.get('[data-testid="user-name"]').should('contain', 'test@example.com')
  })

  it('Обрабатывает ошибки API', () => {
    // Мокаем ошибку сервера
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 500,
      body: { error: 'Внутренняя ошибка сервера' }
    }).as('loginError')

    cy.visit('/login')
    cy.get('#email').type('test@example.com')
    cy.get('#password').type('password123')
    cy.get('#login-btn').click()

    cy.wait('@loginError')
    
    // Проверяем, что UI отобразил ошибку
    cy.get('[data-testid="error-message"]')
      .should('contain', 'Произошла ошибка. Попробуйте позже')
  })
})

// Работа с файлами и скачиванием
describe('Работа с файлами', () => {
  it('Загружает файл', () => {
    cy.visit('/file-upload')
    
    // Создаем тестовый файл
    const fileName = 'test-upload.txt'
    const fileContent = 'Тестовое содержимое файла'
    
    cy.get('[data-testid="file-input"]').selectFile({
      contents: Cypress.Buffer.from(fileContent),
      fileName: fileName,
      mimeType: 'text/plain'
    })
    
    cy.get('[data-testid="upload-btn"]').click()
    
    // Проверяем результат
    cy.get('[data-testid="uploaded-file-name"]').should('contain', fileName)
    cy.get('[data-testid="success-message"]').should('be.visible')
  })

  it('Скачивает файл', () => {
    cy.visit('/downloads')
    
    // Очищаем папку downloads перед тестом
    cy.task('clearDownloads')
    
    cy.get('[data-testid="download-report"]').click()
    
    // Проверяем, что файл скачался
    cy.readFile('cypress/downloads/report.pdf').should('exist')
    
    // Или проверяем содержимое CSV
    cy.readFile('cypress/downloads/data.csv')
      .should('contain', 'Название,Количество,Цена')
  })
})

// Работа с localStorage и cookies
describe('Состояние приложения', () => {
  it('Сохраняет настройки в localStorage', () => {
    cy.visit('/settings')
    
    // Меняем настройки
    cy.get('#theme-dark').check()
    cy.get('#language-ru').select()
    cy.get('#save-settings').click()
    
    // Проверяем localStorage
    cy.window().its('localStorage')
      .invoke('getItem', 'theme')
      .should('equal', 'dark')
    
    cy.window().its('localStorage')
      .invoke('getItem', 'language')
      .should('equal', 'ru')
    
    // Обновляем страницу и проверяем, что настройки сохранились
    cy.reload()
    cy.get('#theme-dark').should('be.checked')
    cy.get('#language-ru').should('have.value', 'ru')
  })

  it('Работает с cookies', () => {
    cy.visit('/')
    
    // Устанавливаем cookie
    cy.setCookie('consent', 'accepted')
    cy.setCookie('session-id', '12345')
    
    // Проверяем cookie
    cy.getCookie('consent').should('have.property', 'value', 'accepted')
    
    // Проверяем все cookies
    cy.getCookies().should('have.length', 2)
    
    // Очищаем конкретный cookie
    cy.clearCookie('session-id')
    cy.getCookie('session-id').should('be.null')
  })
})

// Работа с iframe
describe('Iframe и внешний контент', () => {
  it('Взаимодействует с iframe', () => {
    cy.visit('/iframe-page')
    
    // Получаем доступ к iframe
    cy.get('#payment-iframe')
      .its('0.contentDocument')
      .its('body')
      .should('not.be.empty')
      .then(cy.wrap)
      .within(() => {
        // Работаем внутри iframe
        cy.get('#card-number').type('4111111111111111')
        cy.get('#expiry').type('12/25')
        cy.get('#cvc').type('123')
        cy.get('#submit-payment').click()
      })
    
    // Проверяем результат на основной странице
    cy.get('[data-testid="payment-success"]')
      .should('contain', 'Платеж успешно обработан')
  })
})

// Работа с drag and drop
describe('Drag and Drop', () => {
  it('Перетаскивает элементы', () => {
    cy.visit('/kanban-board')
    
    // Перетаскиваем задачу из колонки "TODO" в "In Progress"
    cy.get('[data-testid="task-1"]')
      .trigger('dragstart')
    
    cy.get('[data-testid="column-in-progress"]')
      .trigger('drop')
    
    // Проверяем, что задача переместилась
    cy.get('[data-testid="column-in-progress"]')
      .should('contain', 'Задача 1')
    
    cy.get('[data-testid="column-todo"]')
      .should('not.contain', 'Задача 1')
  })
})

// Производительность и accessibility
describe('Производительность и доступность', () => {
  it('Проверяет время загрузки страницы', () => {
    const startTime = Date.now()
    
    cy.visit('/').then(() => {
      const loadTime = Date.now() - startTime
      expect(loadTime).to.be.lessThan(3000) // меньше 3 секунд
    })
  })

  it('Проверяет основы accessibility', () => {
    cy.visit('/')
    
    // Проверяем наличие alt у изображений
    cy.get('img').each(($img) => {
      expect($img).to.have.attr('alt')
    })
    
    // Проверяем наличие labels у inputs
    cy.get('input[type="text"], input[type="email"]').each(($input) => {
      const id = $input.attr('id')
      if (id) {
        cy.get(`label[for="${id}"]`).should('exist')
      }
    })
    
    // Проверяем контрастность (базовая проверка цветов)
    cy.get('.primary-button').should('have.css', 'background-color')
      .and('not.equal', 'rgb(255, 255, 255)') // не белый на белом
  })
})

// Кроссбраузерные тесты
describe('Кроссбраузерная совместимость', () => {
  const browsers = ['chrome', 'firefox', 'edge']
  
  browsers.forEach((browser) => {
    it(`Работает в ${browser}`, () => {
      cy.visit('/')
      
      // Основная функциональность
      cy.get('[data-testid="main-menu"]').should('be.visible')
      cy.get('[data-testid="search-input"]').type('тест')
      cy.get('[data-testid="search-button"]').click()
      
      // Проверяем результаты
      cy.get('[data-testid="search-results"]').should('be.visible')
    })
  })
})

// Тестирование на разных разрешениях
describe('Responsive design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ]

  viewports.forEach((viewport) => {
    it(`Отображается корректно на ${viewport.name}`, () => {
      cy.viewport(viewport.width, viewport.height)
      cy.visit('/')
      
      // Мобильная версия
      if (viewport.name === 'mobile') {
        cy.get('[data-testid="mobile-menu"]').should('be.visible')
        cy.get('[data-testid="desktop-menu"]').should('not.be.visible')
      }
      
      // Десктопная версия  
      if (viewport.name === 'desktop') {
        cy.get('[data-testid="desktop-menu"]').should('be.visible')
        cy.get('[data-testid="mobile-menu"]').should('not.be.visible')
      }
      
      // Общие элементы должны быть видимы на всех разрешениях
      cy.get('[data-testid="logo"]').should('be.visible')
      cy.get('[data-testid="main-content"]').should('be.visible')
    })
  })
})