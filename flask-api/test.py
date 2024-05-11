from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Khởi tạo WebDriver
driver = webdriver.Chrome(executable_path='./text.txt')

# Mở trang web
driver.get("https://www.klook.com/vi/")

# Chờ cho các phần tử được load trong 10 giây
wait = WebDriverWait(driver, 10)

# Tìm tất cả các phần tử có class 'product-card-name' (chứa tên của tour du lịch)
tour_elements = wait.until(EC.visibility_of_all_elements_located((By.CLASS_NAME, "product-card-name")))

# In ra tên của các tour du lịch
for tour_element in tour_elements:
    print(tour_element.text)

# Đóng trình duyệt
driver.quit()
