# 📚 API Documentation - E-commerce Backend

## 🏗️ Tổng quan hệ thống

**Framework**: NestJS (Node.js + TypeScript)  
**Database**: PostgreSQL với TypeORM  
**Authentication**: JWT (JSON Web Tokens)  
**Documentation**: Swagger/OpenAPI  
**Version**: 0.0.1

## 🔗 Base URL
```
http://localhost:3000
```

## 🔐 Authentication

Hệ thống sử dụng JWT tokens cho xác thực. Có 2 loại người dùng:
- **Customer**: Người dùng thông thường
- **Admin**: Quản trị viên

### Default Admin Account
- **Username**: admin
- **Password**: admin123

---

# 📡 API Endpoints (Tổng cộng: 60+ endpoints)

## 1. 🔐 Authentication APIs (4 endpoints)

### POST `/auth/register`
**Mô tả**: Đăng ký tài khoản người dùng mới  
**Quyền truy cập**: Public  
**Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string"
}
```
**Response**: `201 Created`
```json
{
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "createdAt": "string"
  },
  "access_token": "string"
}
```

### POST `/auth/login`
**Mô tả**: Đăng nhập người dùng  
**Quyền truy cập**: Public  
**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**: `200 OK`
```json
{
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  },
  "access_token": "string"
}
```

### POST `/auth/admin/login`
**Mô tả**: Đăng nhập admin  
**Quyền truy cập**: Public  
**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
**Response**: `200 OK`
```json
{
  "admin": {
    "id": "number",
    "username": "string"
  },
  "access_token": "string"
}
```

### GET `/auth/profile`
**Mô tả**: Lấy thông tin profile người dùng hiện tại  
**Quyền truy cập**: Authenticated  
**Headers**: `Authorization: Bearer <token>`  
**Response**: `200 OK`
```json
{
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "createdAt": "string"
  }
}
```

---

## 2. 👤 User Management APIs (5 endpoints)

### GET `/users`
**Mô tả**: Lấy danh sách tất cả người dùng  
**Quyền truy cập**: Admin only  
**Headers**: `Authorization: Bearer <admin_token>`  
**Response**: `200 OK`
```json
[
  {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "createdAt": "string"
  }
]
```

### GET `/users/:id`
**Mô tả**: Lấy thông tin người dùng theo ID  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - User ID  
**Response**: `200 OK`

### POST `/users`
**Mô tả**: Tạo người dùng mới (Admin)  
**Quyền truy cập**: Admin only  
**Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

### PATCH `/users/:id`
**Mô tả**: Cập nhật thông tin người dùng  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - User ID  

### DELETE `/users/:id`
**Mô tả**: Xóa người dùng  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - User ID  

---

## 3. 🏷️ Category Management APIs (5 endpoints)

### GET `/categories`
**Mô tả**: Lấy danh sách tất cả danh mục  
**Quyền truy cập**: Public  
**Response**: `200 OK`
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "createdAt": "string"
  }
]
```

### GET `/categories/:id`
**Mô tả**: Lấy thông tin danh mục theo ID  
**Quyền truy cập**: Public  
**Parameters**: `id` (number) - Category ID  

### POST `/categories`
**Mô tả**: Tạo danh mục mới  
**Quyền truy cập**: Admin only  
**Request Body**:
```json
{
  "name": "string",
  "description": "string"
}
```

### PATCH `/categories/:id`
**Mô tả**: Cập nhật danh mục  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Category ID  

### DELETE `/categories/:id`
**Mô tả**: Xóa danh mục  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Category ID  

---

## 4. 🛍️ Product Management APIs (5 endpoints)

