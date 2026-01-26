#!/usr/bin/env python3
"""
Анализатор Python файлов для извлечения функций и методов
Создает JSON данные для автоматического добавления в справочник

Использование:
    python analyzer.py task1.py task2.py
    python analyzer.py *.py
"""

import ast
import sys
import json
import re
from pathlib import Path
from typing import List, Dict, Any

class FunctionAnalyzer(ast.NodeVisitor):
    """Анализирует AST для извлечения информации о функциях"""
    
    def __init__(self):
        self.functions = []
        self.imports = []
        self.current_class = None
    
    def visit_Import(self, node):
        """Обрабатывает import statements"""
        for alias in node.names:
            self.imports.append(alias.name)
        self.generic_visit(node)
    
    def visit_ImportFrom(self, node):
        """Обрабатывает from ... import statements"""
        if node.module:
            for alias in node.names:
                self.imports.append(f"{node.module}.{alias.name}")
        self.generic_visit(node)
    
    def visit_ClassDef(self, node):
        """Обрабатывает определения классов"""
        old_class = self.current_class
        self.current_class = node.name
        self.generic_visit(node)
        self.current_class = old_class
    
    def visit_FunctionDef(self, node):
        """Обрабатывает определения функций"""
        function_info = {
            'name': node.name,
            'line': node.lineno,
            'docstring': ast.get_docstring(node),
            'args': [arg.arg for arg in node.args.args],
            'decorators': [self._get_decorator_name(dec) for dec in node.decorator_list],
            'class': self.current_class,
            'is_test': node.name.startswith('test_'),
            'is_fixture': any('fixture' in dec for dec in [self._get_decorator_name(dec) for dec in node.decorator_list])
        }
        self.functions.append(function_info)
        self.generic_visit(node)
    
    def _get_decorator_name(self, decorator):
        """Извлекает имя декоратора"""
        if isinstance(decorator, ast.Name):
            return decorator.id
        elif isinstance(decorator, ast.Attribute):
            return f"{decorator.value.id}.{decorator.attr}" if hasattr(decorator.value, 'id') else decorator.attr
        return str(decorator)

def extract_function_calls(source_code: str) -> List[Dict[str, Any]]:
    """Извлекает вызовы функций из исходного кода"""
    calls = []
    
    # Регулярные выражения для поиска различных паттернов
    patterns = {
        'selenium': [
            (r'webdriver\.(\w+)\(\)', 'selenium', 'WebDriver инициализация'),
            (r'\.find_element\(([^)]+)\)', 'selenium', 'Поиск элемента'),
            (r'\.send_keys\(([^)]+)\)', 'selenium', 'Ввод текста'),
            (r'\.click\(\)', 'selenium', 'Клик по элементу'),
            (r'WebDriverWait\([^)]+\)', 'selenium', 'Ожидание'),
            (r'\.execute_script\(([^)]+)\)', 'selenium', 'Выполнение JavaScript'),
            (r'By\.(\w+)', 'selenium', 'Селектор элемента'),
            (r'EC\.(\w+)', 'selenium', 'Условие ожидания')
        ],
        'requests': [
            (r'requests\.(\w+)\(([^)]*)\)', 'requests', 'HTTP запрос'),
            (r'\.json\(\)', 'requests', 'Парсинг JSON ответа'),
            (r'\.status_code', 'requests', 'HTTP статус код'),
            (r'\.headers', 'requests', 'HTTP заголовки'),
            (r'\.text', 'requests', 'Текст ответа')
        ],
        'pytest': [
            (r'@pytest\.(\w+)', 'pytest', 'Pytest декоратор'),
            (r'assert\s+([^#\n]+)', 'pytest', 'Утверждение'),
            (r'pytest\.main\(([^)]*)\)', 'pytest', 'Запуск pytest')
        ],
        'python': [
            (r'random\.(\w+)\(([^)]*)\)', 'python', 'Генерация случайных значений'),
            (r'time\.(\w+)\(([^)]*)\)', 'python', 'Работа со временем'),
            (r'isinstance\(([^)]+)\)', 'python', 'Проверка типа'),
            (r'f"([^"]*)"', 'python', 'F-строка форматирование'),
            (r"f'([^']*)'", 'python', 'F-строка форматирование')
        ]
    }
    
    for category, pattern_list in patterns.items():
        for pattern, cat, desc in pattern_list:
            matches = re.finditer(pattern, source_code, re.MULTILINE | re.IGNORECASE)
            for match in matches:
                calls.append({
                    'pattern': match.group(0),
                    'category': cat,
                    'description': desc,
                    'line': source_code[:match.start()].count('\n') + 1
                })
    
    return calls

def categorize_function(func_name: str, imports: List[str], decorators: List[str]) -> str:
    """Определяет категорию функции на основе её имени и контекста"""
    
    # Проверяем декораторы
    if any('fixture' in dec for dec in decorators):
        return 'pytest'
    
    # Проверяем имя функции
    if func_name.startswith('test_'):
        return 'pytest'
    
    # Проверяем импорты для определения категории
    if any('selenium' in imp for imp in imports):
        return 'selenium'
    elif any('requests' in imp for imp in imports):
        return 'requests'
    elif any('pytest' in imp for imp in imports):
        return 'pytest'
    else:
        return 'python'

