# Document CIMS Client

## Tổng quan:

- Giao diện hệ thống quản trị nhân viên được xây dựng bằng công nghệ ReactJS + Typescript
- Nodejs Version 23.14.1
- ReactJS Version 19 + ViteJS Version 6

## Giao diện chính:

- Đăng nhập thành viên
- Quản lý khách hàng
- Quản lý hiệu quả kinh doanh
- Quản lý hoạt động
- Quản lý thành viên

## Module User:

1. Task: Viết giao diện đăng nhập hệ thống (5/6/2025)

- Chuẩn hóa dữ liệu nhập vào khi đăng nhập với React hook form + Yup validator bao gồm email + password + term
- Chức năng: Reset form khi người dùng click vào icon close, chức năng show + hidden mật khẩu, đang ngôn ngữ với i18n + react-i18next + giao diện dark mode với Shadcn UI

2: Task: Viết UI danh sách user + thêm mới user + phân trang + sidebar admin + update profile user (6/6/2025)

3: Task: Xử lý lỗi toast sonner + update version package nodejs (7/6/2025)

4: Task: Xử lý cập nhật trang edit user + khắc phục các lỗi liên quan tới typescript ở các component table và user list + xử lý phân trang và search cho api user (9/6/2025)

5: Task: Thay đổi cấu trúc giá trị của trường token trong bảng refresh token và tiến hành đánh dấu index unique cho table refresh token, tiến hành thêm api get me và xử lý chuyển Database từ SQL Lite sang Mysql và quản lý cơ sở dữ liệu bằng Laragon + Phpmyadmin tool
