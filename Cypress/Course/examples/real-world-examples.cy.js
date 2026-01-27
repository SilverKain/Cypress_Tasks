// 🌟 Реальные примеры тестов для практических сценариев

/*
  Этот файл содержит примеры тестов для типичных ситуаций,
  с которыми вы столкнетесь в реальных проектах
*/

// =====================================================
// 🔐 СЦЕНАРИЙ 1: Полный флоу авторизации
// =====================================================

describe('Авторизация: Полный флоу', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Успешная авторизация и переход в личный кабинет', () => {
    // Данные пользователя
    const user = {
      email: 'user@example.com',
      password: 'SecurePass123!'
    }

    // Заполняем форму
    cy.get('#email').type(user.email)
    cy.get('#password').type(user.password)
    cy.get('#remember-me').check()
    cy.get('button[type="submit"]').click()

    // Проверяем успешный вход
    cy.url().should('include', '/dashboard')
    cy.contains(`Добро пожаловать`).should('be.visible')
    
    // Проверяем что пользователь авторизован
    cy.get('[data-cy="user-menu"]').click()
    cy.contains(user.email).should('be.visible')
  })

  it('Валидация формы при некорректных данных', () => {
    const testCases = [
      {
        name: 'Пустой email',
        email: '',
        password: 'Pass123!',
        error: 'Email обязателен'
      },
      {
        name: 'Невалидный email',
        email: 'invalid-email',
        password: 'Pass123!',
        error: 'Введите корректный email'
      },
      {
        name: 'Короткий пароль',
        email: 'test@test.com',
        password: '123',
        error: 'Пароль должен быть не менее 8 символов'
      },
      {
        name: 'Неверные учетные данные',
        email: 'wrong@test.com',
        password: 'WrongPass123!',
        error: 'Неверный email или пароль'
      }
    ]

    testCases.forEach((testCase) => {
      cy.log(`Тест: ${testCase.name}`)
      
      cy.get('#email').clear().type(testCase.email)
      cy.get('#password').clear().type(testCase.password)
      cy.get('button[type="submit"]').click()
      
      cy.contains(testCase.error).should('be.visible')
      
      cy.reload()  // Перезагружаем для следующей итерации
    })
  })
})

// =====================================================
// 🛒 СЦЕНАРИЙ 2: Интернет-магазин - полный цикл покупки
// =====================================================

describe('Интернет-магазин: Покупка товара', () => {
  before(() => {
    // Авторизуемся один раз для всех тестов
    cy.session('user-session', () => {
      cy.visit('/login')
      cy.get('#email').type('user@shop.com')
      cy.get('#password').type('Pass123!')
      cy.get('button[type="submit"]').click()
      cy.url().should('include', '/shop')
    })
  })

  beforeEach(() => {
    cy.visit('/shop')
    // Очищаем корзину перед каждым тестом
    cy.clearLocalStorage('cart')
  })

  it('Полный флоу: От выбора товара до оформления заказа', () => {
    // Шаг 1: Поиск товара
    cy.get('#search').type('Ноутбук{enter}')
    cy.get('.product-card').should('have.length.greaterThan', 0)

    // Шаг 2: Фильтрация
    cy.get('[data-filter="price"]').select('high-to-low')
    cy.wait(1000)  // Ждем применения фильтра

    // Шаг 3: Выбор товара
    cy.get('.product-card').first().within(() => {
      // Сохраняем данные о товаре
      cy.get('.product-name').invoke('text').as('productName')
      cy.get('.product-price').invoke('text').as('productPrice')
      cy.get('button[data-action="add-to-cart"]').click()
    })

    // Шаг 4: Проверка добавления в корзину
    cy.get('.notification')
      .should('be.visible')
      .and('contain', 'Товар добавлен в корзину')
    
    cy.get('[data-cy="cart-count"]').should('have.text', '1')

    // Шаг 5: Переход в корзину
    cy.get('[data-cy="cart-icon"]').click()
    cy.url().should('include', '/cart')

    // Проверяем что товар в корзине
    cy.get('@productName').then((name) => {
      cy.contains(name).should('be.visible')
    })

    // Шаг 6: Оформление заказа
    cy.get('button').contains('Оформить заказ').click()
    
    // Заполняем данные доставки
    cy.get('#address').type('ул. Ленина, д. 10, кв. 5')
    cy.get('#city').type('Москва')
    cy.get('#zip').type('101000')
    cy.get('#phone').type('+7 999 123-45-67')

    // Выбираем способ оплаты
    cy.get('[data-payment="card"]').check()

    // Подтверждаем заказ
    cy.get('button').contains('Подтвердить заказ').click()

    // Проверяем успешное оформление
    cy.url().should('include', '/order-success')
    cy.contains('Заказ успешно оформлен').should('be.visible')
    cy.get('.order-number').should('exist')
  })

  it('Изменение количества товара в корзине', () => {
    // Добавляем товар
    cy.get('.product-card').first().find('button[data-action="add-to-cart"]').click()
    
    // Идем в корзину
    cy.get('[data-cy="cart-icon"]').click()

    // Сохраняем начальную цену
    cy.get('.cart-item').first().within(() => {
      cy.get('.item-price').invoke('text').then((price) => {
        const initialPrice = parseFloat(price.replace(/\D/g, ''))
        cy.wrap(initialPrice).as('initialPrice')

        // Увеличиваем количество
        cy.get('.quantity-increase').click().click()  // +2
      })
    })

    // Проверяем что общая цена увеличилась в 3 раза
    cy.get('@initialPrice').then((initialPrice) => {
      cy.get('.total-price').invoke('text').then((totalText) => {
        const totalPrice = parseFloat(totalText.replace(/\D/g, ''))
        expect(totalPrice).to.equal(initialPrice * 3)
      })
    })
  })
})

