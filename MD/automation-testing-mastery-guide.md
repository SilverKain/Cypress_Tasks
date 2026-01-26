# 🤖 Complete Test Automation Mastery Program with Anki Flashcards
## Комплексная программа освоения автоматизации тестирования с карточками Anki

> **От вашего Automation-наставника:** За 15 лет в автоматизации тестирования я прошёл путь от Manual QA до Lead Automation Architect. Обучил более 500 инженеров искусству создания надёжных, масштабируемых и поддерживаемых автотестов. Эта программа объединяет **научные методы обучения**, **передовые практики индустрии** и **реальные кейсы из production**. Используя **интервальное повторение** в Anki, вы освоите автоматизацию глубже и быстрее, чем на любых курсах.

---

## 🧠 **Философия Automation-обучения: Почему Anki для автоматизатора?**

### Научная основа применительно к автоматизации:
- **Кривая забывания**: Без повторения забываем 85% синтаксиса и паттернов через неделю
- **Интервальное повторение**: Закрепляем API фреймворков и архитектурные решения
- **Активное воспоминание**: Формируем автоматизм написания чистого тестового кода
- **Контекстное обучение**: Каждый паттерн изучается с реальными примерами кода

### Мои принципы Automation-наставничества:
✅ **Фундамент прежде всего**: Сначала принципы, потом инструменты  
✅ **Код как документация**: Чистый, читаемый, поддерживаемый код  
✅ **Реальные проекты**: Каждая концепция с production-ready примерами  
✅ **Индустриальные стандарты**: Актуальные практики и фреймворки 2026 года  
✅ **Постоянная практика**: 30 минут кода в день важнее 5 часов раз в неделю  
✅ **Пирамида тестирования**: Правильный баланс уровней автоматизации  

---

## 🗓️ **ПЛАН ОБУЧЕНИЯ: 12 месяцев до уровня Senior Automation Engineer**

### 📊 Прогрессия по уровням Automation:

| Уровень | Период | Карточек в день | Общее количество | Практические навыки |
|---------|--------|-----------------|------------------|-------------------|
| **Trainee AQA** | Месяцы 1-2 | 15-20 | 900-1,200 | Основы программирования, Git, IDE |
| **Junior AQA** | Месяцы 3-4 | 20-25 | 1,200-1,500 | UI автотесты, первые фреймворки |
| **Junior+ AQA** | Месяцы 5-6 | 25-30 | 1,500-1,800 | API тесты, Page Object, паттерны |
| **Middle- AQA** | Месяцы 7-8 | 30-35 | 1,800-2,100 | Архитектура фреймворков, CI/CD |
| **Middle AQA** | Месяцы 9-10 | 35-40 | 2,100-2,400 | Продвинутые паттерны, оптимизация |
| **Senior- AQA** | Месяцы 11-12 | 40-45 | 2,400-2,700 | Архитектура, лидерство, инновации |

---

## 📚 **Module 1: Programming Foundation - Trainee Level**
### Фундамент программирования для автоматизации | *2 месяца*

#### 🎯 Цели модуля:
- Освоить базовый язык программирования (Python/Java/JavaScript)
- Понимать ООП и принципы чистого кода
- Работать с Git и IDE профессионально
- Понимать основы автоматизации

#### 📋 Содержание Anki-колод:

**Week 1-2: Programming Basics**
- **Карточки:** Переменные, типы данных, операторы, условия, циклы
- **Формат:** "List comprehension в Python" → "Синтаксис + 3 примера + когда НЕ использовать"
- **Количество:** 200 карточек

```python
# Пример карточки
# Вопрос: Как создать список квадратов чисел от 1 до 10?

# Ответ:
squares = [x**2 for x in range(1, 11)]
# Также: squares = list(map(lambda x: x**2, range(1, 11)))
# Когда НЕ использовать: сложная логика > 2 условий
```

**Week 3-4: OOP for Test Automation**
- **Карточки:** Классы, наследование, инкапсуляция, полиморфизм, абстракция
- **Формат:** "Наследование в Page Object" → "Пример BasePage → LoginPage + преимущества"
- **Количество:** 180 карточек

**Week 5-6: Git & Version Control**
- **Карточки:** Git команды, branching strategies, merge conflicts, code review
- **Формат:** "git rebase vs git merge" → "Различия + когда применять + команды + визуализация"
- **Количество:** 150 карточек

**Week 7-8: IDE & Development Tools**
- **Карточки:** PyCharm/IntelliJ/VS Code, дебаггинг, рефакторинг, горячие клавиши
- **Формат:** "Breakpoint с условием" → "Как настроить + примеры использования"
- **Количество:** 120 карточек

