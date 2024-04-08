import requests
from bs4 import BeautifulSoup
import csv

# URL của trang web cần crawl
url = "https://www.klook.com/vi/experiences/list/tours/cate9/?spm=Home.CategoryBar_L2_LIST&clickId=4d81f3b700"

# Gửi request đến trang web và lấy nội dung HTML
response = requests.get(url)
html_content = response.content

# Sử dụng BeautifulSoup để phân tích HTML
soup = BeautifulSoup(html_content, "html.parser")

# Mở một file CSV để ghi dữ liệu
try:
    with open("tours.csv", "w", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        # Ghi tiêu đề cho các cột
        writer.writerow(["Title", "Location", "Price"])

        # Tìm tất cả các phần tử chứa thông tin về các tour
        tour_elements = soup.find_all("div", class_="common_tile_body_1a7w6b8")

        # Lặp qua từng tour và ghi thông tin của chúng vào file CSV
        for tour in tour_elements:
            tour_title = tour.find("h2", class_="title_2e5bbzld").text.strip()
            tour_location = tour.find("div", class_="location_3yT13NYe").text.strip()
            tour_price = tour.find("div", class_="from_text_15lj33m3").text.strip()
            writer.writerow([tour_title, tour_location, tour_price])

    print("Dữ liệu đã được ghi vào file 'tours.csv' thành công.")
except Exception as e:
    print("Đã xảy ra lỗi khi ghi dữ liệu vào file CSV:", e)