### GET `/products`
**Mô tả**: Lấy danh sách sản phẩm với tìm kiếm, lọc và phân trang nâng cao  
**Quyền truy cập**: Public  
**Query Parameters**:
- `categoryId` (optional): Lọc theo danh mục
- `search` (optional): Tìm kiếm theo tên hoặc mô tả
- `minPrice` (optional): Giá tối thiểu
- `maxPrice` (optional): Giá tối đa
- `page` (optional, default: 1): Trang hiện tại
- `limit` (optional, default: 10): Số sản phẩm mỗi trang
- `sortBy` (optional, default: createdAt): Sắp xếp theo (name, price, createdAt)
- `sortOrder` (optional, default: DESC): Thứ tự (ASC, DESC)

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "imageUrl": "string",
      "category": {
        "id": "number",
        "name": "string"
      },
      "createdAt": "string"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

### GET `/products/:id`
**Mô tả**: Lấy thông tin chi tiết sản phẩm  
**Quyền truy cập**: Public  
**Parameters**: `id` (number) - Product ID  

### POST `/products`
**Mô tả**: Tạo sản phẩm mới  
**Quyền truy cập**: Admin only  
**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "imageUrl": "string",
  "categoryId": "number"
}
```

### PATCH `/products/:id`
**Mô tả**: Cập nhật sản phẩm  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Product ID  

### DELETE `/products/:id`
**Mô tả**: Xóa sản phẩm  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Product ID  

---

## 5. 🛒 Shopping Cart APIs (5 endpoints)

### GET `/cart`
**Mô tả**: Lấy giỏ hàng của người dùng  
**Quyền truy cập**: Authenticated  
**Response**: `200 OK`
```json
[
  {
    "id": "number",
    "quantity": "number",
    "product": {
      "id": "number",
      "name": "string",
      "price": "number",
      "imageUrl": "string"
    },
    "totalPrice": "number"
  }
]
```

### POST `/cart`
**Mô tả**: Thêm sản phẩm vào giỏ hàng  
**Quyền truy cập**: Authenticated  
**Request Body**:
```json
{
  "productId": "number",
  "quantity": "number"
}
```

### PATCH `/cart/:id`
**Mô tả**: Cập nhật số lượng sản phẩm trong giỏ  
**Quyền truy cập**: Authenticated  
**Parameters**: `id` (number) - Cart item ID  
**Request Body**:
```json
{
  "quantity": "number"
}
```

### DELETE `/cart/:id`
**Mô tả**: Xóa sản phẩm khỏi giỏ hàng  
**Quyền truy cập**: Authenticated  
**Parameters**: `id` (number) - Cart item ID  

### DELETE `/cart`
**Mô tả**: Xóa toàn bộ giỏ hàng  
**Quyền truy cập**: Authenticated  

---

## 6. 📦 Order Management APIs (7 endpoints)

### POST `/orders`
**Mô tả**: Tạo đơn hàng mới  
**Quyền truy cập**: Authenticated  
**Request Body**:
```json
{
  "items": [
    {
      "productId": "number",
      "quantity": "number",
      "price": "number"
    }
  ],
  "shippingAddress": "string",
  "paymentMethod": "string"
}
```

### POST `/orders/from-cart`
**Mô tả**: Tạo đơn hàng từ giỏ hàng hiện tại  
**Quyền truy cập**: Authenticated  
**Request Body**:
```json
{
  "shippingAddress": "string",
  "paymentMethod": "string"
}
```

### GET `/orders`
**Mô tả**: Lấy tất cả đơn hàng  
**Quyền truy cập**: Admin only  
**Response**: `200 OK`
```json
[
  {
    "id": "number",
    "status": "string",
    "totalAmount": "number",
    "shippingAddress": "string",
    "paymentMethod": "string",
    "user": {
      "id": "number",
      "firstName": "string",
      "lastName": "string"
    },
    "items": [
      {
        "id": "number",
        "quantity": "number",
        "price": "number",
        "product": {
          "id": "number",
          "name": "string"
        }
      }
    ],
    "createdAt": "string"
  }
]
```

### GET `/orders/my-orders`
**Mô tả**: Lấy đơn hàng của người dùng hiện tại  
**Quyền truy cập**: Authenticated  

### GET `/orders/:id`
**Mô tả**: Lấy thông tin chi tiết đơn hàng  
**Quyền truy cập**: Authenticated  
**Parameters**: `id` (number) - Order ID  

### PATCH `/orders/:id`
**Mô tả**: Cập nhật trạng thái đơn hàng  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Order ID  
**Request Body**:
```json
{
  "status": "pending | processing | shipped | delivered | cancelled"
}
```

### DELETE `/orders/:id`
**Mô tả**: Hủy/Xóa đơn hàng  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Order ID  

---

## 7. ⭐ Review Management APIs (6 endpoints)

### GET `/reviews`
**Mô tả**: Lấy tất cả đánh giá  
**Quyền truy cập**: Public  
**Query Parameters**:
- `productId` (optional): Lọc theo sản phẩm

### GET `/reviews/my-reviews`
**Mô tả**: Lấy đánh giá của người dùng hiện tại  
**Quyền truy cập**: Authenticated  

### GET `/reviews/:id`
**Mô tả**: Lấy thông tin đánh giá theo ID  
**Quyền truy cập**: Public  
**Parameters**: `id` (number) - Review ID  

### POST `/reviews`
**Mô tả**: Tạo đánh giá mới  
**Quyền truy cập**: Authenticated  
**Request Body**:
```json
{
  "productId": "number",
  "rating": "number (1-5)",
  "comment": "string"
}
```

### PATCH `/reviews/:id`
**Mô tả**: Cập nhật đánh giá của mình  
**Quyền truy cập**: Authenticated (chỉ chủ sở hữu)  
**Parameters**: `id` (number) - Review ID  

### DELETE `/reviews/:id`
**Mô tả**: Xóa đánh giá của mình  
**Quyền truy cập**: Authenticated (chỉ chủ sở hữu)  
**Parameters**: `id` (number) - Review ID  

---

## 8. ❤️ Wishlist Management APIs (5 endpoints)

### GET `/wishlists`
**Mô tả**: Lấy danh sách yêu thích của người dùng  
**Quyền truy cập**: Authenticated  
**Response**: `200 OK`
```json
[
  {
    "id": "number",
    "product": {
      "id": "number",
      "name": "string",
      "price": "number",
      "imageUrl": "string"
    },
    "createdAt": "string"
  }
]
```

### POST `/wishlists`
**Mô tả**: Thêm sản phẩm vào danh sách yêu thích  
**Quyền truy cập**: Authenticated  
**Request Body**:
```json
{
  "productId": "number"
}
```

### GET `/wishlists/check/:productId`
**Mô tả**: Kiểm tra sản phẩm có trong danh sách yêu thích không  
**Quyền truy cập**: Authenticated  
**Parameters**: `productId` (number) - Product ID  

### DELETE `/wishlists/:id`
**Mô tả**: Xóa sản phẩm khỏi danh sách yêu thích  
**Quyền truy cập**: Authenticated  
**Parameters**: `id` (number) - Wishlist item ID  

### DELETE `/wishlists`
**Mô tả**: Xóa toàn bộ danh sách yêu thích  
**Quyền truy cập**: Authenticated  

---

## 9. 💳 Payment Management APIs (6 endpoints)

### GET `/payments`
**Mô tả**: Lấy tất cả thanh toán  
**Quyền truy cập**: Admin only  
**Query Parameters**:
- `orderId` (optional): Lọc theo đơn hàng

### GET `/payments/my-payments`
**Mô tả**: Lấy thanh toán của người dùng hiện tại  
**Quyền truy cập**: Authenticated  

### GET `/payments/:id`
**Mô tả**: Lấy thông tin thanh toán theo ID  
**Quyền truy cập**: Authenticated  
**Parameters**: `id` (number) - Payment ID  

### POST `/payments`
**Mô tả**: Tạo thanh toán mới  
**Quyền truy cập**: Authenticated  
**Request Body**:
```json
{
  "orderId": "number",
  "amount": "number",
  "paymentMethod": "string",
  "paymentDetails": "object"
}
```

### PATCH `/payments/:id`
**Mô tả**: Cập nhật trạng thái thanh toán  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Payment ID  
**Request Body**:
```json
{
  "status": "pending | completed | failed | refunded"
}
```

### DELETE `/payments/:id`
**Mô tả**: Xóa thanh toán  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Payment ID  

---

## 10. 🚚 Shipment Management APIs (6 endpoints)

### GET `/shipments`
**Mô tả**: Lấy tất cả vận chuyển  
**Quyền truy cập**: Admin only  
**Query Parameters**:
- `orderId` (optional): Lọc theo đơn hàng

### GET `/shipments/:id`
**Mô tả**: Lấy thông tin vận chuyển theo ID  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Shipment ID  

### GET `/shipments/track/:trackingNumber`
**Mô tả**: Theo dõi vận chuyển bằng mã tracking  
**Quyền truy cập**: Public  
**Parameters**: `trackingNumber` (string) - Tracking number  
**Response**: `200 OK`
```json
{
  "id": "number",
  "trackingNumber": "string",
  "status": "string",
  "carrier": "string",
  "shippingAddress": "string",
  "estimatedDelivery": "string",
  "actualDelivery": "string",
  "order": {
    "id": "number",
    "totalAmount": "number"
  }
}
```

### POST `/shipments`
**Mô tả**: Tạo vận chuyển mới  
**Quyền truy cập**: Admin only  
**Request Body**:
```json
{
  "orderId": "number",
  "carrier": "string",
  "trackingNumber": "string",
  "shippingAddress": "string",
  "estimatedDelivery": "string"
}
```

### PATCH `/shipments/:id`
**Mô tả**: Cập nhật vận chuyển  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Shipment ID  

### DELETE `/shipments/:id`
**Mô tả**: Xóa vận chuyển  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Shipment ID  

---

## 11. 📊 Statistics APIs (4 endpoints)

### GET `/statistics/overview`
**Mô tả**: Lấy thống kê tổng quan dashboard  
**Quyền truy cập**: Admin only  
**Response**: `200 OK`
```json
{
  "totalUsers": "number",
  "totalProducts": "number",
  "totalOrders": "number",
  "totalRevenue": "number",
  "pendingOrders": "number",
  "completedOrders": "number",
  "lowStockProducts": "number"
}
```

### GET `/statistics/sales`
**Mô tả**: Lấy thống kê bán hàng  
**Quyền truy cập**: Admin only  
**Response**: `200 OK`
```json
{
  "dailySales": [
    {
      "date": "string",
      "revenue": "number",
      "orders": "number"
    }
  ],
  "monthlySales": [
    {
      "month": "string",
      "revenue": "number",
      "orders": "number"
    }
  ],
  "orderStatusDistribution": {
    "pending": "number",
    "processing": "number",
    "shipped": "number",
    "delivered": "number",
    "cancelled": "number"
  }
}
```

### GET `/statistics/products`
**Mô tả**: Lấy thống kê sản phẩm  
**Quyền truy cập**: Admin only  
**Response**: `200 OK`
```json
{
  "topSellingProducts": [
    {
      "product": {
        "id": "number",
        "name": "string"
      },
      "totalSold": "number",
      "revenue": "number"
    }
  ],
  "categoryDistribution": [
    {
      "category": {
        "id": "number",
        "name": "string"
      },
      "productCount": "number",
      "totalSales": "number"
    }
  ],
  "lowStockAlerts": [
    {
      "id": "number",
      "name": "string",
      "stock": "number"
    }
  ]
}
```

### GET `/statistics/users`
**Mô tả**: Lấy thống kê người dùng  
**Quyền truy cập**: Admin only  
**Response**: `200 OK`
```json
{
  "userRegistrationTrends": [
    {
      "date": "string",
      "newUsers": "number"
    }
  ],
  "activeUsers": "number",
  "totalUsers": "number"
}
```

---

## 12. 📞 Contact Management APIs (6 endpoints)

### POST `/contacts`
**Mô tả**: Gửi form liên hệ  
**Quyền truy cập**: Public  
**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "category": "inquiry | support | complaint | feedback"
}
```

