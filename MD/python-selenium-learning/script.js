// ===== Flashcard Data =====
const flashcards = [
    {
        question: "Что такое переменная в Python?",
        answer: "Именованная область памяти для хранения данных. Пример: <code>name = \"Test\"</code> создаёт переменную name со значением \"Test\""
    },
    {
        question: "Как правильно именовать переменные в Python (PEP8)?",
        answer: "<code>snake_case</code> для переменных и функций: <code>user_name</code>, <code>test_result</code>, <code>max_retry_count</code>. Без пробелов, только буквы, цифры и _"
    },
    {
        question: "Что такое динамическая типизация в Python?",
        answer: "Тип переменной определяется автоматически при присваивании и может меняться: <code>x = 5</code> (int) → <code>x = \"hello\"</code> (str)"
    },
    {
        question: "В чём разница между == и is?",
        answer: "<code>==</code> сравнивает значения, <code>is</code> сравнивает идентичность (один объект в памяти). <code>a = [1]; b = [1]; a == b</code> (True), <code>a is b</code> (False)"
    },
    {
        question: "Какие основные типы данных в Python?",
        answer: "<code>int</code> (целые), <code>float</code> (дробные), <code>str</code> (строки), <code>bool</code> (логические), <code>list</code>, <code>tuple</code>, <code>dict</code>, <code>set</code>, <code>None</code>"
    },
    {
        question: "Что такое list comprehension?",
        answer: "Краткий способ создания списков: <code>[x**2 for x in range(10)]</code> создаёт список квадратов [0, 1, 4, 9, 16, ...]"
    },
    {
        question: "Как добавить условие в list comprehension?",
        answer: "<code>[x for x in range(10) if x % 2 == 0]</code> → [0, 2, 4, 6, 8]. Условие if добавляется ПОСЛЕ for"
    },
    {
        question: "Что делает enumerate()?",
        answer: "Возвращает пары (индекс, значение): <code>for i, value in enumerate(items): print(f\"{i}: {value}\")</code>"
    },
    {
        question: "Что делает zip()?",
        answer: "Объединяет коллекции: <code>for a, b in zip(list1, list2): print(a, b)</code>. Останавливается на короткой коллекции"
    },
    {
        question: "Что такое f-строка (f-string)?",
        answer: "Форматированная строка с выражениями: <code>name = \"Test\"; f\"Hello, {name}!\"</code> → \"Hello, Test!\""
    },
    {
        question: "Что делает break в цикле?",
        answer: "Немедленно прерывает цикл: <code>for i in range(10): if i == 5: break</code> → выведет 0,1,2,3,4"
    },
    {
        question: "Что делает continue в цикле?",
        answer: "Пропускает текущую итерацию: <code>for i in range(5): if i == 2: continue</code> → выведет 0,1,3,4"
    },
    {
        question: "Что такое *args в функции?",
        answer: "Позволяет передать любое количество позиционных аргументов: <code>def f(*args): for arg in args: print(arg)</code>"
    },
    {
        question: "Что такое **kwargs в функции?",
        answer: "Позволяет передать любое количество именованных аргументов: <code>def f(**kwargs): for k, v in kwargs.items(): print(k, v)</code>"
    },
    {
        question: "Что такое lambda функция?",
        answer: "Анонимная функция: <code>lambda x: x**2</code>. Используется для простых одноразовых функций в sorted(), map(), filter()"
    },
    {
        question: "Что такое декоратор?",
        answer: "Функция, модифицирующая другую функцию: <code>@decorator</code> над <code>def func():</code> эквивалентно <code>func = decorator(func)</code>"
    },
    {
        question: "Какие значения считаются False (falsy)?",
        answer: "<code>False</code>, <code>None</code>, <code>0</code>, <code>0.0</code>, <code>\"\"</code> (пустая строка), <code>[]</code>, <code>{}</code>, <code>set()</code>, <code>()</code> — пустые коллекции"
    },
    {
        question: "Как проверить на None?",
        answer: "<code>if value is None:</code> или <code>if value is not None:</code>. Используйте <code>is</code>, не <code>==</code>"
    },
    {
        question: "Что такое тернарный оператор в Python?",
        answer: "<code>value = a if condition else b</code>. Пример: <code>status = \"pass\" if score >= 60 else \"fail\"</code>"
    },
    {
        question: "Как создать копию списка, а не ссылку?",
        answer: "<code>copy_list = original[:]</code> или <code>copy_list = original.copy()</code> или <code>copy_list = list(original)</code>"
    }
];

