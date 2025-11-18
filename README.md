#  WEBSITE BÁN QUẦN ÁO

## ⚙️ Hướng dẫn cài đặt (Nên thực hiện đúng theo các bước để tránh bị lỗi!)

### 1. Cài đặt Node.js: https://nodejs.org/en (Bỏ qua nếu đã cài)
---
### 2. Tải dự án về:
   - **Cách 1:** Clone về bằng git: `git clone https://github.com/tnbu1204/MyWeb.git`
   - **Cách 2:** Tải file Zip: https://github.com/tnbu1204/MyWeb
   - 📁 Cấu trúc thư mục:
     ```plaintext
       yourFolder/
       ├─ backend/
       ├─ frontend/
       └─ myWeb.sql
     ```
---
### 3. Cài đặt sql:
   - Tạo Database và import file `myWeb.sql` (Charset: `utf8mb4_unicode_ci`)
   - Sau khi import sẽ có 5 tables:
     ```
     - cart
     - order_items
     - orders
     - products
     - users
     ```
---
### 4. Cài đặt các modules:
   - **Bước 1:** Kiểm tra policy (Cần để cho phép tải module qua npm)
     - Mở **PowerShell** với ***Run as Administrator***
     - Nhập lệnh `Get-ExecutionPolicy`
     - Nếu kết quả là `Restricted` thì nhập lệnh `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
     - <img width="962" height="148" alt="image" src="https://github.com/user-attachments/assets/e791e4fd-83f5-4b68-a65e-231def3c6d5d" />
     - Nhập `Y` để đồng ý
     - Nhập lệnh `Get-ExecutionPolicy` để kiểm tra lại nếu là `RemoteSigned` thì thành công

   - **Bước 2:** Cài đặt modules qua npm
     - Mở Visual Studio Code
     - Open source code (Ctrl + K + O) chọn folder chứa source code
     - Sau khi mở sẽ có cấu trúc thư mục như sau:
       ```plaintext
       yourFolder/
       ├─ backend/
       ├─ frontend/
       └─ myWeb.sql
       ```
     - Mở terminal (Ctrl + `)
     - Nhập lệnh `cd backend` đề điều hướng terminal đến folder `backend`
     - Sau đó nhập lệnh `npm instal` để cài đặt module cho backend
     - Mở thêm 1 cửa sổ terminal (Ctrl + Shift + `)
     - Nhập lệnh `cd frontend` đề điều hướng terminal đến folder `frontend`
     - Sau đó tiếp tục nhập lệnh `npm instal` để cài đặt module frontend
---
### 5. Chạy Server:
  - **Bước 1:** Config Database
     - Mở file `.env` trong `backend/`
     - `DB_HOST=` mặc định là `localhost`
     - `DB_USER=` mặc định là `root`
     - `DB_PASSWORD=` để trống nếu ko có password
     - `DB_NAME=` tên database của bạn
     - Lưu file lại (Ctrl + S)

   - Bước 2: Chạy Server
     - Mở terminal (Ctrl + `)
     - Nhập lệnh `cd backend` để điều hướng tới backend
     - Sau đó nhập lệnh `node server.js` để chạy backend
     - Kết quả khi thành công:
       <img width="767" height="64" alt="image" src="https://github.com/user-attachments/assets/0b46dc64-68d3-43e0-bdaf-c943266c4cdc" />
     - Mở thêm 1 cửa sổ terminal (Ctrl + Shift + `)
     - Nhập lệnh `cd frontend` đề điều hướng terminal đến folder `frontend`
     - Sau đó nhập lệnh `npm run dev` để chạy fronend
     - Kết quả khi thành công:
       <br><img width="448" height="109" alt="image" src="https://github.com/user-attachments/assets/97049514-8285-4352-b479-e1b413a7c5ac" />
     