#### 🔧 Настройки Anki для Trainee AQA:
```
New cards/day: 18
Maximum reviews/day: 90
Learning steps: 25m 1d 4d (код требует больше времени)
Graduating interval: 8 days
Easy interval: 16 days
Hard interval: 1.2
```

---

## 📚 **Module 2: UI Test Automation - Junior Level**
### UI автоматизация с Selenium/Playwright | *2 месяца*

#### 🎯 Цели модуля:
- Освоить Selenium WebDriver / Playwright
- Понимать DOM и локаторы
- Писать стабильные UI-тесты
- Обрабатывать динамический контент

#### 📋 Содержание Anki-колод:

**Week 9-10: Selenium/Playwright Fundamentals**
- **Карточки:** WebDriver API, браузерные драйверы, базовые операции
- **Формат:** "driver.find_element() стратегии" → "8 типов локаторов + приоритет выбора + примеры"
- **Количество:** 250 карточек

```python
# Пример карточки - Стратегии локаторов
# Приоритет (от лучшего к худшему):

# 1. data-testid (лучший)
driver.find_element(By.CSS_SELECTOR, "[data-testid='login-btn']")

# 2. ID (если стабильный)
driver.find_element(By.ID, "username")

# 3. name
driver.find_element(By.NAME, "password")

# 4. CSS Selector (гибкий)
driver.find_element(By.CSS_SELECTOR, ".login-form input[type='email']")

# 5. XPath (когда нет альтернатив)
driver.find_element(By.XPATH, "//button[contains(text(),'Submit')]")

# ❌ Избегать: индексы, длинные XPath, динамические классы
```

**Week 11-12: Waits & Synchronization**
- **Карточки:** Implicit/Explicit/Fluent waits, Expected Conditions, антипаттерны
- **Формат:** "WebDriverWait с custom condition" → "Код + когда применять + частые ошибки"
- **Количество:** 180 карточек

```python
# Пример карточки - Explicit Wait
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Ожидание кликабельности элемента (правильно)
element = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "submit-btn"))
)

# Custom wait condition
def element_has_text(locator, text):
    def _predicate(driver):
        element = driver.find_element(*locator)
        return text in element.text
    return _predicate

# ❌ Антипаттерн: time.sleep(5)
# ❌ Антипаттерн: implicit wait + explicit wait вместе
```

**Week 13-14: Handling Dynamic Content**
- **Карточки:** AJAX, iframes, alerts, windows, shadow DOM, файлы
- **Формат:** "Работа с Shadow DOM" → "JavaScript executor + Selenium 4 способ + примеры"
- **Количество:** 200 карточек

**Week 15-16: Cross-Browser Testing**
- **Карточки:** Browser capabilities, headless mode, remote execution, Selenium Grid
- **Формат:** "Настройка Chrome headless" → "Options + аргументы + подводные камни"
- **Количество:** 170 карточек

#### 🔧 Настройки Anki для Junior AQA:
```
New cards/day: 23
Maximum reviews/day: 130
Learning steps: 20m 1d 3d
Graduating interval: 7 days
Easy interval: 14 days
```

---

## 📚 **Module 3: Test Framework Architecture - Junior+ Level**
### Архитектура тестовых фреймворков | *2 месяца*

#### 🎯 Цели модуля:
- Освоить Page Object Model и его вариации
- Понимать принципы SOLID в автотестах
- Создавать поддерживаемую архитектуру
- Работать с данными и конфигурацией

#### 📋 Содержание Anki-колод:

**Week 17-18: Page Object Model**
- **Карточки:** POM принципы, Page Factory, Component Object, Screenplay Pattern
- **Формат:** "BasePage абстрактный класс" → "Структура + методы + наследование + пример"
- **Количество:** 220 карточек

```python
# Пример карточки - Page Object Model

# ✅ Правильная структура BasePage
class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)
    
    def find(self, locator):
        return self.wait.until(EC.visibility_of_element_located(locator))
    
    def click(self, locator):
        self.wait.until(EC.element_to_be_clickable(locator)).click()
    
    def type_text(self, locator, text):
        element = self.find(locator)
        element.clear()
        element.send_keys(text)
    
    def get_current_url(self):
        return self.driver.current_url

# ✅ LoginPage наследует BasePage
class LoginPage(BasePage):
    # Локаторы
    USERNAME = (By.ID, "username")
    PASSWORD = (By.ID, "password")
    LOGIN_BTN = (By.CSS_SELECTOR, "[data-testid='login-btn']")
    ERROR_MSG = (By.CLASS_NAME, "error-message")
    
    def login(self, username, password):
        self.type_text(self.USERNAME, username)
        self.type_text(self.PASSWORD, password)
        self.click(self.LOGIN_BTN)
        return DashboardPage(self.driver)  # Fluent interface
    
    def get_error_message(self):
        return self.find(self.ERROR_MSG).text
```

