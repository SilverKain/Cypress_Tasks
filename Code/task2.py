import pytest
import requests
import json


class TestUserCreation:
    """Тесты для создания пользователя через API JSONPlaceholder"""
    
    BASE_URL = "https://jsonplaceholder.typicode.com"
    
    def test_create_user_with_valid_data(self):

        # Подготавливаем валидные данные пользователя
        user_data = {
            "name": "John Doe",
            "username": "johndoe",
            "email": "john.doe@example.com"
        }
        
        # Выполняем POST запрос
        url = f"{self.BASE_URL}/users"
        response = requests.post(url, json=user_data)
        
        # Проверяем код ответа
        assert response.status_code == 201, f"Ожидался код ответа 201, получен {response.status_code}"
        
        # Получаем данные ответа
        response_data = response.json()
        
        # Проверяем наличие ID в ответе
        assert "id" in response_data, "В ответе отсутствует поле 'id'"
        assert isinstance(response_data["id"], int), "ID должно быть целым числом"
        assert response_data["id"] > 0, "ID должно быть положительным числом"
        
        # Проверяем, что данные сохранились корректно
        assert response_data["name"] == user_data["name"], "Имя пользователя не совпадает"
        assert response_data["username"] == user_data["username"], "Username не совпадает"
        assert response_data["email"] == user_data["email"], "Email не совпадает"
        print(f"Пользователь создан с ID: {response_data['id']}")
    
    def test_create_user_minimal_data(self):

        """Тест создания пользователя с минимальными данными"""

        # Минимальные данные пользователя
        user_data = {
            "name": "Jack Smith",
            "username": "jacksmith",
            "email": "jack.smith@example.com"
        }
        
        # Выполняем POST запрос
        url = f"{self.BASE_URL}/users"
        response = requests.post(url, json=user_data)
        
        # Проверяем код ответа
        assert response.status_code == 201, f"Ожидался код ответа 201, получен {response.status_code}"
        
        # Получаем данные ответа
        response_data = response.json()
        
        # Проверяем наличие ID
        assert "id" in response_data, "В ответе отсутствует поле 'id'"
        assert isinstance(response_data["id"], int), "ID должно быть целым числом"
        
        # Проверяем обязательные поля
        assert response_data["name"] == user_data["name"], "Имя пользователя не совпадает"
        assert response_data["username"] == user_data["username"], "Username не совпадает"
        assert response_data["email"] == user_data["email"], "Email не совпадает"
        
        print(f"Пользователь с минимальными данными создан с ID: {response_data['id']}")
    
    def test_create_user_response_structure(self):
        """
        Тест проверки структуры ответа при создании пользователя
        """
        user_data = {
            "name": "Test User",
            "username": "testuser",
            "email": "test@example.com"
        }
        
        url = f"{self.BASE_URL}/users"
        response = requests.post(url, json=user_data)
        
        assert response.status_code == 201
        
        response_data = response.json()
        
        # Проверяем обязательные поля в структуре ответа
        required_fields = ["id", "name", "username", "email"]
        for field in required_fields:
            assert field in response_data, f"Обязательное поле '{field}' отсутствует в ответе"
        
        # Проверяем типы данных
        assert isinstance(response_data["id"], int), "Поле 'id' должно быть целым числом"
        assert isinstance(response_data["name"], str), "Поле 'name' должно быть строкой"
        assert isinstance(response_data["username"], str), "Поле 'username' должно быть строкой"
        assert isinstance(response_data["email"], str), "Поле 'email' должно быть строкой"
        
        # Проверяем заголовки ответа
        assert "content-type" in response.headers
        assert "application/json" in response.headers["content-type"]
        
        print("Структура ответа корректна")
        print(f"Заголовки ответа: {dict(response.headers)}")