// =====================================================
// 📝 СЦЕНАРИЙ 3: Работа с формами и валидацией
// =====================================================

describe('Регистрация: Сложная форма с валидацией', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('Успешная регистрация с полными данными', () => {
    const user = {
      firstName: 'Иван',
      lastName: 'Петров',
      email: `ivan.petrov.${Date.now()}@example.com`,  // уникальный email
      password: 'SecurePass123!',
      phone: '+7 999 123-45-67',
      birthDate: '1990-01-15',
      country: 'Россия',
      city: 'Москва',
      agree: true
    }

    // Заполняем все поля
    cy.get('#firstName').type(user.firstName)
    cy.get('#lastName').type(user.lastName)
    cy.get('#email').type(user.email)
    cy.get('#password').type(user.password)
    cy.get('#confirmPassword').type(user.password)
    cy.get('#phone').type(user.phone)
    cy.get('#birthDate').type(user.birthDate)
    cy.get('#country').select(user.country)
    cy.get('#city').type(user.city)
    
    if (user.agree) {
      cy.get('#agreeTerms').check()
    }

    // Отправляем форму
    cy.get('button[type="submit"]').click()

    // Проверяем успех
    cy.url().should('include', '/welcome')
    cy.contains(`Добро пожаловать, ${user.firstName}!`).should('be.visible')
  })

  it('Проверка валидации пароля в реальном времени', () => {
    const passwordTests = [
      { value: '123', valid: false, message: 'Минимум 8 символов' },
      { value: 'password', valid: false, message: 'Должна быть заглавная буква' },
      { value: 'Password', valid: false, message: 'Должна быть цифра' },
      { value: 'Password1', valid: false, message: 'Должен быть спецсимвол' },
      { value: 'Password1!', valid: true, message: 'Надежный пароль' }
    ]

    passwordTests.forEach((test) => {
      cy.get('#password').clear().type(test.value)
      
      if (test.valid) {
        cy.get('.password-strength')
          .should('have.class', 'strong')
          .and('contain', test.message)
      } else {
        cy.get('.password-validation')
          .should('be.visible')
          .and('contain', test.message)
      }
    })
  })
})

// =====================================================
// 🌐 СЦЕНАРИЙ 4: API + UI интеграция
// =====================================================

describe('Управление задачами (TODO): API + UI', () => {
  beforeEach(() => {
    // Мокируем начальное состояние
    cy.intercept('GET', '/api/todos', {
      statusCode: 200,
      body: []
    }).as('getTodos')

    cy.visit('/todos')
    cy.wait('@getTodos')
  })

  it('Создание, редактирование и удаление задачи', () => {
    const taskTitle = `Тестовая задача ${Date.now()}`
    const updatedTitle = `${taskTitle} (обновлено)`

    // Мокируем создание
    cy.intercept('POST', '/api/todos', {
      statusCode: 201,
      body: {
        id: 1,
        title: taskTitle,
        completed: false,
        createdAt: new Date().toISOString()
      }
    }).as('createTodo')

    // Создаем задачу через UI
    cy.get('#new-todo').type(`${taskTitle}{enter}`)
    
    // Ждем API запрос
    cy.wait('@createTodo').then((interception) => {
      expect(interception.request.body.title).to.eq(taskTitle)
    })

    // Проверяем что задача появилась
    cy.contains(taskTitle).should('be.visible')

    // Мокируем обновление
    cy.intercept('PUT', '/api/todos/1', {
      statusCode: 200,
      body: {
        id: 1,
        title: updatedTitle,
        completed: false
      }
    }).as('updateTodo')

    // Редактируем задачу
    cy.contains(taskTitle).dblclick()
    cy.get('.editing input').clear().type(`${updatedTitle}{enter}`)
    
    cy.wait('@updateTodo')
    cy.contains(updatedTitle).should('be.visible')

    // Мокируем удаление
    cy.intercept('DELETE', '/api/todos/1', {
      statusCode: 204
    }).as('deleteTodo')

    // Удаляем задачу
    cy.contains(updatedTitle)
      .parent()
      .find('.delete-btn')
      .click({ force: true })
    
    cy.wait('@deleteTodo')
    cy.contains(updatedTitle).should('not.exist')
  })

  it('Массовые операции с задачами', () => {
    const todos = [
      { id: 1, title: 'Задача 1', completed: false },
      { id: 2, title: 'Задача 2', completed: false },
      { id: 3, title: 'Задача 3', completed: true }
    ]

    // Мокируем список задач
    cy.intercept('GET', '/api/todos', {
      statusCode: 200,
      body: todos
    })

    cy.reload()

    // Проверяем количество
    cy.get('.todo-item').should('have.length', 3)

    // Отмечаем все как выполненные
    cy.get('#toggle-all').check()

    cy.get('.todo-item').each(($item) => {
      cy.wrap($item).should('have.class', 'completed')
    })

    // Фильтруем только активные
    cy.contains('Active').click()
    cy.get('.todo-item').should('not.exist')

    // Фильтруем только завершенные
    cy.contains('Completed').click()
    cy.get('.todo-item').should('have.length', 3)

    // Очищаем завершенные
    cy.contains('Clear completed').click()
    cy.get('.todo-item').should('not.exist')
  })
})

