import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time

class HydroAcousticAppTests(unittest.TestCase):
    def setUp(self):
        # Ініціалізація драйвера Chrome
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(10)
        # Відкриваємо локальний файл
        self.driver.get('file:///Users/maksimgajduk/Documents/KPI/5 семестр/Quality of software testing/Проект/Interactive-Application-for-Learning-the-Installation-of-Hydroacoustic-Stations/index.html')
        
        # Реєстрація та логін перед кожним тестом
        self.register_and_login()
        
    def register_and_login(self):
        """Допоміжний метод для реєстрації та авторизації"""
        # Перехід на форму реєстрації
        toggle_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Зареєструватися')]")
        toggle_link.click()
        
        # Заповнення форми реєстрації
        username_field = self.driver.find_element(By.ID, "register-username")
        username_field.send_keys("testuser")
        
        password_field = self.driver.find_element(By.ID, "register-password")
        password_field.send_keys("password123")
        
        confirm_password_field = self.driver.find_element(By.ID, "register-confirm-password")
        confirm_password_field.send_keys("password123")
        
        # Клік по кнопці реєстрації
        register_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Зареєструватися')]")
        register_button.click()
        
        # Чекаємо повідомлення про успішну реєстрацію
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "notification"))
        )
        
        # Заповнення форми входу
        username_field = self.driver.find_element(By.ID, "login-username")
        username_field.send_keys("testuser")
        
        password_field = self.driver.find_element(By.ID, "login-password")
        password_field.send_keys("password123")
        
        # Клік по кнопці входу
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Увійти')]")
        login_button.click()
        
        # Чекаємо поки auth-container зникне
        WebDriverWait(self.driver, 10).until(
            EC.invisibility_of_element_located((By.ID, "auth-container"))
        )

    def test_1_login_functionality(self):
        """Тест функціональності авторизації"""
        # Перевіряємо, що auth-container не відображається
        auth_container = self.driver.find_element(By.ID, "auth-container")
        self.assertFalse(auth_container.is_displayed())
        
        # Перевіряємо, що кнопка виходу відображається
        logout_button = self.driver.find_element(By.CLASS_NAME, "logout-btn")
        self.assertTrue(logout_button.is_displayed())

    def test_2_navigation_tabs(self):
        """Тест навігації між вкладками"""
        # Знаходимо всі вкладки
        tabs = self.driver.find_elements(By.CLASS_NAME, "tab")
        
        # Клікаємо на вкладку "Відеоматеріали"
        video_tab = self.driver.find_element(By.XPATH, "//div[contains(@class, 'tab') and contains(text(), 'Відеоматеріали')]")
        video_tab.click()

        # Очікуємо, поки з'явиться контент відеоматеріалів
        video_content = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "video"))
        )

        # Перевіряємо, що контент відеоматеріалів відображається
        self.assertTrue(video_content.is_displayed())
        
        # Перевіряємо, що вкладка "Відеоматеріали" активна
        self.assertTrue("active" in video_tab.get_attribute("class"))

    def test_3_quiz_interaction(self):
        """Тест взаємодії з тестами"""
        # Переходимо на вкладку тестів
        tests_tab = self.driver.find_element(By.XPATH, "//div[contains(@class, 'tab') and contains(text(), 'Тести')]")
        tests_tab.click()

        # Очікуємо завантаження секції тестів
        quiz_section = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "tests"))
        )

        # Знаходимо та вибираємо відповідь на перше питання
        quiz_option = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".quiz-option"))
        )
        quiz_option.click()

        # Перевіряємо, що прогрес-бар оновився
        progress_bar = self.driver.find_element(By.CLASS_NAME, "quiz-progress-bar")
        self.assertNotEqual(progress_bar.get_attribute("style"), "width: 0%")

    def tearDown(self):
        # Очищаємо localStorage перед закриттям
        self.driver.execute_script("localStorage.clear();")
        # Закриваємо браузер після кожного тесту
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