### GET `/contacts`
**Mô tả**: Lấy tất cả tin nhắn liên hệ  
**Quyền truy cập**: Admin only  
**Response**: `200 OK`
```json
[
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string",
    "category": "string",
    "status": "pending | in_progress | resolved | closed",
    "createdAt": "string"
  }
]
```

### GET `/contacts/my-contacts`
**Mô tả**: Lấy tin nhắn liên hệ của người dùng hiện tại  
**Quyền truy cập**: Authenticated  

### GET `/contacts/:id`
**Mô tả**: Lấy thông tin tin nhắn liên hệ theo ID  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Contact ID  

### PATCH `/contacts/:id`
**Mô tả**: Cập nhật trạng thái tin nhắn liên hệ  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Contact ID  
**Request Body**:
```json
{
  "status": "pending | in_progress | resolved | closed"
}
```

### DELETE `/contacts/:id`
**Mô tả**: Xóa tin nhắn liên hệ  
**Quyền truy cập**: Admin only  
**Parameters**: `id` (number) - Contact ID  

---

## 13. 🏠 General APIs (1 endpoint)

### GET `/`
**Mô tả**: Health check endpoint  
**Quyền truy cập**: Public  
**Response**: `200 OK`
```
"Hello World!"
```

---

# 📋 HTTP Status Codes

