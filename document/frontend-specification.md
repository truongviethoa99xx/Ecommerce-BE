# 🚀 E-commerce Frontend Specification for ReactJS

## 📋 Overview

This document provides complete specifications for building a modern e-commerce frontend using ReactJS that integrates with the NestJS backend API. The frontend will be a responsive, user-friendly web application supporting both customer and admin functionalities.

## 🏗️ Technology Stack Recommendations

### Core Technologies
- **Frontend Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit + RTK Query (for API calls)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Headless UI
- **Form Handling**: React Hook Form + Yup validation
- **HTTP Client**: Axios (integrated with RTK Query)
- **Build Tool**: Vite or Create React App

### UI/UX Libraries
- **Component Library**: Headless UI + Radix UI
- **Icons**: Heroicons or Lucide React
- **Notifications**: React Hot Toast
- **Loading States**: React Loading Skeleton
- **Image Handling**: React Image Gallery
- **Date Handling**: date-fns

## 🎨 Application Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, Modal, etc.)
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── product/         # Product-related components
│   ├── cart/            # Cart components
│   └── common/          # Common components
├── pages/               # Page components
│   ├── public/          # Public pages (Home, Products, Login, etc.)
│   ├── customer/        # Customer dashboard pages
│   └── admin/           # Admin dashboard pages
├── hooks/               # Custom React hooks
├── store/               # Redux store setup
│   ├── slices/          # Redux slices
│   └── api/             # RTK Query API definitions
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── assets/              # Static assets
```

## 📡 API Integration

### Base Configuration

```typescript
// src/store/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Product', 'Category', 'Cart', 'Order', 'Review', 'Wishlist', 'Payment', 'Shipment', 'Contact', 'Statistics'],
  endpoints: () => ({}),
});
```

### API Endpoints Integration

#### Authentication API
```typescript
// src/store/api/authApi.ts
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProfile: builder.query({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
  }),
});
```

#### Products API
```typescript
// src/store/api/productsApi.ts
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/products',
        params: {
          page: params.page || 1,
          limit: params.limit || 12,
          search: params.search,
          categoryId: params.categoryId,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          sortBy: params.sortBy || 'createdAt',
          sortOrder: params.sortOrder || 'DESC',
        },
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});
```

## 🎯 Page Specifications

### 1. Public Pages

#### Home Page (`/`)
**Components Needed:**
- Hero Section with featured products
- Product Categories grid
- Featured/Popular products carousel
- Customer testimonials
- Newsletter signup

**Features:**
- Product search bar in header
- Category navigation
- Responsive design
- SEO optimized

#### Products Page (`/products`)
**Components Needed:**
- Product grid with pagination
- Filter sidebar (category, price range, rating)
- Search functionality
- Sort options (price, name, date, popularity)
- Product cards with images, price, rating

**Features:**
- Advanced filtering and search
- Pagination with page size options
- Grid/List view toggle
- Add to cart/wishlist from grid
- Price range slider

#### Product Detail Page (`/products/:id`)
**Components Needed:**
- Product image gallery
- Product information (name, price, description, stock)
- Add to cart/wishlist buttons
- Customer reviews section
- Related products
- Product specifications

**Features:**
- Image zoom functionality
- Quantity selector
- Stock availability display
- Review submission (authenticated users)
- Social sharing buttons

#### Authentication Pages
- **Login Page** (`/login`)
- **Register Page** (`/register`)
- **Forgot Password** (`/forgot-password`)

### 2. Customer Dashboard

#### Dashboard Overview (`/dashboard`)
**Components:**
- Order history summary
- Wishlist count
- Account information
- Quick actions

#### My Orders (`/dashboard/orders`)
**Features:**
- Order list with status
- Order details modal
- Track shipment
- Reorder functionality
- Order filtering

#### My Profile (`/dashboard/profile`)
**Features:**
- Edit personal information
- Change password
- Address management
- Account preferences

#### Wishlist (`/dashboard/wishlist`)
**Features:**
- Wishlist items grid
- Move to cart functionality
- Remove from wishlist
- Share wishlist

#### My Reviews (`/dashboard/reviews`)
**Features:**
- Reviews I've written
- Edit/delete reviews
- Product links

### 3. Shopping Features

#### Shopping Cart (`/cart`)
**Components:**
- Cart items list
- Quantity controls
- Remove items
- Price summary
- Checkout button

**Features:**
- Update quantities
- Remove items
- Apply coupon codes
- Shipping calculator
- Continue shopping

#### Checkout (`/checkout`)
**Components:**
- Shipping information form
- Payment method selection
- Order summary
- Place order button

**Features:**
- Multi-step checkout process
- Address validation
- Payment integration
- Order confirmation

### 4. Admin Dashboard

#### Admin Overview (`/admin`)
**Components:**
- Statistics cards (total users, orders, revenue)
- Charts (sales trends, user growth)
- Recent orders table
- Quick actions

#### Product Management (`/admin/products`)
**Features:**
- Product CRUD operations
- Bulk actions
- Image upload
- Stock management
- Category assignment

#### Order Management (`/admin/orders`)
**Features:**
- Order list with filters
- Order status updates
- Order details view
- Print order receipts
- Bulk status updates

#### User Management (`/admin/users`)
**Features:**
- User list with search
- User details view
- Account status management
- User activity logs

#### Statistics & Reports (`/admin/statistics`)
**Features:**
- Sales analytics
- User analytics
- Product performance
- Revenue reports
- Export functionality

#### Contact Management (`/admin/contacts`)
**Features:**
- Contact messages list
- Message status management
- Reply to messages
- Message categories

## 🛠️ Component Specifications

### Core UI Components

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

#### Input Component
```typescript
interface InputProps {
  type: string;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}
