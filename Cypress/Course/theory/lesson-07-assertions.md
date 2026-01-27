# Урок 7: Assertions (Утверждения и проверки)

## 🎯 Цели урока
- Изучить все типы проверок в Cypress
- Научиться писать надежные assertions
- Понять разницу между implicit и explicit assertions
- Освоить лучшие практики проверок

## 📖 Что такое Assertions?

**Assertions** (утверждения) - это проверки, которые определяют, прошел ли тест или провалился. Они отвечают на вопрос: "Работает ли приложение так, как ожидается?"

```javascript
// Пример: проверяем что кнопка содержит текст "Войти"
cy.get('#login-btn').should('contain', 'Войти')
//                    ^^^^^^ это assertion
```

## 🔍 Типы Assertions в Cypress

### 1. Implicit Assertions (Неявные проверки)

Встроены в команды Cypress и выполняются автоматически:

```javascript
// .should() и .and()
cy.get('#email')
  .should('be.visible')           // видим
  .and('have.attr', 'type', 'email') // имеет атрибут
  .and('not.be.disabled')         // не заблокирован
```

**Цепочка проверок:**
```javascript
cy.get('.product-card')
  .should('exist')              // существует
  .and('be.visible')            // видим
  .and('contain', 'Товар')      // содержит текст
  .and('have.class', 'active')  // имеет класс
```

### 2. Explicit Assertions (Явные проверки)

Используют библиотеку Chai для более сложных проверок:

```javascript
// expect
cy.get('.price').then(($price) => {
  const price = parseFloat($price.text())
  expect(price).to.be.greaterThan(0)
  expect(price).to.be.lessThan(10000)
})

// assert
cy.get('.cart-items').then(($items) => {
  assert.isAbove($items.length, 0, 'Корзина не пустая')
})
```

## 📚 Распространенные Assertions

### Проверки состояния элемента

```javascript
// Видимость
cy.get('#modal').should('be.visible')
cy.get('#modal').should('not.be.visible')
cy.get('#modal').should('be.hidden')

// Существование
cy.get('.item').should('exist')
cy.get('.item').should('not.exist')

// Доступность
cy.get('#submit').should('be.enabled')
cy.get('#submit').should('be.disabled')

// Фокус
cy.get('#email').should('be.focused')
cy.get('#email').should('not.be.focused')

// Выбор (чекбоксы, радиокнопки)
cy.get('#agree').should('be.checked')
cy.get('#agree').should('not.be.checked')

// Пустота
cy.get('#input').should('be.empty')
cy.get('#input').should('not.be.empty')
```

### Проверки содержимого

```javascript
// Текст
cy.get('h1').should('contain', 'Заголовок')
cy.get('h1').should('have.text', 'Точный заголовок')
cy.get('p').should('include.text', 'часть текста')

// HTML
cy.get('.content').should('have.html', '<strong>Жирный</strong>')
cy.get('.content').should('contain.html', '<strong>')

// Значение (для input)
cy.get('#email').should('have.value', 'test@test.com')
cy.get('#price').should('have.value', '100')
```

### Проверки атрибутов и свойств

```javascript
// Атрибуты
cy.get('a').should('have.attr', 'href', '/about')
cy.get('img').should('have.attr', 'src')
cy.get('button').should('have.attr', 'disabled')

// Классы
cy.get('.btn').should('have.class', 'active')
cy.get('.btn').should('not.have.class', 'disabled')

// CSS свойства
cy.get('.header').should('have.css', 'background-color', 'rgb(0, 0, 0)')
cy.get('.text').should('have.css', 'font-size', '16px')

// Данные атрибуты
cy.get('.card').should('have.data', 'status', 'active')
```

### Проверки длины и количества

```javascript
// Длина текста
cy.get('.description').should('have.length.greaterThan', 10)

// Количество элементов
cy.get('.list-item').should('have.length', 5)
cy.get('.list-item').should('have.length.at.least', 1)
cy.get('.list-item').should('have.length.at.most', 10)

// Диапазон
cy.get('.items').should('have.length.within', 5, 10)
```

## 🔄 Автоматические retry (повторы)

Cypress автоматически повторяет assertions до успеха или таймаута:

```javascript
// Cypress будет проверять элемент до 4 секунд (по умолчанию)
cy.get('.loading').should('not.exist')  // ждет исчезновения
cy.get('.result').should('be.visible')   // ждет появления

// Настройка таймаута
cy.get('.slow-element', { timeout: 10000 })
  .should('be.visible')
```

## 🎯 Продвинутые техники

### Множественные проверки с then()

```javascript
cy.get('.user-profile').then(($profile) => {
  // Получаем элемент только один раз
  expect($profile).to.be.visible
  expect($profile.find('.name')).to.contain('Иван')
  expect($profile.find('.email')).to.contain('@')
  
  const age = parseInt($profile.find('.age').text())
  expect(age).to.be.greaterThan(18)
})
```

### Пользовательские сообщения об ошибках

```javascript
// С использованием assert
cy.get('.price').then(($price) => {
  const price = parseFloat($price.text())
  assert.isAbove(
    price, 
    0, 
    'Цена должна быть больше нуля'  // кастомное сообщение
  )
})

// С использованием expect в should
cy.get('.items').should(($items) => {
  expect($items.length, 'Количество товаров').to.be.greaterThan(0)
})
```

### Negative assertions (Проверки отсутствия)