**Week 19-20: SOLID Principles in Testing**
- **Карточки:** SRP, OCP, LSP, ISP, DIP применительно к тестам
- **Формат:** "Single Responsibility в тест-классе" → "Пример нарушения + рефакторинг + результат"
- **Количество:** 180 карточек

```python
# Пример карточки - SRP в автотестах

# ❌ Нарушение SRP - тест делает слишком много
class TestEverything:
    def test_user_flow(self):
        self.register_user()      # Registration
        self.login()              # Authentication
        self.add_to_cart()        # Shopping
        self.checkout()           # Payment
        self.verify_email()       # Notification

# ✅ Соблюдение SRP - разделение по ответственности
class TestRegistration:
    def test_successful_registration(self): ...
    def test_duplicate_email_error(self): ...

class TestAuthentication:
    def test_successful_login(self): ...
    def test_invalid_credentials(self): ...

class TestShopping:
    def test_add_item_to_cart(self): ...
    def test_remove_item_from_cart(self): ...
```

**Week 21-22: Data-Driven Testing**
- **Карточки:** Параметризация, fixtures, factories, test data management
- **Формат:** "pytest.mark.parametrize" → "Синтаксис + файлы данных + динамические ID"
- **Количество:** 200 карточек

```python
# Пример карточки - Data-Driven Testing

import pytest
from dataclasses import dataclass

# Способ 1: parametrize
@pytest.mark.parametrize("username,password,expected", [
    ("valid_user", "valid_pass", True),
    ("invalid_user", "valid_pass", False),
    ("valid_user", "invalid_pass", False),
    ("", "", False),
])
def test_login(username, password, expected):
    result = login_page.login(username, password)
    assert result.is_successful == expected

# Способ 2: Factory Pattern
@dataclass
class UserFactory:
    @staticmethod
    def valid_user():
        return User(username="testuser", password="Test123!")
    
    @staticmethod
    def admin_user():
        return User(username="admin", password="Admin123!", role="admin")

# Способ 3: Fixtures с scope
@pytest.fixture(scope="module")
def authenticated_user(browser):
    user = UserFactory.valid_user()
    login_page = LoginPage(browser)
    login_page.login(user.username, user.password)
    yield user
    # Cleanup after all tests in module
```

**Week 23-24: Configuration Management**
- **Карточки:** Environment configs, secrets, feature flags, multi-env setup
- **Формат:** "Config для разных окружений" → "Структура + переменные + приоритеты + безопасность"
- **Количество:** 160 карточек

---

## 📚 **Module 4: API Test Automation - Middle- Level**
### API автоматизация | *2 месяца*

#### 🎯 Цели модуля:
- Освоить REST API тестирование
- Понимать HTTP протокол глубоко
- Работать с requests/httpx/RestAssured
- Валидировать JSON Schema
- Тестировать GraphQL

#### 📋 Содержание Anki-колод:

**Week 25-26: HTTP & REST Fundamentals**
- **Карточки:** HTTP методы, статус-коды, headers, authentication
- **Формат:** "OAuth 2.0 flow для тестов" → "Типы grants + получение токена + refresh + примеры"
- **Количество:** 240 карточек

```python
# Пример карточки - API Testing с requests

import requests
from dataclasses import dataclass
from typing import Optional

@dataclass
class APIClient:
    base_url: str
    token: Optional[str] = None
    
    @property
    def headers(self):
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers
    
    def get(self, endpoint, params=None):
        response = requests.get(
            f"{self.base_url}{endpoint}",
            headers=self.headers,
            params=params
        )
        return response
    
    def post(self, endpoint, data):
        response = requests.post(
            f"{self.base_url}{endpoint}",
            headers=self.headers,
            json=data
        )
        return response
    
    def authenticate(self, username, password):
        response = self.post("/auth/login", {
            "username": username,
            "password": password
        })
        self.token = response.json()["access_token"]
        return self

# Использование в тестах
def test_create_user():
    client = APIClient("https://api.example.com/v1")
    client.authenticate("admin", "admin123")
    
    response = client.post("/users", {
        "name": "Test User",
        "email": "test@example.com"
    })
    
    assert response.status_code == 201
    assert response.json()["id"] is not None
    assert response.json()["name"] == "Test User"
```

