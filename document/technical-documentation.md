# E-commerce Backend - Technical Documentation

## 🚀 Overview

This is a comprehensive e-commerce backend API built with NestJS, TypeORM, and PostgreSQL. The system provides a complete set of RESTful APIs for managing an online store including user authentication, product catalog, shopping cart, orders, payments, and shipping.

## 🏗️ Architecture

### Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

### Project Structure

```
src/
├── entities/               # TypeORM entities
│   ├── user.entity.ts
│   ├── product.entity.ts
│   ├── category.entity.ts
│   ├── order.entity.ts
│   ├── order-item.entity.ts
│   ├── cart.entity.ts
│   ├── payment.entity.ts
│   ├── shipment.entity.ts
│   ├── review.entity.ts
│   ├── wishlist.entity.ts
│   └── admin.entity.ts
├── auth/                   # Authentication module
├── users/                  # User management
├── products/               # Product management
├── categories/             # Category management
├── cart/                   # Shopping cart
├── orders/                 # Order management
├── payments/               # Payment processing
├── shipments/              # Shipping management
├── reviews/                # Product reviews
├── wishlists/              # User wishlists
├── app.module.ts          # Root module
└── main.ts                # Application entry point
```

## 📊 Database Schema

### Core Entities

#### Users
- **id**: Primary key
- **username**: Unique username
- **email**: Unique email address
- **password**: Hashed password
- **fullName**: User's full name
- **phone**: Phone number
- **address**: Address information
- **createdAt/updatedAt**: Timestamps

#### Products
- **id**: Primary key
- **name**: Product name
- **description**: Product description
- **price**: Product price (decimal)
- **discount**: Discount amount
- **stock**: Available stock quantity
- **categoryId**: Foreign key to categories
- **images**: JSON array of image URLs
- **createdAt/updatedAt**: Timestamps

#### Categories
- **id**: Primary key
- **name**: Category name
- **description**: Category description
- **parentId**: Self-referencing for hierarchical categories
- **createdAt/updatedAt**: Timestamps

#### Orders
- **id**: Primary key
- **userId**: Foreign key to users
- **totalAmount**: Total order amount
- **status**: Order status (pending, processing, shipped, delivered, cancelled)
- **shippingAddress**: Shipping address
- **createdAt/updatedAt**: Timestamps

#### Order Items
- **id**: Primary key
- **orderId**: Foreign key to orders
- **productId**: Foreign key to products
- **quantity**: Ordered quantity
- **price**: Price at time of order
- **createdAt/updatedAt**: Timestamps

### Relationships

- User → Orders (One-to-Many)
- User → Cart (One-to-Many)
- User → Reviews (One-to-Many)
- User → Wishlists (One-to-Many)
- Category → Products (One-to-Many)
- Category → Category (Self-referencing for parent-child)
- Product → OrderItems (One-to-Many)
- Product → Cart (One-to-Many)
- Product → Reviews (One-to-Many)
- Product → Wishlists (One-to-Many)
- Order → OrderItems (One-to-Many)
- Order → Payments (One-to-Many)
- Order → Shipments (One-to-Many)

## 🔐 Authentication & Authorization

### JWT Authentication
- **Strategy**: JWT Bearer tokens
- **Expiration**: 7 days (configurable)
- **Secret**: Environment variable `JWT_SECRET`

### User Roles
- **Admin**: Full access to all resources
- **Customer**: Limited access to own resources

### Guards
- **JwtAuthGuard**: Validates JWT tokens
- **AdminGuard**: Restricts access to admin users

### Default Admin
- **Username**: admin
- **Password**: admin123
- Created automatically on application start

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/admin/login` | Admin login | Public |
| GET | `/auth/profile` | Get user profile | Authenticated |

### User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| POST | `/users` | Create user | Admin |
| PATCH | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

### Product Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/products` | Get all products | Public |
| GET | `/products?categoryId=:id` | Get products by category | Public |
| GET | `/products/:id` | Get product by ID | Public |
| POST | `/products` | Create product | Admin |
| PATCH | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |

### Category Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/categories` | Get all categories | Public |
| GET | `/categories/:id` | Get category by ID | Public |
| POST | `/categories` | Create category | Admin |
| PATCH | `/categories/:id` | Update category | Admin |
| DELETE | `/categories/:id` | Delete category | Admin |

### Cart Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/cart` | Get user cart | Authenticated |
| POST | `/cart` | Add item to cart | Authenticated |
| PATCH | `/cart/:id` | Update cart item | Authenticated |
| DELETE | `/cart/:id` | Remove item from cart | Authenticated |
| DELETE | `/cart` | Clear cart | Authenticated |

### Order Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/orders` | Get all orders | Admin |
| GET | `/orders/my` | Get user orders | Authenticated |
| GET | `/orders/:id` | Get order by ID | Owner/Admin |
| POST | `/orders` | Create order | Authenticated |
| PATCH | `/orders/:id` | Update order status | Admin |
| DELETE | `/orders/:id` | Cancel order | Owner/Admin |

### Review Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/reviews` | Get all reviews | Public |
| GET | `/reviews/product/:productId` | Get product reviews | Public |
| POST | `/reviews` | Create review | Authenticated |
| PATCH | `/reviews/:id` | Update review | Owner |
| DELETE | `/reviews/:id` | Delete review | Owner/Admin |