```

#### Modal Component
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}
```

### Product Components

#### ProductCard
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
  onAddToWishlist: (productId: number) => void;
  showQuickView?: boolean;
}
```

#### ProductGrid
```typescript
interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}
```

### Cart Components

#### CartItem
```typescript
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}
```

## 🔐 Authentication & Authorization

### Authentication Flow
1. **Login/Register** → Store JWT token in Redux + localStorage
2. **Token Management** → Auto-refresh, logout on expiry
3. **Route Protection** → Private routes for authenticated users
4. **Admin Routes** → Additional admin role check

### Protected Routes Implementation
```typescript
// src/components/ProtectedRoute.tsx
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

## 📱 Responsive Design Requirements

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Touch-friendly interface
- Optimized navigation
- Swipe gestures for product galleries
- Mobile-optimized forms

## 🎨 UI/UX Guidelines

### Design System
- **Primary Colors**: Blue (#3B82F6), Green (#10B981)
- **Secondary Colors**: Gray shades (#F3F4F6, #6B7280)
- **Typography**: Inter or Roboto font family
- **Spacing**: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)

### User Experience
- **Loading States**: Skeleton loaders for better perceived performance
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Toast notifications for actions
- **Empty States**: Meaningful empty state illustrations

## 🔧 Development Guidelines

### Code Structure
- Use TypeScript for type safety
- Implement proper error boundaries
- Follow React best practices (hooks, functional components)
- Use custom hooks for reusable logic

### Performance Optimization
- Lazy loading for routes and components
- Image optimization and lazy loading
- Memoization for expensive calculations
- Virtual scrolling for large lists

### Testing Strategy
- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for critical user flows
- E2E tests for main user journeys

## 📊 State Management

### Redux Store Structure
```typescript
interface RootState {
  auth: AuthState;
  cart: CartState;
  products: ProductsState;
  ui: UIState;
  api: ApiState;
}
```

### Local State vs Global State
- **Global State**: Authentication, cart, user preferences
- **Local State**: Form data, component-specific UI state
- **Server State**: API data managed by RTK Query

## 🚀 Deployment & Environment

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_APP_NAME=E-commerce Store
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

### Build Configuration
- Production build optimization
- Environment-specific configurations
- CDN integration for static assets

## 📋 Development Checklist

### Phase 1: Core Setup
- [ ] Project setup with TypeScript
- [ ] Redux store configuration
- [ ] API integration setup
- [ ] Authentication flow
- [ ] Basic routing

### Phase 2: Public Pages
- [ ] Home page
- [ ] Products listing
- [ ] Product details
- [ ] Login/Register
- [ ] Cart functionality

### Phase 3: Customer Features
- [ ] Customer dashboard
- [ ] Order management
- [ ] Profile management
- [ ] Wishlist functionality
- [ ] Checkout process

### Phase 4: Admin Features
- [ ] Admin dashboard
- [ ] Product management
- [ ] Order management
- [ ] User management
- [ ] Statistics dashboard

### Phase 5: Enhancements
- [ ] Search functionality
- [ ] Filters and sorting
- [ ] Reviews system
- [ ] Contact forms
- [ ] Mobile optimization

## 🔗 API Integration Summary

### Available Endpoints
- **Authentication**: `/auth/*` (login, register, profile)
- **Products**: `/products/*` (CRUD, search, pagination)
- **Categories**: `/categories/*` (hierarchical categories)
- **Cart**: `/cart/*` (add, update, remove, clear)
- **Orders**: `/orders/*` (create, track, history)
- **Reviews**: `/reviews/*` (CRUD, product reviews)
- **Wishlist**: `/wishlists/*` (add, remove, list)
- **Payments**: `/payments/*` (process, track)
- **Shipments**: `/shipments/*` (track, status)
- **Statistics**: `/statistics/*` (admin dashboard data)
- **Contacts**: `/contacts/*` (support messages)

### Authentication
- **Bearer Token**: Include in Authorization header
- **Admin Access**: Separate admin login endpoint
- **Token Refresh**: Implement auto-refresh mechanism

### Data Formats
- All API responses follow consistent JSON structure
- Pagination includes `data`, `total`, `page`, `limit`, `totalPages`
- Error responses include `statusCode`, `message`, `error`

## 🎯 Success Criteria

### Customer Experience
- Fast page load times (< 3 seconds)
- Intuitive navigation and search
- Smooth checkout process
- Mobile-responsive design
- Accessible interface (WCAG compliance)

### Admin Experience
- Comprehensive dashboard with analytics
- Easy product and order management
- User-friendly interface for non-technical users
- Bulk operations for efficiency

### Technical Requirements
- 95%+ uptime
- SEO-friendly URLs and meta tags
- Cross-browser compatibility
- Progressive Web App features
- Security best practices

---

This specification provides a comprehensive roadmap for building a modern, feature-rich e-commerce frontend that perfectly integrates with your NestJS backend. The frontend will provide excellent user experience for both customers and administrators while maintaining high code quality and performance standards.