**Week 27-28: Response Validation**
- **Карточки:** JSON Schema, assertions, response time, headers validation
- **Формат:** "JSON Schema валидация" → "Схема + jsonschema library + custom validators"
- **Количество:** 200 карточек

```python
# Пример карточки - JSON Schema Validation

from jsonschema import validate, ValidationError
import pytest

USER_SCHEMA = {
    "type": "object",
    "required": ["id", "name", "email", "created_at"],
    "properties": {
        "id": {"type": "integer", "minimum": 1},
        "name": {"type": "string", "minLength": 1, "maxLength": 100},
        "email": {"type": "string", "format": "email"},
        "created_at": {"type": "string", "format": "date-time"},
        "role": {"type": "string", "enum": ["user", "admin", "moderator"]}
    },
    "additionalProperties": False
}

def test_user_response_schema():
    response = api_client.get("/users/1")
    
    # Валидация схемы
    try:
        validate(instance=response.json(), schema=USER_SCHEMA)
    except ValidationError as e:
        pytest.fail(f"Schema validation failed: {e.message}")
    
    # Дополнительные проверки
    assert response.headers["Content-Type"] == "application/json"
    assert response.elapsed.total_seconds() < 2.0  # Performance
```

**Week 29-30: Advanced API Testing**
- **Карточки:** GraphQL, WebSocket, gRPC, contract testing, mocking
- **Формат:** "Contract Testing с Pact" → "Концепция + Consumer/Provider + CI интеграция"
- **Количество:** 220 карточек

**Week 31-32: API Test Architecture**
- **Карточки:** Builder pattern для requests, Response objects, API clients
- **Формат:** "Builder для сложных запросов" → "Паттерн + fluent interface + примеры"
- **Количество:** 180 карточек

---

## 📚 **Module 5: CI/CD & Infrastructure - Middle Level**
### Автоматизация в CI/CD | *2 месяца*

#### 🎯 Цели модуля:
- Интегрировать тесты в CI/CD пайплайны
- Работать с Docker для тестирования
- Настраивать параллельное выполнение
- Создавать отчёты и метрики

#### 📋 Содержание Anki-колод:

**Week 33-34: CI/CD Integration**
- **Карточки:** GitHub Actions, GitLab CI, Jenkins, Azure DevOps
- **Формат:** "GitHub Actions для тестов" → "Workflow syntax + triggers + artifacts + secrets"
- **Количество:** 200 карточек

```yaml
# Пример карточки - GitHub Actions Workflow

name: Test Automation Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM

env:
  PYTHON_VERSION: '3.11'

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          cache: 'pip'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-test.txt
      
      - name: Run unit tests
        run: pytest tests/unit --junitxml=reports/unit-results.xml
      
      - name: Upload results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: unit-test-results
          path: reports/

  e2e-tests:
    needs: unit-tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chrome, firefox]
      fail-fast: false
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run E2E tests
        run: |
          pytest tests/e2e \
            --browser=${{ matrix.browser }} \
            --alluredir=allure-results
      
      - name: Generate Allure Report
        uses: simple-elf/allure-report-action@v1
        if: always()
        with:
          allure_results: allure-results
```

**Week 35-36: Docker for Testing**
- **Карточки:** Dockerfile, docker-compose, testcontainers, Selenium Grid в Docker
- **Формат:** "docker-compose для тестового окружения" → "Сервисы + networks + volumes + примеры"
- **Количество:** 180 карточек

```yaml
# Пример карточки - Docker Compose для тестирования

version: '3.8'

services:
  # Selenium Grid Hub
  selenium-hub:
    image: selenium/hub:4.15
    ports:
      - "4442:4442"
      - "4443:4443"
      - "4444:4444"
    environment:
      - SE_SESSION_REQUEST_TIMEOUT=300
      - SE_NODE_MAX_SESSIONS=5

  # Chrome Node
  chrome:
    image: selenium/node-chrome:4.15
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=3
    shm_size: '2gb'
    deploy:
      replicas: 2

  # Test Application
  app:
    build: ./app
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://db:5432/test
    depends_on:
      - db

  # Test Database
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=test
      - POSTGRES_USER=test
      - POSTGRES_PASSWORD=test
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  # Test Runner
  tests:
    build:
      context: ./tests
      dockerfile: Dockerfile
    depends_on:
      - selenium-hub
      - chrome
      - app
    environment:
      - SELENIUM_HUB_URL=http://selenium-hub:4444
      - APP_URL=http://app:3000
    volumes:
      - ./reports:/app/reports
```