```javascript
// Правильно: ждем пока элемент исчезнет
cy.get('.loading').should('not.exist')

// Правильно: проверяем что ошибки нет
cy.get('.error-message').should('not.be.visible')

// ❌ Неправильно: мгновенная проверка без ожидания
cy.get('.error').then(($el) => {
  expect($el).to.not.exist  // не ждет!
})
```

### Проверка URL

```javascript
// Полный URL
cy.url().should('eq', 'https://example.com/page')

// Часть URL
cy.url().should('include', '/dashboard')
cy.url().should('contain', 'user=123')

// С регулярным выражением
cy.url().should('match', /\/posts\/\d+/)

// Проверка pathname
cy.location('pathname').should('eq', '/about')
cy.location('search').should('include', 'sort=name')
```

## 🏗️ Практические паттерны

### Паттерн: Проверка формы

```javascript
describe('Форма регистрации', () => {
  it('Валидирует все поля корректно', () => {
    cy.visit('/register')
    
    // Проверяем начальное состояние
    cy.get('#username').should('be.empty')
    cy.get('#email').should('be.empty')
    cy.get('#submit').should('be.disabled')
    
    // Заполняем форму
    cy.get('#username').type('testuser')
    cy.get('#email').type('test@example.com')
    cy.get('#password').type('SecurePass123!')
    
    // Проверяем что поля заполнены
    cy.get('#username').should('have.value', 'testuser')
    cy.get('#email').should('have.value', 'test@example.com')
    
    // Проверяем что кнопка активна
    cy.get('#submit').should('be.enabled')
    
    // Отправляем форму
    cy.get('#submit').click()
    
    // Проверяем успешный результат
    cy.get('.success-message')
      .should('be.visible')
      .and('contain', 'Регистрация успешна')
    
    cy.url().should('include', '/welcome')
  })
})
```

### Паттерн: Проверка списка

```javascript
describe('Список продуктов', () => {
  it('Отображает все продукты с корректными данными', () => {
    cy.visit('/products')
    
    // Проверяем что список загрузился
    cy.get('.product-card')
      .should('exist')
      .and('have.length.greaterThan', 0)
    
    // Проверяем каждый элемент списка
    cy.get('.product-card').each(($card) => {
      // Название есть и не пустое
      cy.wrap($card)
        .find('.product-name')
        .should('exist')
        .and('not.be.empty')
      
      // Цена положительная
      cy.wrap($card)
        .find('.product-price')
        .invoke('text')
        .then((price) => {
          const numPrice = parseFloat(price.replace(/[^\d.]/g, ''))
          expect(numPrice).to.be.greaterThan(0)
        })
      
      // Изображение загружено
      cy.wrap($card)
        .find('img')
        .should('have.attr', 'src')
        .and('not.be.empty')
    })
  })
})
```

### Паттерн: API response проверки

```javascript
describe('API тестирование', () => {
  it('Получает данные пользователя', () => {
    cy.request('/api/user/123').then((response) => {
      // Статус код
      expect(response.status).to.eq(200)
      
      // Заголовки
      expect(response.headers).to.have.property('content-type', 'application/json')
      
      // Тело ответа
      expect(response.body).to.have.property('id', 123)
      expect(response.body).to.have.property('name')
      expect(response.body.name).to.be.a('string')
      expect(response.body.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      
      // Вложенные объекты
      expect(response.body.profile).to.deep.include({
        status: 'active',
        verified: true
      })
    })
  })
})
```

## 🎓 Лучшие практики

### ✅ DO (Делать)

```javascript
// Используйте специфичные проверки
cy.get('#price').should('have.text', '100₽')  // ✅

// Проверяйте множественные условия
cy.get('.modal')
  .should('be.visible')
  .and('have.class', 'active')
  .and('contain', 'Подтверждение')  // ✅

// Давайте время элементам появиться
cy.get('.result', { timeout: 10000 })
  .should('be.visible')  // ✅
```

### ❌ DON'T (Не делать)

```javascript
// Не используйте слишком общие проверки
cy.get('#price').should('exist')  // ❌ слишком слабая проверка

// Не делайте проверки вне команд Cypress
const element = document.querySelector('.btn')
expect(element).to.exist  // ❌ не будет retry

// Не игнорируйте асинхронность
cy.get('.count').then(($el) => {
  const count = $el.text()
  // ❌ следующая проверка может не подождать
})
cy.get('.other').should('exist')
```

## 💡 Советы для отладки

```javascript
// Логирование значений
cy.get('.price')
  .invoke('text')
  .then(cy.log)  // выведет в лог

// Отладка с .debug()
cy.get('.element')
  .debug()  // остановка для инспекции
  .should('be.visible')

// Скриншоты при проверках
cy.get('.result')
  .should('be.visible')
  .screenshot('result-visible')
```

## 📝 Задание для самопроверки

Напишите тест, который:
1. Открывает страницу интернет-магазина
2. Проверяет что отображается минимум 5 товаров
3. Проверяет что у каждого товара есть название, цена и изображение
4. Проверяет что цена больше 0
5. Добавляет товар в корзину
6. Проверяет что счетчик корзины увеличился

## 🔗 Полезные ссылки

- [Cypress Assertions](https://docs.cypress.io/guides/references/assertions)
- [Chai Assertions](https://www.chaijs.com/api/bdd/)
- [Sinon-Chai](https://github.com/domenic/sinon-chai)

---

**Следующий урок:** [Урок 8: Работа с данными и фикстурами](lesson-08-fixtures.md)