### Wishlist Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/wishlists` | Get user wishlists | Authenticated |
| POST | `/wishlists` | Add to wishlist | Authenticated |
| DELETE | `/wishlists/:id` | Remove from wishlist | Authenticated |

### Payment Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/payments` | Get all payments | Admin |
| GET | `/payments/order/:orderId` | Get order payments | Owner/Admin |
| POST | `/payments` | Process payment | Authenticated |
| PATCH | `/payments/:id` | Update payment status | Admin |

### Shipment Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/shipments` | Get all shipments | Admin |
| GET | `/shipments/order/:orderId` | Get order shipments | Owner/Admin |
| POST | `/shipments` | Create shipment | Admin |
| PATCH | `/shipments/:id` | Update shipment | Admin |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=ecommerce_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development

# API Documentation
API_TITLE=E-commerce API
API_DESCRIPTION=E-commerce Backend API with NestJS
API_VERSION=1.0
```

### Database Setup

1. **Create PostgreSQL Database**:
```sql
CREATE DATABASE ecommerce_db;
```

2. **Run SQL Schema** (optional, TypeORM auto-creates):
```bash
psql -d ecommerce_db -f database.sql
```

3. **Auto-sync** (Development only):
   - TypeORM synchronize is enabled in development
   - Tables are created automatically from entities

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+ recommended)
- PostgreSQL (v12+ recommended)
- npm or yarn

### Installation Steps

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd ecommerce-be
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Start database**:
```bash
# Make sure PostgreSQL is running
# Create database: ecommerce_db
```

4. **Run application**:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

5. **Access application**:
- API Base URL: `http://localhost:3000`
- Swagger Documentation: `http://localhost:3000/api`

## 📝 API Documentation

### Swagger/OpenAPI
- **URL**: `http://localhost:3000/api`
- **Features**:
  - Interactive API testing
  - Request/response schemas
  - Authentication with Bearer tokens
  - Complete endpoint documentation

### Testing with Swagger
1. Navigate to `http://localhost:3000/api`
2. For authenticated endpoints:
   - Click "Authorize" button
   - Enter: `Bearer <your_jwt_token>`
   - Token obtained from login endpoints

## 🛠️ Development

### Scripts

```bash
# Development
npm run start:dev          # Start with hot reload

# Building
npm run build             # Build for production
npm run start:prod        # Start production build

# Testing
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Coverage report

# Code quality
npm run lint              # ESLint
npm run format            # Prettier formatting
```

### Code Structure Guidelines

1. **Modules**: Each feature is a separate module
2. **DTOs**: Input validation with class-validator
3. **Entities**: TypeORM entities with proper relationships
4. **Services**: Business logic implementation
5. **Controllers**: HTTP request handling with Swagger decorators
6. **Guards**: Authentication and authorization
7. **Decorators**: Custom decorators for common operations

### Common Development Tasks

#### Adding New Endpoint
1. Create DTO for request validation
2. Add method to service
3. Add endpoint to controller with Swagger decorators
4. Test via Swagger UI

#### Adding New Entity
1. Create entity with TypeORM decorators
2. Add to entities index
3. Import in relevant modules
4. Create/update DTOs and services

## 🔍 Error Handling

### Global Exception Handling
- Automatic validation errors
- Database constraint errors
- Custom business logic errors
- HTTP status code mapping

### Common Error Responses

```typescript
// Validation Error (400)
{
  "statusCode": 400,
  "message": ["property should not be empty"],
  "error": "Bad Request"
}

// Unauthorized (401)
{
  "statusCode": 401,
  "message": "Unauthorized"
}

// Not Found (404)
{
  "statusCode": 404,
  "message": "Product with ID 999 not found",
  "error": "Not Found"
}

// Forbidden (403)
{
  "statusCode": 403,
  "message": "Admin access required",
  "error": "Forbidden"
}
```

## 🚦 Security Considerations

### Authentication Security
- JWT tokens with configurable expiration
- Password hashing with bcrypt
- Bearer token validation

### Input Validation
- DTO validation with class-validator
- TypeScript type safety
- Whitelist and transform pipes

### Access Control
- Role-based authorization
- Resource ownership validation
- Admin-only endpoints protection

### Database Security
- Parameterized queries (TypeORM)
- Connection pooling
- Environment-based configuration

## 📊 Performance Considerations

### Database Optimization
- Proper indexing on foreign keys
- Eager/lazy loading configuration
- Connection pooling
- Query optimization

### API Optimization
- Pagination for large datasets
- Selective field loading
- Caching strategies (can be implemented)

### Monitoring
- Logging configuration
- Error tracking
- Performance metrics (can be implemented)

## 🔮 Future Enhancements

### Potential Features
- Redis caching
- Email notifications
- File upload for product images
- Advanced search and filtering
- Real-time updates with WebSockets
- API rate limiting
- Monitoring and logging
- Automated testing
- CI/CD pipeline
- Docker containerization

### Scalability Considerations
- Microservices architecture
- Database sharding
- Load balancing
- CDN integration
- Queue management

---

## 📞 Support

For technical issues or questions:
1. Check the Swagger documentation at `/api`
2. Review error logs in console
3. Verify environment configuration
4. Check database connectivity

**Note**: This documentation covers the current implementation. Features and endpoints may be extended based on business requirements. 