**Week 37-38: Parallel Execution**
- **Карточки:** pytest-xdist, thread safety, test isolation, sharding
- **Формат:** "Параллельное выполнение pytest" → "xdist опции + изоляция данных + подводные камни"
- **Количество:** 160 карточек

**Week 39-40: Reporting & Metrics**
- **Карточки:** Allure, pytest-html, custom reporters, test metrics
- **Формат:** "Allure отчёт с кастомными шагами" → "Декораторы + attachments + категории"
- **Количество:** 180 карточек

```python
# Пример карточки - Allure Reporting

import allure
from allure_commons.types import AttachmentType

@allure.epic("E-Commerce")
@allure.feature("Shopping Cart")
@allure.story("Add to Cart")
@allure.severity(allure.severity_level.CRITICAL)
class TestAddToCart:
    
    @allure.title("Add single product to empty cart")
    @allure.description("Verify that user can add a product to empty cart")
    def test_add_single_product(self, browser, product):
        with allure.step("Open product page"):
            product_page = ProductPage(browser)
            product_page.open(product.id)
        
        with allure.step(f"Add '{product.name}' to cart"):
            product_page.click_add_to_cart()
            allure.attach(
                browser.get_screenshot_as_png(),
                name="after_add_to_cart",
                attachment_type=AttachmentType.PNG
            )
        
        with allure.step("Verify cart badge shows 1 item"):
            header = HeaderComponent(browser)
            assert header.get_cart_count() == 1
        
        with allure.step("Verify cart contains the product"):
            cart_page = header.open_cart()
            assert product.name in cart_page.get_product_names()
```

---

## 📚 **Module 6: Advanced Patterns & Performance - Senior Level**
### Продвинутые паттерны и оптимизация | *2 месяца*

#### 🎯 Цели модуля:
- Освоить продвинутые архитектурные паттерны
- Оптимизировать скорость выполнения тестов
- Внедрять BDD и Specification by Example
- Тестировать производительность

#### 📋 Содержание Anki-колод:

**Week 41-42: Advanced Design Patterns**
- **Карточки:** Screenplay, Fluent Interface, Builder, Factory, Strategy
- **Формат:** "Strategy Pattern для браузеров" → "Интерфейс + реализации + DI + примеры"
- **Количество:** 220 карточек

```python
# Пример карточки - Strategy Pattern

from abc import ABC, abstractmethod
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions

# Абстрактная стратегия
class BrowserStrategy(ABC):
    @abstractmethod
    def create_driver(self, headless: bool = False):
        pass

# Конкретные стратегии
class ChromeStrategy(BrowserStrategy):
    def create_driver(self, headless: bool = False):
        options = ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        return webdriver.Chrome(options=options)

class FirefoxStrategy(BrowserStrategy):
    def create_driver(self, headless: bool = False):
        options = FirefoxOptions()
        if headless:
            options.add_argument("--headless")
        return webdriver.Firefox(options=options)

class RemoteStrategy(BrowserStrategy):
    def __init__(self, hub_url: str):
        self.hub_url = hub_url
    
    def create_driver(self, headless: bool = False):
        options = ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        return webdriver.Remote(
            command_executor=self.hub_url,
            options=options
        )

# Контекст
class BrowserFactory:
    strategies = {
        "chrome": ChromeStrategy(),
        "firefox": FirefoxStrategy(),
    }
    
    @classmethod
    def create(cls, browser_name: str, **kwargs):
        strategy = cls.strategies.get(browser_name.lower())
        if not strategy:
            raise ValueError(f"Unknown browser: {browser_name}")
        return strategy.create_driver(**kwargs)

# Использование
driver = BrowserFactory.create("chrome", headless=True)
```

**Week 43-44: BDD & Specification by Example**
- **Карточки:** Gherkin, pytest-bdd, Behave, Cucumber, живая документация
- **Формат:** "pytest-bdd структура проекта" → "Файлы + step definitions + fixtures + hooks"
- **Количество:** 200 карточек

```gherkin
# Пример карточки - BDD Feature File

Feature: User Authentication
  As a registered user
  I want to log into my account
  So that I can access my personal dashboard

  Background:
    Given the application is running
    And I am on the login page

  @smoke @auth
  Scenario: Successful login with valid credentials
    When I enter username "testuser@example.com"
    And I enter password "SecurePass123!"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see welcome message "Hello, Test User!"

  @negative
  Scenario Outline: Failed login with invalid credentials
    When I enter username "<username>"
    And I enter password "<password>"
    And I click the login button
    Then I should see error message "<error_message>"
    And I should remain on the login page

    Examples:
      | username              | password      | error_message            |
      | invalid@example.com   | SecurePass123!| Invalid email or password|
      | testuser@example.com  | wrongpassword | Invalid email or password|
      |                       | SecurePass123!| Email is required        |
      | testuser@example.com  |               | Password is required     |

  @security
  Scenario: Account lockout after multiple failed attempts
    When I attempt to login 5 times with incorrect password
    Then my account should be locked
    And I should see message "Account locked. Try again in 30 minutes."
```