## Success Codes
- **200 OK**: Yêu cầu thành công
- **201 Created**: Tạo mới thành công

## Client Error Codes
- **400 Bad Request**: Dữ liệu đầu vào không hợp lệ
- **401 Unauthorized**: Chưa xác thực hoặc token không hợp lệ
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Không tìm thấy tài nguyên
- **409 Conflict**: Xung đột dữ liệu (email đã tồn tại, đã đánh giá sản phẩm...)

## Server Error Codes
- **500 Internal Server Error**: Lỗi máy chủ

---

# 🔒 Authorization Levels

## Public
- Không cần xác thực
- Có thể truy cập bởi bất kỳ ai

## Authenticated
- Cần JWT token hợp lệ
- Cho cả Customer và Admin

## Admin Only
- Cần JWT token của Admin
- Chỉ dành cho quản trị viên

## Owner Only
- Cần JWT token và phải là chủ sở hữu tài nguyên
- Ví dụ: chỉnh sửa đánh giá của chính mình

---

# 🌐 CORS & Security

- **CORS**: Được bật cho phép frontend truy cập
- **Password Hashing**: Sử dụng bcrypt
- **JWT Expiration**: Token có thời hạn sử dụng
- **Input Validation**: Sử dụng class-validator
- **SQL Injection Protection**: TypeORM ORM bảo vệ

---

# 📖 Swagger Documentation

Truy cập Swagger UI tại: `http://localhost:3000/api`

Swagger cung cấp:
- Interactive API testing
- Detailed request/response schemas
- Authentication testing
- Real-time API exploration

---

# 🚀 Quick Start

1. **Clone repository**
2. **Install dependencies**: `npm install`
3. **Setup database**: PostgreSQL
4. **Configure environment**: `.env` file
5. **Run application**: `npm run start:dev`
6. **Access Swagger**: `http://localhost:3000/api`

---

**Tổng số endpoints**: **60+ APIs**  
**Modules**: **12 modules chính**  
**Authentication**: **JWT-based**  
**Database**: **PostgreSQL với TypeORM**  
**Documentation**: **Swagger/OpenAPI**