// Module content data
const moduleContent = {
    1: {
        title: "Модуль 1: Переменные и типы данных",
        content: `
            <h3>📦 Переменные в Python</h3>
            <p>Переменная — это именованная область памяти для хранения данных.</p>
            
            <div class="code-example">
                <h4>Создание переменных</h4>
                <pre><code><span class="comment"># Именование по PEP8 (snake_case)</span>
user_name = <span class="string">"test_user"</span>
max_retry_count = <span class="number">3</span>
is_logged_in = <span class="keyword">True</span>

<span class="comment"># Константы (UPPER_CASE)</span>
BASE_URL = <span class="string">"https://example.com"</span>
MAX_WAIT_TIME = <span class="number">30</span>

<span class="comment"># Множественное присваивание</span>
a, b, c = <span class="number">1</span>, <span class="number">2</span>, <span class="number">3</span>
x = y = z = <span class="number">0</span></code></pre>
            </div>
            
            <h3>📊 Основные типы данных</h3>
            <ul class="module-topics">
                <li><code>int</code> — целые числа: 42, -10, 0</li>
                <li><code>float</code> — дробные: 3.14, -0.5</li>
                <li><code>str</code> — строки: "Hello", 'World'</li>
                <li><code>bool</code> — логические: True, False</li>
                <li><code>list</code> — списки: [1, 2, 3]</li>
                <li><code>dict</code> — словари: {"key": "value"}</li>
                <li><code>tuple</code> — кортежи: (1, 2, 3)</li>
                <li><code>set</code> — множества: {1, 2, 3}</li>
            </ul>
            
            <div class="code-example">
                <h4>Type hints для автотестов</h4>
                <pre><code><span class="keyword">from</span> typing <span class="keyword">import</span> List, Dict, Optional

<span class="keyword">def</span> <span class="function">get_user</span>(user_id: <span class="type">int</span>) -> Optional[Dict]:
    <span class="string">"""Получить пользователя по ID."""</span>
    <span class="keyword">pass</span>

<span class="keyword">def</span> <span class="function">run_tests</span>(test_names: List[<span class="type">str</span>]) -> <span class="type">bool</span>:
    <span class="string">"""Запустить список тестов."""</span>
    <span class="keyword">pass</span></code></pre>
            </div>
        `
    },
    2: {
        title: "Модуль 2: Операторы",
        content: `
            <h3>⚡ Арифметические операторы</h3>
            <div class="code-example">
                <pre><code>a + b   <span class="comment"># Сложение</span>
a - b   <span class="comment"># Вычитание</span>
a * b   <span class="comment"># Умножение</span>
a / b   <span class="comment"># Деление (возвращает float)</span>
a // b  <span class="comment"># Целочисленное деление</span>
a % b   <span class="comment"># Остаток от деления</span>
a ** b  <span class="comment"># Возведение в степень</span>

<span class="comment"># Примеры</span>
<span class="number">7</span> / <span class="number">2</span>   <span class="comment"># → 3.5</span>
<span class="number">7</span> // <span class="number">2</span>  <span class="comment"># → 3</span>
<span class="number">7</span> % <span class="number">2</span>   <span class="comment"># → 1 (остаток)</span>
<span class="number">2</span> ** <span class="number">3</span>  <span class="comment"># → 8</span></code></pre>
            </div>
            
            <h3>🔍 Операторы сравнения</h3>
            <div class="code-example">
                <pre><code>a == b   <span class="comment"># Равно</span>
a != b   <span class="comment"># Не равно</span>
a < b    <span class="comment"># Меньше</span>
a > b    <span class="comment"># Больше</span>
a <= b   <span class="comment"># Меньше или равно</span>
a >= b   <span class="comment"># Больше или равно</span>

<span class="comment"># Цепочка сравнений</span>
<span class="number">1</span> < x < <span class="number">10</span>  <span class="comment"># x больше 1 И меньше 10</span></code></pre>
            </div>
            
            <h3>🧠 Логические операторы</h3>
            <div class="code-example">
                <pre><code>a <span class="keyword">and</span> b  <span class="comment"># True если оба True</span>
a <span class="keyword">or</span> b   <span class="comment"># True если хотя бы один True</span>
<span class="keyword">not</span> a    <span class="comment"># Инвертирует значение</span>

<span class="comment"># Short-circuit evaluation</span>
name = user_input <span class="keyword">or</span> <span class="string">"Anonymous"</span>  <span class="comment"># Значение по умолчанию</span>

<span class="comment"># Операторы принадлежности</span>
<span class="string">"a"</span> <span class="keyword">in</span> <span class="string">"abc"</span>        <span class="comment"># → True</span>
<span class="number">1</span> <span class="keyword">in</span> [<span class="number">1</span>, <span class="number">2</span>, <span class="number">3</span>]       <span class="comment"># → True</span>
<span class="string">"key"</span> <span class="keyword">in</span> {<span class="string">"key"</span>: <span class="number">1</span>}  <span class="comment"># → True</span></code></pre>
            </div>
        `
    },
    3: {
        title: "Модуль 3: Условия и ветвление",
        content: `
            <h3>🔀 Конструкция if-elif-else</h3>
            <div class="code-example">
                <pre><code><span class="keyword">if</span> status_code == <span class="number">200</span>:
    <span class="builtin">print</span>(<span class="string">"Success"</span>)
<span class="keyword">elif</span> status_code == <span class="number">404</span>:
    <span class="builtin">print</span>(<span class="string">"Not Found"</span>)
<span class="keyword">elif</span> status_code >= <span class="number">500</span>:
    <span class="builtin">print</span>(<span class="string">"Server Error"</span>)
<span class="keyword">else</span>:
    <span class="builtin">print</span>(<span class="string">"Unknown status"</span>)</code></pre>
            </div>
            
            <h3>✨ Тернарный оператор</h3>
            <div class="code-example">
                <pre><code><span class="comment"># value = a if condition else b</span>
status = <span class="string">"PASS"</span> <span class="keyword">if</span> test_passed <span class="keyword">else</span> <span class="string">"FAIL"</span>

<span class="comment"># Для автотестов</span>
message = error.text <span class="keyword">if</span> error.is_displayed() <span class="keyword">else</span> <span class="keyword">None</span></code></pre>
            </div>
            
            <h3>🛡️ Guard Clauses</h3>
            <div class="code-example">
                <pre><code><span class="comment"># Ранний выход упрощает код</span>
<span class="keyword">def</span> <span class="function">process_user</span>(user):
    <span class="keyword">if</span> user <span class="keyword">is</span> <span class="keyword">None</span>:
        <span class="keyword">return</span> <span class="keyword">None</span>
    
    <span class="keyword">if</span> <span class="keyword">not</span> user.is_active:
        <span class="keyword">return</span> <span class="string">"User inactive"</span>
    
    <span class="comment"># Основная логика</span>
    <span class="keyword">return</span> user.process()</code></pre>
            </div>
            
            <h3>🎯 match-case (Python 3.10+)</h3>
            <div class="code-example">
                <pre><code><span class="keyword">match</span> response.status_code:
    <span class="keyword">case</span> <span class="number">200</span> | <span class="number">201</span>:
        <span class="keyword">return</span> <span class="string">"Success"</span>
    <span class="keyword">case</span> <span class="number">400</span>:
        <span class="keyword">return</span> <span class="string">"Bad Request"</span>
    <span class="keyword">case</span> <span class="number">404</span>:
        <span class="keyword">return</span> <span class="string">"Not Found"</span>
    <span class="keyword">case</span> _:
        <span class="keyword">return</span> <span class="string">"Unknown"</span></code></pre>
            </div>
        `
    },
    4: {
        title: "Модуль 4: Циклы",
        content: `
            <h3>🔄 Цикл for</h3>
            <div class="code-example">
                <pre><code><span class="comment"># Итерация по коллекции</span>
<span class="keyword">for</span> user <span class="keyword">in</span> users:
    <span class="builtin">print</span>(user.name)

<span class="comment"># range(start, stop, step)</span>
<span class="keyword">for</span> i <span class="keyword">in</span> <span class="builtin">range</span>(<span class="number">5</span>):        <span class="comment"># 0, 1, 2, 3, 4</span>
<span class="keyword">for</span> i <span class="keyword">in</span> <span class="builtin">range</span>(<span class="number">1</span>, <span class="number">6</span>):     <span class="comment"># 1, 2, 3, 4, 5</span>
<span class="keyword">for</span> i <span class="keyword">in</span> <span class="builtin">range</span>(<span class="number">0</span>, <span class="number">10</span>, <span class="number">2</span>): <span class="comment"># 0, 2, 4, 6, 8</span>

<span class="comment"># enumerate для индексов</span>
<span class="keyword">for</span> i, test <span class="keyword">in</span> <span class="builtin">enumerate</span>(tests, start=<span class="number">1</span>):
    <span class="builtin">print</span>(<span class="string">f"Test </span>{i}<span class="string">: </span>{test.name}<span class="string">"</span>)

<span class="comment"># zip для параллельной итерации</span>
<span class="keyword">for</span> user, pwd <span class="keyword">in</span> <span class="builtin">zip</span>(usernames, passwords):
    login(user, pwd)</code></pre>
            </div>
            
            <h3>⏳ Цикл while</h3>
            <div class="code-example">
                <pre><code><span class="comment"># Retry-логика для автотестов</span>
attempts = <span class="number">0</span>
max_retries = <span class="number">3</span>

<span class="keyword">while</span> attempts < max_retries:
    <span class="keyword">try</span>:
        element = driver.find_element(By.ID, <span class="string">"dynamic"</span>)
        <span class="keyword">break</span>
    <span class="keyword">except</span> NoSuchElementException:
        attempts += <span class="number">1</span>
        time.sleep(<span class="number">1</span>)

<span class="comment"># Polling</span>
<span class="keyword">while</span> <span class="keyword">True</span>:
    status = check_status()
    <span class="keyword">if</span> status == <span class="string">"complete"</span>:
        <span class="keyword">break</span>
    time.sleep(<span class="number">0.5</span>)</code></pre>
            </div>
            
            <h3>⚡ break, continue, else</h3>
            <div class="code-example">
                <pre><code><span class="comment"># break - выход из цикла</span>
<span class="keyword">for</span> item <span class="keyword">in</span> items:
    <span class="keyword">if</span> item.is_target:
        found = item
        <span class="keyword">break</span>

<span class="comment"># continue - пропуск итерации</span>
<span class="keyword">for</span> test <span class="keyword">in</span> tests:
    <span class="keyword">if</span> test.skip:
        <span class="keyword">continue</span>
    test.run()

<span class="comment"># else - выполнится если не было break</span>
<span class="keyword">for</span> item <span class="keyword">in</span> items:
    <span class="keyword">if</span> item.match:
        <span class="keyword">break</span>
<span class="keyword">else</span>:
    <span class="builtin">print</span>(<span class="string">"Not found"</span>)</code></pre>
            </div>
        `
    },
    5: {
        title: "Модуль 5: Функции",
        content: `
            <h3>🎯 Определение функций</h3>
            <div class="code-example">
                <pre><code><span class="keyword">def</span> <span class="function">wait_for_element</span>(
    driver: WebDriver,
    locator: <span class="type">tuple</span>,
    timeout: <span class="type">int</span> = <span class="number">10</span>
) -> WebElement:
    <span class="string">"""
    Ожидание видимости элемента.
    
    Args:
        driver: WebDriver instance
        locator: Кортеж (By.XXX, "value")
        timeout: Максимальное время ожидания
    
    Returns:
        WebElement после появления
    """</span>
    <span class="keyword">return</span> WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located(locator)
    )</code></pre>
            </div>
            
            <h3>📦 *args и **kwargs</h3>
            <div class="code-example">
                <pre><code><span class="comment"># *args - произвольные позиционные аргументы</span>
<span class="keyword">def</span> <span class="function">fill_form</span>(*fields):
    <span class="keyword">for</span> locator, value <span class="keyword">in</span> fields:
        driver.find_element(*locator).send_keys(value)

fill_form(
    ((By.ID, <span class="string">"name"</span>), <span class="string">"John"</span>),
    ((By.ID, <span class="string">"email"</span>), <span class="string">"john@test.com"</span>)
)

<span class="comment"># **kwargs - произвольные именованные аргументы</span>
<span class="keyword">def</span> <span class="function">create_user</span>(**user_data):
    <span class="keyword">return</span> api.post(<span class="string">"/users"</span>, json=user_data)

create_user(name=<span class="string">"John"</span>, email=<span class="string">"john@test.com"</span>)</code></pre>
            </div>
            
            <h3>✨ Lambda функции</h3>
            <div class="code-example">
                <pre><code><span class="comment"># Сортировка по атрибуту</span>
users_sorted = <span class="builtin">sorted</span>(users, key=<span class="keyword">lambda</span> u: u.name)

<span class="comment"># Фильтрация</span>
active_users = <span class="builtin">list</span>(<span class="builtin">filter</span>(<span class="keyword">lambda</span> u: u.is_active, users))

<span class="comment"># Преобразование</span>
names = <span class="builtin">list</span>(<span class="builtin">map</span>(<span class="keyword">lambda</span> u: u.name.upper(), users))</code></pre>
            </div>
            
            <h3>🎨 Декораторы</h3>
            <div class="code-example">
                <pre><code><span class="keyword">import</span> functools
<span class="keyword">import</span> time

<span class="keyword">def</span> <span class="function">retry</span>(max_attempts=<span class="number">3</span>, delay=<span class="number">1</span>):
    <span class="keyword">def</span> <span class="function">decorator</span>(func):
        <span class="decorator">@functools.wraps</span>(func)
        <span class="keyword">def</span> <span class="function">wrapper</span>(*args, **kwargs):
            <span class="keyword">for</span> attempt <span class="keyword">in</span> <span class="builtin">range</span>(max_attempts):
                <span class="keyword">try</span>:
                    <span class="keyword">return</span> func(*args, **kwargs)
                <span class="keyword">except</span> Exception <span class="keyword">as</span> e:
                    <span class="keyword">if</span> attempt == max_attempts - <span class="number">1</span>:
                        <span class="keyword">raise</span>
                    time.sleep(delay)
        <span class="keyword">return</span> wrapper
    <span class="keyword">return</span> decorator

<span class="decorator">@retry</span>(max_attempts=<span class="number">3</span>)
<span class="keyword">def</span> <span class="function">unstable_action</span>():
    <span class="comment"># Нестабильное действие</span>
    <span class="keyword">pass</span></code></pre>
            </div>
        `
    },
    6: {
        title: "Модуль 6: List Comprehension",
        content: `
            <h3>✨ List Comprehension</h3>
            <div class="code-example">
                <pre><code><span class="comment"># Базовый синтаксис: [expression for item in iterable]</span>
squares = [x**<span class="number">2</span> <span class="keyword">for</span> x <span class="keyword">in</span> <span class="builtin">range</span>(<span class="number">10</span>)]
<span class="comment"># → [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]</span>

<span class="comment"># С условием</span>
even_squares = [x**<span class="number">2</span> <span class="keyword">for</span> x <span class="keyword">in</span> <span class="builtin">range</span>(<span class="number">10</span>) <span class="keyword">if</span> x % <span class="number">2</span> == <span class="number">0</span>]
<span class="comment"># → [0, 4, 16, 36, 64]</span>

<span class="comment"># if-else (ДО for)</span>
labels = [<span class="string">"even"</span> <span class="keyword">if</span> x % <span class="number">2</span> == <span class="number">0</span> <span class="keyword">else</span> <span class="string">"odd"</span> <span class="keyword">for</span> x <span class="keyword">in</span> <span class="builtin">range</span>(<span class="number">5</span>)]
<span class="comment"># → ["even", "odd", "even", "odd", "even"]</span></code></pre>
            </div>
            
            <h3>📖 Dict Comprehension</h3>
            <div class="code-example">
                <pre><code><span class="comment"># {key: value for item in iterable}</span>
squares_dict = {x: x**<span class="number">2</span> <span class="keyword">for</span> x <span class="keyword">in</span> <span class="builtin">range</span>(<span class="number">5</span>)}
<span class="comment"># → {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}</span>

<span class="comment"># Преобразование ключей</span>
upper_dict = {k.upper(): v <span class="keyword">for</span> k, v <span class="keyword">in</span> config.items()}

<span class="comment"># Фильтрация словаря</span>
passed_tests = {k: v <span class="keyword">for</span> k, v <span class="keyword">in</span> results.items() <span class="keyword">if</span> v == <span class="string">"PASS"</span>}</code></pre>
            </div>
            
            <h3>🎯 Применение в автотестах</h3>
            <div class="code-example">
                <pre><code><span class="comment"># Извлечение текста элементов</span>
texts = [el.text <span class="keyword">for</span> el <span class="keyword">in</span> driver.find_elements(By.CLASS_NAME, <span class="string">"item"</span>)]

<span class="comment"># Фильтрация видимых элементов</span>
visible = [el <span class="keyword">for</span> el <span class="keyword">in</span> elements <span class="keyword">if</span> el.is_displayed()]

<span class="comment"># Сбор атрибутов</span>
hrefs = [a.get_attribute(<span class="string">"href"</span>) <span class="keyword">for</span> a <span class="keyword">in</span> links <span class="keyword">if</span> a.get_attribute(<span class="string">"href"</span>)]

<span class="comment"># Проверка всех элементов</span>
<span class="keyword">assert</span> <span class="builtin">all</span>(el.is_enabled() <span class="keyword">for</span> el <span class="keyword">in</span> buttons)
<span class="keyword">assert</span> <span class="builtin">any</span>(<span class="string">"error"</span> <span class="keyword">in</span> el.text <span class="keyword">for</span> el <span class="keyword">in</span> messages)</code></pre>
            </div>
        `
    },
    7: {
        title: "Модуль 7: Selenium WebDriver",
        content: `
            <h3>🌐 Начало работы</h3>
            <div class="code-example">
                <pre><code><span class="keyword">from</span> selenium <span class="keyword">import</span> webdriver
<span class="keyword">from</span> selenium.webdriver.common.by <span class="keyword">import</span> By
<span class="keyword">from</span> selenium.webdriver.support.ui <span class="keyword">import</span> WebDriverWait
<span class="keyword">from</span> selenium.webdriver.support <span class="keyword">import</span> expected_conditions <span class="keyword">as</span> EC

<span class="comment"># Инициализация драйвера</span>
driver = webdriver.Chrome()
driver.maximize_window()
driver.get(<span class="string">"https://example.com"</span>)</code></pre>
            </div>
            
            <h3>🎯 Стратегии локаторов (по приоритету)</h3>
            <div class="code-example">
                <pre><code><span class="comment"># 1. data-testid (лучший выбор)</span>
driver.find_element(By.CSS_SELECTOR, <span class="string">"[data-testid='login-btn']"</span>)

<span class="comment"># 2. ID (если стабильный)</span>
driver.find_element(By.ID, <span class="string">"username"</span>)

<span class="comment"># 3. name</span>
driver.find_element(By.NAME, <span class="string">"password"</span>)

<span class="comment"># 4. CSS Selector (гибкий)</span>
driver.find_element(By.CSS_SELECTOR, <span class="string">".login-form input[type='email']"</span>)

<span class="comment"># 5. XPath (когда нет альтернатив)</span>
driver.find_element(By.XPATH, <span class="string">"//button[contains(text(),'Submit')]"</span>)</code></pre>
            </div>
            
            <h3>⏳ Ожидания (Waits)</h3>
            <div class="code-example">
                <pre><code><span class="comment"># ✅ Explicit Wait (правильно)</span>
element = WebDriverWait(driver, <span class="number">10</span>).until(
    EC.element_to_be_clickable((By.ID, <span class="string">"submit"</span>))
)

<span class="comment"># Популярные Expected Conditions:</span>
EC.presence_of_element_located(locator)      <span class="comment"># Элемент в DOM</span>
EC.visibility_of_element_located(locator)    <span class="comment"># Элемент видим</span>
EC.element_to_be_clickable(locator)          <span class="comment"># Можно кликнуть</span>
EC.text_to_be_present_in_element(locator, <span class="string">"text"</span>)

<span class="comment"># ❌ Антипаттерн: time.sleep(5)</span>
<span class="comment"># ❌ Антипаттерн: implicit + explicit wait вместе</span></code></pre>
            </div>
            
            <h3>🖱️ Действия с элементами</h3>
            <div class="code-example">
                <pre><code><span class="comment"># Клик</span>
element.click()

<span class="comment"># Ввод текста</span>
element.clear()
element.send_keys(<span class="string">"test text"</span>)

<span class="comment"># Получение данных</span>
text = element.text
value = element.get_attribute(<span class="string">"value"</span>)
is_visible = element.is_displayed()
is_enabled = element.is_enabled()

<span class="comment"># Скриншот при ошибке</span>
driver.save_screenshot(<span class="string">"error.png"</span>)

<span class="comment"># Закрытие</span>
driver.quit()</code></pre>
            </div>
        `
    },
    8: {
        title: "Модуль 8: Page Object Model",
        content: `
            <h3>🏗️ Структура Page Object</h3>
            <div class="code-example">
                <pre><code><span class="comment"># base_page.py</span>
<span class="keyword">class</span> <span class="class-name">BasePage</span>:
    <span class="keyword">def</span> <span class="function">__init__</span>(<span class="param">self</span>, driver):
        <span class="param">self</span>.driver = driver
        <span class="param">self</span>.wait = WebDriverWait(driver, <span class="number">10</span>)
    
    <span class="keyword">def</span> <span class="function">find</span>(<span class="param">self</span>, locator):
        <span class="keyword">return</span> <span class="param">self</span>.wait.until(
            EC.visibility_of_element_located(locator)
        )
    
    <span class="keyword">def</span> <span class="function">click</span>(<span class="param">self</span>, locator):
        <span class="param">self</span>.wait.until(
            EC.element_to_be_clickable(locator)
        ).click()
    
    <span class="keyword">def</span> <span class="function">type_text</span>(<span class="param">self</span>, locator, text):
        element = <span class="param">self</span>.find(locator)
        element.clear()
        element.send_keys(text)</code></pre>
            </div>
            
            <h3>📄 Пример LoginPage</h3>
            <div class="code-example">
                <pre><code><span class="comment"># login_page.py</span>
<span class="keyword">class</span> <span class="class-name">LoginPage</span>(BasePage):
    <span class="comment"># Локаторы</span>
    USERNAME = (By.ID, <span class="string">"username"</span>)
    PASSWORD = (By.ID, <span class="string">"password"</span>)
    LOGIN_BTN = (By.CSS_SELECTOR, <span class="string">"[data-testid='login-btn']"</span>)
    ERROR_MSG = (By.CLASS_NAME, <span class="string">"error-message"</span>)
    
    <span class="keyword">def</span> <span class="function">login</span>(<span class="param">self</span>, username, password):
        <span class="param">self</span>.type_text(<span class="param">self</span>.USERNAME, username)
        <span class="param">self</span>.type_text(<span class="param">self</span>.PASSWORD, password)
        <span class="param">self</span>.click(<span class="param">self</span>.LOGIN_BTN)
        <span class="keyword">return</span> DashboardPage(<span class="param">self</span>.driver)  <span class="comment"># Fluent</span>
    
    <span class="keyword">def</span> <span class="function">get_error_message</span>(<span class="param">self</span>):
        <span class="keyword">return</span> <span class="param">self</span>.find(<span class="param">self</span>.ERROR_MSG).text</code></pre>
            </div>
            
            <h3>✅ Пример теста</h3>
            <div class="code-example">
                <pre><code><span class="comment"># test_login.py</span>
<span class="keyword">import</span> pytest

<span class="keyword">class</span> <span class="class-name">TestLogin</span>:
    <span class="keyword">def</span> <span class="function">test_successful_login</span>(<span class="param">self</span>, browser):
        login_page = LoginPage(browser)
        login_page.open()
        
        dashboard = login_page.login(<span class="string">"user"</span>, <span class="string">"pass123"</span>)
        
        <span class="keyword">assert</span> dashboard.is_displayed()
        <span class="keyword">assert</span> <span class="string">"Dashboard"</span> <span class="keyword">in</span> browser.title
    
    <span class="keyword">def</span> <span class="function">test_invalid_credentials</span>(<span class="param">self</span>, browser):
        login_page = LoginPage(browser)
        login_page.open()
        login_page.login(<span class="string">"invalid"</span>, <span class="string">"wrong"</span>)
        
        <span class="keyword">assert</span> login_page.get_error_message() == <span class="string">"Invalid credentials"</span></code></pre>
            </div>
        `
    }
};