```python
# Step Definitions
from pytest_bdd import scenarios, given, when, then, parsers
import pytest

scenarios('../features/authentication.feature')

@given("the application is running")
def app_running(app_url, browser):
    browser.get(app_url)
    assert "Login" in browser.title

@given("I am on the login page")
def on_login_page(login_page):
    assert login_page.is_displayed()

@when(parsers.parse('I enter username "{username}"'))
def enter_username(login_page, username):
    login_page.enter_username(username)

@when(parsers.parse('I enter password "{password}"'))
def enter_password(login_page, password):
    login_page.enter_password(password)

@when("I click the login button")
def click_login(login_page):
    login_page.click_login()

@then("I should be redirected to the dashboard")
def on_dashboard(dashboard_page):
    assert dashboard_page.is_displayed()

@then(parsers.parse('I should see welcome message "{message}"'))
def verify_welcome(dashboard_page, message):
    assert dashboard_page.get_welcome_message() == message
```

**Week 45-46: Performance Testing Automation**
- **Карточки:** Locust, k6, JMeter, performance metrics, load patterns
- **Формат:** "Locust load test сценарий" → "User class + tasks + weight + распределение + анализ"
- **Количество:** 180 карточек

```python
# Пример карточки - Locust Performance Testing

from locust import HttpUser, task, between, events
from locust.runners import MasterRunner
import json

class ECommerceUser(HttpUser):
    wait_time = between(1, 5)  # Случайная пауза 1-5 сек
    
    def on_start(self):
        """Выполняется при старте каждого виртуального пользователя"""
        # Аутентификация
        response = self.client.post("/api/auth/login", json={
            "email": f"user{self.environment.runner.user_count}@test.com",
            "password": "testpass123"
        })
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(10)  # Вес 10 - самое частое действие
    def browse_products(self):
        self.client.get("/api/products", headers=self.headers)
    
    @task(5)  # Вес 5
    def view_product(self):
        product_id = random.randint(1, 100)
        self.client.get(f"/api/products/{product_id}", headers=self.headers)
    
    @task(3)  # Вес 3
    def add_to_cart(self):
        self.client.post("/api/cart/items", 
            headers=self.headers,
            json={"product_id": random.randint(1, 100), "quantity": 1}
        )
    
    @task(1)  # Вес 1 - редкое действие
    def checkout(self):
        with self.client.post("/api/orders", 
            headers=self.headers,
            json={"payment_method": "card"},
            catch_response=True
        ) as response:
            if response.status_code == 201:
                response.success()
            elif response.status_code == 400:
                response.failure("Checkout failed: empty cart")
            else:
                response.failure(f"Unexpected status: {response.status_code}")

# Запуск: locust -f locustfile.py --headless -u 100 -r 10 -t 5m
# -u 100: 100 пользователей
# -r 10: добавлять 10 пользователей в секунду
# -t 5m: тест длится 5 минут
```

**Week 47-48: Test Optimization & Flakiness**
- **Карточки:** Flaky test detection, retry strategies, test stability, speed optimization
- **Формат:** "Анализ flaky тестов" → "Причины + детекция + стратегии исправления"
- **Количество:** 160 карточек

```python
# Пример карточки - Борьба с Flaky Tests

import pytest
from tenacity import retry, stop_after_attempt, wait_exponential

# 1. Retry механизм для нестабильных шагов
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=10))
def wait_for_element_stable(driver, locator, timeout=10):
    """Ожидание стабильности элемента с retry"""
    element = WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located(locator)
    )
    # Дополнительная проверка стабильности
    initial_location = element.location
    time.sleep(0.5)
    if element.location != initial_location:
        raise Exception("Element is still moving")
    return element

# 2. pytest-rerunfailures для автоматического перезапуска
# pytest --reruns 2 --reruns-delay 1

# 3. Маркировка известных flaky тестов
@pytest.mark.flaky(reruns=3, reruns_delay=2)
def test_sometimes_fails():
    # Тест с известной нестабильностью
    pass

# 4. Изоляция тестовых данных
@pytest.fixture
def isolated_user(api_client):
    """Создание изолированного пользователя для теста"""
    user = api_client.create_user({
        "email": f"test_{uuid.uuid4()}@example.com",
        "password": "TestPass123!"
    })
    yield user
    # Cleanup
    api_client.delete_user(user.id)

# 5. Детерминированные ожидания вместо time.sleep
class SmartWait:
    @staticmethod
    def for_api_response(api_client, endpoint, condition, timeout=30):
        """Ожидание выполнения условия от API"""
        start = time.time()
        while time.time() - start < timeout:
            response = api_client.get(endpoint)
            if condition(response):
                return response
            time.sleep(0.5)
        raise TimeoutError(f"Condition not met within {timeout}s")
```