// =====================================================
// 📱 СЦЕНАРИЙ 5: Адаптивность (Мобильная версия)
// =====================================================

describe('Адаптивный дизайн', () => {
  const viewports = [
    { device: 'iphone-6', width: 375, height: 667 },
    { device: 'ipad-2', width: 768, height: 1024 },
    { device: 'macbook-15', width: 1440, height: 900 }
  ]

  viewports.forEach((viewport) => {
    describe(`Тестирование на ${viewport.device}`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height)
        cy.visit('/')
      })

      it('Навигация работает корректно', () => {
        if (viewport.width < 768) {
          // Мобильное меню
          cy.get('.hamburger-menu').click()
          cy.get('.mobile-nav').should('be.visible')
          cy.get('.mobile-nav').find('a').contains('Каталог').click()
        } else {
          // Десктопное меню
          cy.get('.desktop-nav').find('a').contains('Каталог').click()
        }

        cy.url().should('include', '/catalog')
      })

      it('Карточки товаров отображаются правильно', () => {
        cy.visit('/catalog')
        
        cy.get('.product-grid').should('be.visible')
        
        // Проверяем количество колонок в зависимости от размера
        cy.get('.product-card').first().then(($card) => {
          const cardWidth = $card.width()
          const gridWidth = $card.parent().width()
          const columns = Math.floor(gridWidth / cardWidth)

          if (viewport.width < 768) {
            expect(columns).to.be.lessThan(3)  // 1-2 колонки
          } else if (viewport.width < 1200) {
            expect(columns).to.be.lessThan(4)  // 2-3 колонки
          } else {
            expect(columns).to.be.greaterThan(2)  // 3+ колонок
          }
        })
      })
    })
  })
})

// =====================================================
// ⚡ СЦЕНАРИЙ 6: Производительность
// =====================================================

describe('Производительность приложения', () => {
  it('Страница загружается менее чем за 3 секунды', () => {
    const startTime = Date.now()
    
    cy.visit('/')
    
    cy.get('[data-cy="main-content"]').should('be.visible')
    
    cy.then(() => {
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      cy.log(`Время загрузки: ${loadTime}ms`)
      expect(loadTime).to.be.lessThan(3000)
    })
  })

  it('API отвечает быстро', () => {
    cy.intercept('GET', '/api/products').as('getProducts')
    
    const startTime = Date.now()
    
    cy.visit('/catalog')
    cy.wait('@getProducts').then((interception) => {
      const responseTime = interception.response.headers['x-response-time'] || 
                           (Date.now() - startTime)
      
      cy.log(`API Response Time: ${responseTime}ms`)
      // API должен отвечать менее чем за 1 секунду
      expect(parseInt(responseTime)).to.be.lessThan(1000)
    })
  })
})

// =====================================================
// 🎯 ПОЛЕЗНЫЕ УТИЛИТЫ
// =====================================================

// Можно вынести в support/utils.js
const utils = {
  // Генерация случайного пользователя
  generateRandomUser: () => ({
    firstName: `User${Math.floor(Math.random() * 10000)}`,
    email: `user${Date.now()}@test.com`,
    password: 'TestPass123!',
    phone: `+7 999 ${Math.floor(Math.random() * 1000000)}`
  }),

  // Ожидание исчезновения лоадера
  waitForLoader: () => {
    cy.get('.loading-spinner', { timeout: 10000 }).should('not.exist')
  },

  // Очистка всех данных
  clearAllData: () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })
  }
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = utils
}