def generate_tags(func_name: str, category: str, docstring: str = None) -> str:
    """Генерирует теги для функции"""
    tags = []
    
    # Базовые теги по категории
    category_tags = {
        'selenium': ['webdriver', 'browser', 'automation'],
        'requests': ['http', 'api', 'request'],
        'pytest': ['test', 'fixture', 'assert'],
        'python': ['builtin', 'standard']
    }
    
    tags.extend(category_tags.get(category, []))
    
    # Теги из имени функции
    if 'test' in func_name:
        tags.append('test')
    if 'setup' in func_name or 'fixture' in func_name:
        tags.append('setup')
    if 'wait' in func_name:
        tags.append('wait')
    if 'click' in func_name:
        tags.append('click')
    if 'find' in func_name:
        tags.append('find')
    
    # Теги из docstring
    if docstring:
        if 'регистрация' in docstring.lower():
            tags.append('registration')
        if 'форма' in docstring.lower():
            tags.append('form')
        if 'пользователь' in docstring.lower():
            tags.append('user')
    
    return ', '.join(list(set(tags)))

def analyze_file(filepath: Path) -> Dict[str, Any]:
    """Анализирует Python файл и извлекает информацию о функциях"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        source_code = f.read()
    
    try:
        tree = ast.parse(source_code)
    except SyntaxError as e:
        print(f"Ошибка парсинга {filepath}: {e}")
        return {'error': str(e)}
    
    analyzer = FunctionAnalyzer()
    analyzer.visit(tree)
    
    # Извлекаем вызовы функций
    function_calls = extract_function_calls(source_code)
    
    # Формируем результат
    result = {
        'file': str(filepath),
        'imports': analyzer.imports,
        'functions': analyzer.functions,
        'function_calls': function_calls,
        'lines_count': len(source_code.split('\n'))
    }
    
    return result

def generate_reference_data(analysis_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Генерирует данные для справочника на основе анализа"""
    
    reference_functions = []
    seen_patterns = set()
    
    for file_analysis in analysis_results:
        if 'error' in file_analysis:
            continue
            
        imports = file_analysis.get('imports', [])
        
        # Обрабатываем найденные паттерны вызовов
        for call in file_analysis.get('function_calls', []):
            pattern = call['pattern']
            
            # Избегаем дубликатов
            if pattern in seen_patterns:
                continue
            seen_patterns.add(pattern)
            
            # Создаем запись для справочника
            ref_func = {
                'name': pattern,
                'category': call['category'],
                'description': call['description'],
                'example': pattern,
                'tags': generate_tags(pattern, call['category']),
                'source_file': file_analysis['file'],
                'line': call['line'],
                'auto_generated': True
            }
            
            reference_functions.append(ref_func)
        
        # Обрабатываем определенные функции
        for func in file_analysis.get('functions', []):
            if func['name'].startswith('_'):  # Пропускаем приватные функции
                continue
                
            category = categorize_function(func['name'], imports, func['decorators'])
            
            ref_func = {
                'name': func['name'] + '()',
                'category': category,
                'description': func['docstring'] or f"Функция {func['name']}",
                'example': f"def {func['name']}({', '.join(func['args'])}):",
                'tags': generate_tags(func['name'], category, func['docstring']),
                'source_file': file_analysis['file'],
                'line': func['line'],
                'auto_generated': True,
                'is_test': func['is_test'],
                'is_fixture': func['is_fixture']
            }
            
            reference_functions.append(ref_func)
    
    return reference_functions

def main():
    """Основная функция анализатора"""
    
    if len(sys.argv) < 2:
        print("Использование: python analyzer.py <file1.py> [file2.py] ...")
        print("Пример: python analyzer.py task1.py task2.py")
        sys.exit(1)
    
    files_to_analyze = []
    
    # Обрабатываем аргументы командной строки
    for arg in sys.argv[1:]:
        if '*' in arg:
            # Поддержка wildcards
            files_to_analyze.extend(Path('.').glob(arg))
        else:
            files_to_analyze.append(Path(arg))
    
    # Фильтруем только Python файлы
    python_files = [f for f in files_to_analyze if f.suffix == '.py' and f.exists()]
    
    if not python_files:
        print("Не найдено Python файлов для анализа")
        sys.exit(1)
    
    print(f"Анализируем {len(python_files)} файл(ов)...")
    
    # Анализируем файлы
    analysis_results = []
    for filepath in python_files:
        print(f"  Анализ {filepath}...")
        result = analyze_file(filepath)
        analysis_results.append(result)
    
    # Генерируем данные для справочника
    reference_data = generate_reference_data(analysis_results)
    
    # Сохраняем результаты
    output_file = Path('functions_analysis.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'generated_at': '2026-01-08',
            'source_files': [str(f) for f in python_files],
            'analysis_results': analysis_results,
            'reference_functions': reference_data,
            'stats': {
                'files_analyzed': len(python_files),
                'functions_found': len(reference_data),
                'categories': len(set(func['category'] for func in reference_data))
            }
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\nАнализ завершен!")
    print(f"Результаты сохранены в: {output_file}")
    print(f"Статистика:")
    print(f"   - Файлов проанализировано: {len(python_files)}")
    print(f"   - Функций найдено: {len(reference_data)}")
    print(f"   - Категорий: {len(set(func['category'] for func in reference_data))}")
    
    # Показываем найденные категории
    categories = {}
    for func in reference_data:
        cat = func['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"   - По категориям:")
    for cat, count in categories.items():
        print(f"     {cat}: {count}")
    
    print(f"\nДля добавления в справочник:")
    print(f"   1. Откройте {output_file}")
    print(f"   2. Скопируйте данные из 'reference_functions'")
    print(f"   3. Используйте функцию импорта в веб-интерфейсе")

if __name__ == "__main__":
    main()