---

## ⚡ **Секретные техники эффективного Automation-обучения**

### 🧩 **Метод "Code-First Learning":**
Каждую концепцию изучайте через код:
```
❌ Плохо: "Page Object" → "Паттерн проектирования для UI тестов"
✅ Хорошо: "Page Object" → "BasePage код + LoginPage наследование + тест-пример + антипаттерны"
```

### 🎨 **Визуальные карточки для AQA:**
- **Для архитектуры:** Диаграммы классов + код
- **Для паттернов:** UML + реализация + применение
- **Для CI/CD:** Pipeline diagrams + YAML конфиги

### 🔄 **Двусторонние карточки для программирования:**
```
Карточка A: "Как сделать explicit wait для кликабельности?" → "Код WebDriverWait + EC"
Карточка B: "WebDriverWait(driver, 10).until(EC.element_to_be_clickable(...))" → "Explicit wait для кликабельности"
```

### 🎯 **Правило AQA 60/30/10:**
- 60% времени: Практика написания кода
- 30% времени: Изучение теории и паттернов (Anki)
- 10% времени: Code review и рефакторинг

---

## 📈 **Система отслеживания AQA-прогресса**

### 📊 Еженедельные метрики:
- **Retention Rate**: > 90% для синтаксиса и API
- **Code Kata**: Минимум 3 практических задачи в неделю
- **PR Reviews**: Участие в code review коллег
- **Test Coverage**: Метрики покрытия ваших проектов

### 🏆 Этапные цели по месяцам:
- **Месяц 2**: 500+ карточек + первый UI тест на Selenium
- **Месяц 4**: 1,200+ карточек + Page Object фреймворк
- **Месяц 6**: 2,000+ карточек + API тестовый фреймворк
- **Месяц 8**: 3,000+ карточек + CI/CD пайплайн для тестов
- **Месяц 10**: 4,000+ карточек + BDD проект
- **Месяц 12**: 5,000+ карточек + собственная тестовая архитектура

---

## 🔧 **Настройки Anki для максимального AQA-эффекта**

### Основные настройки для программирования:
```
New Cards:
- Steps: 25m 1d 4d (код требует времени на понимание)
- Graduating interval: 10 days
- Easy interval: 20 days
- New cards/day: 18-45 (по уровню)

Reviews:
- Maximum reviews/day: 180-350
- Easy bonus: 150%
- Interval modifier: 100%

Lapses:
- Steps: 25m 3d (важно переучить код правильно)
- New interval: 50%
- Leech threshold: 5 (код должен быть точным)
```

### 🎯 Специальные поля для AQA-карточек:
1. **Concept** - концепция/паттерн
2. **Code Example** - рабочий пример кода
3. **Use Cases** - когда применять
4. **Anti-patterns** - как НЕ делать
5. **Related Concepts** - связанные темы
6. **Practice Task** - задание для практики

### 🔧 Рекомендуемые расширения Anki для AQA:
1. **Syntax Highlighting** - подсветка кода
2. **Image Occlusion Enhanced** - для диаграмм
3. **Review Heatmap** - отслеживание регулярности
4. **Hierarchical Tags** - организация по языкам/фреймворкам
5. **Advanced Browser** - поиск по коду

---

## 💡 **Мои секреты успешного AQA-обучения**

### ⏰ **Оптимальное время для занятий:**
- **Утром (8-10)**: Новые концепции и паттерны
- **В обед (12-14)**: Практика кодирования
- **Вечером (18-20)**: Повторение Anki + code review