// ===== Variables =====
let currentCardIndex = 0;
let isFlipped = false;

// ===== DOM Elements =====
const flashcard = document.getElementById('flashcard');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const currentCardEl = document.getElementById('currentCard');
const totalCardsEl = document.getElementById('totalCards');
const themeToggle = document.getElementById('themeToggle');
const modal = document.getElementById('moduleModal');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    totalCardsEl.textContent = flashcards.length;
    updateCard();
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.textContent = '☀️';
    }
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
});

// ===== Flashcard Functions =====
function updateCard() {
    const card = flashcards[currentCardIndex];
    questionEl.innerHTML = card.question;
    answerEl.innerHTML = card.answer;
    currentCardEl.textContent = currentCardIndex + 1;
    
    // Reset flip state
    if (isFlipped) {
        flashcard.classList.remove('flipped');
        isFlipped = false;
    }
}

function flipCard() {
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

function nextCard() {
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    updateCard();
}

function prevCard() {
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    updateCard();
}

// Click on flashcard to flip
flashcard.addEventListener('click', flipCard);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevCard();
    if (e.key === 'ArrowRight') nextCard();
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipCard();
    }
});

// ===== Tab Functions =====
function showTab(tabId) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// ===== Module Modal =====
function openModule(moduleNumber) {
    const content = moduleContent[moduleNumber];
    if (content) {
        document.getElementById('modalTitle').textContent = content.title;
        document.getElementById('modalBody').innerHTML = content.content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ===== Theme Toggle =====
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ===== Navigation =====
function updateActiveNavLink() {
    const sections = ['home', 'modules', 'practice', 'resources'];
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}

// ===== Progress Tracking =====
function updateProgress(moduleNumber, completed, total) {
    const card = document.querySelector(`[data-module="${moduleNumber}"]`);
    if (card) {
        const progressBar = card.querySelector('.progress-bar');
        const progressText = card.querySelector('.module-progress span');
        const progress = (completed / total) * 100;
        
        progressBar.style.setProperty('--progress', `${progress}%`);
        progressText.textContent = `${completed}/${total} карточек`;
    }
}

// ===== Local Storage for Progress =====
function saveProgress(moduleNumber, cardIndex) {
    const progress = JSON.parse(localStorage.getItem('studyProgress') || '{}');
    if (!progress[moduleNumber]) {
        progress[moduleNumber] = [];
    }
    if (!progress[moduleNumber].includes(cardIndex)) {
        progress[moduleNumber].push(cardIndex);
    }
    localStorage.setItem('studyProgress', JSON.stringify(progress));
}

function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('studyProgress') || '{}');
    // Update UI based on saved progress
    Object.keys(progress).forEach(moduleNumber => {
        const completed = progress[moduleNumber].length;
        // Assuming each module has different total cards
        const totals = { 1: 50, 2: 30, 3: 30, 4: 50, 5: 25, 6: 15, 7: 60, 8: 40 };
        updateProgress(parseInt(moduleNumber), completed, totals[moduleNumber] || 50);
    });
}

// Load progress on page load
document.addEventListener('DOMContentLoaded', loadProgress);
