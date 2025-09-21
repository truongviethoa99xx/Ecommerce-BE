# NestJS E-commerce Backend - AI Agent Specification

## Mục tiêu

Xây dựng một API backend hoàn chỉnh bằng NestJS để phục vụ cho một hệ thống bán hàng online. Agent cần:

- Tạo đầy đủ các module, controller, service cho các tính năng sau:
  - Users (đăng ký, đăng nhập, JWT, phân quyền Admin/Customer)
  - Products (CRUD)
  - Categories (CRUD)
  - Orders & Order Items
  - Cart
  - Payments
  - Shippings
  - Reviews
  - Contacts
  - Auth (JWT, Guard)
  - Swagger document

## Ràng buộc

- Sử dụng TypeORM + PostgreSQL
- Entity đặt đúng tên và field như trong sơ đồ DB
- Mỗi controller cần có Swagger decorator đầy đủ
- Dùng DTO, ValidationPipe
- Đảm bảo chạy được bằng `npm run start:dev` mà không lỗi
- Tự động sửa lỗi nếu có khi chạy
- Tạo sẵn một `.env.example`
- Nếu thiếu dependency thì tự động cài bằng npm
- Khi xong phải hiển thị: ✅ Project đã sẵn sàng

## Luồng hoạt động

1. Cài các package sau:
   - @nestjs/swagger
   - class-validator
   - class-transformer
   - @nestjs/typeorm
   - pg
   - bcrypt
   - jsonwebtoken
   - dotenv
2. Tạo database từ entity dựa vào file database.sql
3. Tạo cấu trúc module theo tính năng
4. Tạo file main.ts tích hợp Swagger
5. Tạo các entity từ mô hình đã cho
6. Tạo controller, service, DTO tương ứng
7. Chạy `npm run start:dev` và fix lỗi nếu có
8. Kiểm tra lại toàn bộ bằng Swagger UI