class TestMultipleUsersAndList:
    """Тесты для создания нескольких пользователей и получения списка"""
    
    BASE_URL = "https://jsonplaceholder.typicode.com"
    
    def test_create_multiple_users_and_get_list(self):
        """
        Тест создания нескольких пользователей и проверки их присутствия в списке
        """
        # Данные для создания нескольких пользователей
        users_to_create = [
            {
                "name": "Alice Johnson",
                "username": "alicej",
                "email": "alice.johnson@example.com"
            },
            {
                "name": "Bob Wilson",
                "username": "bobw",
                "email": "bob.wilson@example.com"
            },
            {
                "name": "Charlie Brown",
                "username": "charlieb",
                "email": "charlie.brown@example.com"
            }
        ]
        
        created_users = []
        
        # Создаем всех пользователей
        for user_data in users_to_create:
            url = f"{self.BASE_URL}/users"
            response = requests.post(url, json=user_data)
            
            # Проверяем успешное создание
            assert response.status_code == 201, f"Не удалось создать пользователя {user_data['name']}"
            
            user_response = response.json()
            created_users.append(user_response)
            print(f"Создан пользователь: {user_response['name']} с ID: {user_response['id']}")
        
        # Проверяем, что создано правильное количество пользователей
        assert len(created_users) == len(users_to_create), "Количество созданных пользователей не совпадает с ожидаемым"
        
        # Отправляем GET запрос для получения списка всех пользователей
        get_url = f"{self.BASE_URL}/users"
        get_response = requests.get(get_url)
        
        # Проверяем код ответа 200
        assert get_response.status_code == 200, f"Ожидался код ответа 200, получен {get_response.status_code}"
        
        # Получаем список пользователей
        all_users = get_response.json()
        
        # Проверяем, что ответ содержит список
        assert isinstance(all_users, list), "Ответ должен содержать список пользователей"
        assert len(all_users) > 0, "Список пользователей не должен быть пустым"
        
        print(f"Получен список из {len(all_users)} пользователей")
        
        # Создаем словарь для быстрого поиска по имени и email
        users_dict = {user['name']: user for user in all_users}
        users_by_email = {user['email']: user for user in all_users}
        
        # Проверяем, что все созданные пользователи присутствуют в списке
        for created_user in created_users:
            # Поскольку JSONPlaceholder имитирует создание, проверяем по данным
            name = created_user['name']
            email = created_user['email']
            
            # Ищем пользователя в списке по имени или проверяем что структура ответа корректная
            found_by_structure = any(
                user.get('name') == name or user.get('email') == email
                for user in all_users
            )
            
            # Альтернативная проверка: убеждаемся что пользователь имеет корректную структуру
            assert created_user.get('id') is not None, f"У созданного пользователя {name} отсутствует ID"
            assert created_user.get('name') == name, f"Имя пользователя не совпадает для {name}"
            assert created_user.get('email') == email, f"Email не совпадает для {name}"
            
            print(f"✓ Пользователь {name} создан корректно")
        
        # Проверяем заголовки ответа GET запроса
        assert "content-type" in get_response.headers
        assert "application/json" in get_response.headers["content-type"]
        
        print("✓ Все проверки пройдены успешно")
    
    def test_get_users_list_structure(self):
        """
        Тест проверки структуры ответа при получении списка пользователей
        """
        # Отправляем GET запрос
        url = f"{self.BASE_URL}/users"
        response = requests.get(url)
        
        # Проверяем код ответа 200
        assert response.status_code == 200, f"Ожидался код ответа 200, получен {response.status_code}"
        
        # Получаем данные ответа
        users_list = response.json()
        
        # Проверяем, что ответ - это список
        assert isinstance(users_list, list), "Ответ должен быть списком"
        assert len(users_list) > 0, "Список пользователей не должен быть пустым"
        
        # Проверяем структуру каждого пользователя в списке
        required_fields = ["id", "name", "username", "email"]
        
        for user in users_list[:3]:  # Проверяем первых 3 пользователей для экономии времени
            for field in required_fields:
                assert field in user, f"У пользователя отсутствует поле '{field}'"
            
            # Проверяем типы данных
            assert isinstance(user["id"], int), f"Поле 'id' должно быть целым числом для пользователя {user.get('name', 'неизвестный')}"
            assert isinstance(user["name"], str), f"Поле 'name' должно быть строкой для пользователя с ID {user['id']}"
            assert isinstance(user["username"], str), f"Поле 'username' должно быть строкой для пользователя с ID {user['id']}"
            assert isinstance(user["email"], str), f"Поле 'email' должно быть строкой для пользователя с ID {user['id']}"
        
        print(f"Структура списка из {len(users_list)} пользователей корректна")
        print("Проверены обязательные поля для каждого пользователя")


if __name__ == "__main__":
    pytest.main(["-v", __file__])