### 🧘 **Мышление автоматизатора:**
1. **DRY (Don't Repeat Yourself)**: Ищите возможности переиспользования
2. **KISS (Keep It Simple)**: Простые решения лучше сложных
3. **YAGNI (You Aren't Gonna Need It)**: Не добавляйте лишнего
4. **Fail Fast**: Тесты должны падать быстро и понятно

### 🚫 **Частые ошибки начинающих AQA (избегайте!):**
- ❌ Начинать с UI автоматизации без знания программирования
- ❌ Копировать код без понимания
- ❌ Игнорировать паттерны проектирования
- ❌ Писать тесты без assertions
- ❌ Использовать `time.sleep()` везде
- ❌ Хранить секреты в коде
- ❌ Не писать тесты на свой тестовый код

### ✅ **Вместо этого делайте:**
- ✅ Изучите язык программирования до автоматизации
- ✅ Понимайте каждую строку кода
- ✅ Применяйте SOLID и паттерны
- ✅ Каждый тест = минимум одна assertion
- ✅ Используйте умные ожидания
- ✅ Храните секреты в переменных окружения
- ✅ Пишите unit тесты для Page Objects

---

## 🛠️ **Технологический стек 2026 года**

### 🐍 **Python Stack (рекомендую для начала):**
```
Фреймворки: pytest, pytest-bdd, behave
UI: Selenium, Playwright, Splinter
API: requests, httpx, pytest-requests
Reporting: Allure, pytest-html
CI/CD: GitHub Actions, GitLab CI
Performance: Locust, pytest-benchmark
```

### ☕ **Java Stack:**
```
Фреймворки: JUnit 5, TestNG, Cucumber
UI: Selenium, Selenide
API: RestAssured, Retrofit
Reporting: Allure, ExtentReports
CI/CD: Jenkins, Maven/Gradle
Performance: JMeter, Gatling
```

### 📘 **JavaScript/TypeScript Stack:**
```
Фреймворки: Playwright, Cypress, Jest
API: Axios, Supertest
Reporting: Allure, Mocha reporters
CI/CD: GitHub Actions, CircleCI
Performance: k6, Artillery
```

---

## 🎓 **Финальные рекомендации от Automation-наставника**

> За 15 лет в автоматизации я видел тысячи инженеров. **Успешными становятся те, кто понимает принципы, а не просто копирует код**. 
> 
> Anki поможет закрепить синтаксис и паттерны, но настоящий Automation Engineer формируется через **ежедневную практику, чтение чужого кода, участие в open-source и постоянное стремление к улучшению архитектуры**.

### 🔥 **Мой челлендж для будущих AQA:**
**365 дней кодирования + ежедневное Anki + один PR в неделю.**

Каждый день:
- 30 минут Anki (утром)
- 1 час практики кодирования
- 1 коммит в свой проект

Через год вы будете писать тестовые фреймворки, которые другие будут изучать!

### 📞 **Поддержка AQA-сообщества:**
- GitHub: изучайте открытые тестовые фреймворки
- Stack Overflow: отвечайте на вопросы по автоматизации
- Meetups: посещайте QA/Testing meetups
- Блог: документируйте свой путь обучения

### 🌟 **Помните главное правило автоматизации:**
> "Автоматизация не про замену ручного тестирования, а про освобождение времени для более ценной работы"

---

## 📋 **Чек-лист готовности к уровню Senior AQA**

- [ ] Уверенное владение языком программирования
- [ ] Понимание всех уровней тестовой пирамиды
- [ ] Опыт создания тестового фреймворка с нуля
- [ ] Интеграция тестов в CI/CD
- [ ] Опыт с Docker и контейнеризацией
- [ ] Понимание микросервисной архитектуры
- [ ] Опыт performance testing
- [ ] Навыки менторинга Junior AQA
- [ ] Умение выбирать правильные инструменты
- [ ] Понимание бизнес-метрик качества

---

## 🚀 **Путь к Automation-мастерству начинается сегодня!**

Автоматизация тестирования - это искусство создания кода, который проверяет другой код. Это требует дисциплины программиста, внимательности тестировщика и творчества архитектора.

Начните с первой карточки Anki и первой строчки кода. Через год вы будете создавать системы автоматизации, которые экономят сотни часов ручной работы.

---

*С верой в ваш успех в автоматизации,*  
*Ваш персональный Automation-наставник* 🤖  
*Lead Automation Architect с 15-летним опытом*

---

## 📚 **Приложение: Шаблоны Anki-карточек**

### Шаблон для синтаксиса:
```
Front: Как [действие] в [технология]?
Back: 
```[language]
# Код решения с комментариями
```
Когда использовать: [контекст]
Частые ошибки: [список]
```

### Шаблон для паттернов:
```
Front: [Название паттерна] в тестовой автоматизации
Back:
Проблема: [какую проблему решает]
Решение: [краткое описание]
Код:
```[language]
# Пример реализации
```
Применение: [где использовать]
Альтернативы: [другие подходы]
```

### Шаблон для отладки:
```
Front: Ошибка: [текст ошибки]
Back:
Причина: [почему возникает]
Решение: [как исправить]
Профилактика: [как избежать]
```
