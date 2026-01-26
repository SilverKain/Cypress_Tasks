import pytest
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import random
import time

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    driver.implicitly_wait(5)

    driver.get("https://practice.expandtesting.com/register")
    yield driver
    driver.quit()

"""Проверка загрузки страницы и наличия элементов"""
def test_register_page_elements(driver):

    # Проверка заголовка страницы
    assert "Register" in driver.title

    # Проверяем наличие основных элементов
    wait = WebDriverWait(driver, 10)

    # Проверка наличия полей формы
    assert driver.find_element(By.NAME, "username").is_displayed()
    assert driver.find_element(By.NAME, "password").is_displayed()
    assert driver.find_element(By.NAME, "confirmPassword").is_displayed()

    # Проверка кнопки Register
    assert driver.find_element(By.XPATH, "//button[text()='Register']").is_displayed()

"""Проверка регистрация с валидными данными"""    
def test_registration (driver):
    wait = WebDriverWait(driver, 10)

    # Генерация уникального имени пользователя
    #unique_id = random.randint(1000, 9999)
    username = f"user{random.randint(1000, 9999)}"
    password = "Password123!"

    # Заполнение формы регистрации
    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.NAME, "confirmPassword").send_keys(password)
   
    register_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Register']"))
    )

    # Скролл к кнопке Register

    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", register_button)  
    time.sleep(3)

    # Нажатие кнопки Register

    driver.find_element(By.XPATH, "//button[text()='Register']").click()

    # Проверка успешной регистрации
    assert (
        "success" in driver.page_source.lower()
        or "registered" in driver.page_source.lower()
        or driver.current_url != "https://practice.expandtesting.com/register"
    )

"""Проверка регистрации с пустыми полями"""    
def test_registration_empty_fields(driver):
    wait = WebDriverWait(driver, 10)

    # Оставляем все поля пустыми
    register_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Register']"))
    )

    # Скролл к кнопке Register

    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", register_button)  
    time.sleep(3)

    # Нажатие кнопки Register

    driver.find_element(By.XPATH, "//button[text()='Register']").click()

    # Проверяем, что остались на той же странице
    time.sleep(2)
    assert "register" in driver.current_url.lower()

"""Проверка регистрации с несовпадающими паролями"""
def test_registration_mismatched_passwords(driver):
    wait = WebDriverWait(driver, 10)

    username = "user123"
    password1 = "Password123!"
    password2 = "Password1234!"  

    # Заполнение формы регистрации
    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password1)
    driver.find_element(By.NAME, "confirmPassword").send_keys(password2)
   
    register_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Register']"))
    )

    # Скролл к кнопке Register

    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", register_button)  
    time.sleep(3)

    # Нажатие кнопки Register

    driver.find_element(By.XPATH, "//button[text()='Register']").click()

    # Проверяем, что остались на той же странице
    time.sleep(2)
    assert "register" in driver.current_url.lower()

"""Проверка регистрации с коротким именем пользователя"""
def test_registration_short_username(driver):
    wait = WebDriverWait(driver, 10)

    username = "qw"
    password = "Password123!"

    # Заполнение формы регистрации
    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.NAME, "confirmPassword").send_keys(password)
   
    register_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Register']"))
    )

    # Скролл к кнопке Register

    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", register_button)  
    time.sleep(3)

    # Нажатие кнопки Register

    driver.find_element(By.XPATH, "//button[text()='Register']").click()

    # Проверяем, что остались на той же странице
    time.sleep(2)
    assert "register" in driver.current_url.lower()

"""Проверка регистрации с коротким паролем пользователя"""
def test_registration_short_password(driver):
    wait = WebDriverWait(driver, 10)

    username = "user123"
    password = "123"

    # Заполнение формы регистрации
    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.NAME, "confirmPassword").send_keys(password)
   
    register_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Register']"))
    )

    # Скролл к кнопке Register

    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", register_button)  
    time.sleep(3)

    # Нажатие кнопки Register

    driver.find_element(By.XPATH, "//button[text()='Register']").click()

    # Проверяем, что остались на той же странице
    time.sleep(2)
    assert "register" in driver.current_url.lower()

    """Проверка регистрации с специальными символами в имени пользователя"""
def test_registration_special_characters_username(driver):
    wait = WebDriverWait(driver, 10)

    username = "user!@#"
    password = "Password123!"

    # Заполнение формы регистрации
    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.NAME, "confirmPassword").send_keys(password)
   
    register_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Register']"))
    )

    # Скролл к кнопке Register

    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", register_button)  
    time.sleep(3)

    # Нажатие кнопки Register

    driver.find_element(By.XPATH, "//button[text()='Register']").click()

    # Проверяем, что остались на той же странице
    time.sleep(2)
    assert "register" in driver.current_url.lower()

"""Проверка регистрации с существующим именем пользователя"""
def test_registration_existing_username(driver):
    wait = WebDriverWait(driver, 10)

    username = "admin"
    password = "Password123!"

    # Заполнение формы регистрации
    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.NAME, "confirmPassword").send_keys(password)
   
    register_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Register']"))
    )

    # Скролл к кнопке Register

    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", register_button)  
    time.sleep(3)

    # Нажатие кнопки Register

    driver.find_element(By.XPATH, "//button[text()='Register']").click()

    # Проверяем, что остались на той же странице
    time.sleep(2)
    assert "register" in driver.current_url.lower()

if __name__ == "__main__":
    pytest.main(["-v", __file__])