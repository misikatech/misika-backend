# Working cURL Examples for Misika Backend APIs

## Prerequisites
- Server running on `http://localhost:3001`
- Admin user created with email: `admin@misika.com`

## Step-by-Step Testing

### 1. Create Admin User (First Time Only)
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@misika.com",
    "password": "admin123456"
  }'
```

### 2. Login to Get Access Token
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@misika.com",
    "password": "admin123456"
  }'
```

**Response will include `accessToken` - copy this for next steps**

### 3. Create a Category
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Gaming Laptops",
    "description": "High-performance gaming laptops",
    "image": "https://example.com/gaming-laptops.jpg"
  }'
```

**Response will include category `id` - copy this for product creation**

### 4. View All Categories
```bash
curl -X GET http://localhost:3001/api/categories
```

### 5. Create a Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "ASUS ROG Strix G15",
    "description": "Powerful gaming laptop with RTX 4060 and AMD Ryzen 7",
    "price": 1299.99,
    "salePrice": 1199.99,
    "sku": "ASUS-ROG-G15-001",
    "stock": 10,
    "images": [
      "https://example.com/asus-rog-1.jpg",
      "https://example.com/asus-rog-2.jpg"
    ],
    "categoryId": "YOUR_CATEGORY_ID",
    "isFeatured": true
  }'
```

### 6. View All Products
```bash
curl -X GET http://localhost:3001/api/products
```

### 7. View Single Product
```bash
curl -X GET http://localhost:3001/api/products/YOUR_PRODUCT_ID
```

### 8. Update Product
```bash
curl -X PUT http://localhost:3001/api/products/YOUR_PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "price": 1249.99,
    "stock": 15
  }'
```

### 9. Filter Products by Category
```bash
curl -X GET "http://localhost:3001/api/products?category=gaming-laptops"
```

### 10. Search Products
```bash
curl -X GET "http://localhost:3001/api/products?search=asus"
```

### 11. Filter by Price Range
```bash
curl -X GET "http://localhost:3001/api/products?minPrice=1000&maxPrice=1500"
```

### 12. Paginated Results
```bash
curl -X GET "http://localhost:3001/api/products?page=1&limit=5"
```

## Real Working Example (Copy-Paste Ready)

Here's a complete working example you can run:

```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@misika.com", "password": "admin123456"}' | \
  grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

# 2. Create category and get ID
CATEGORY_ID=$(curl -s -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Test Category", "description": "Test description"}' | \
  grep -o '"id":"[^"]*"' | cut -d'"' -f4)

# 3. Create product
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Test Product\",
    \"description\": \"This is a test product with detailed description\",
    \"price\": 99.99,
    \"sku\": \"TEST-$(date +%s)\",
    \"stock\": 5,
    \"images\": [\"https://example.com/test.jpg\"],
    \"categoryId\": \"$CATEGORY_ID\"
  }"

# 4. View all products
curl -X GET http://localhost:3001/api/products
```

## Database Schema Compliance

The APIs validate against your exact database schema:

### Categories Table
- ✅ `id` (UUID, auto-generated)
- ✅ `name` (TEXT, required, unique)
- ✅ `slug` (TEXT, auto-generated from name)
- ✅ `description` (TEXT, optional)
- ✅ `image` (TEXT, optional)
- ✅ `isActive` (BOOLEAN, defaults to true)
- ✅ `createdAt` (TIMESTAMPTZ, auto-generated)
- ✅ `updatedAt` (TIMESTAMPTZ, auto-updated)

### Products Table
- ✅ `id` (UUID, auto-generated)
- ✅ `name` (TEXT, required)
- ✅ `slug` (TEXT, auto-generated from name)
- ✅ `description` (TEXT, required)
- ✅ `price` (NUMERIC(10,2), required)
- ✅ `salePrice` (NUMERIC(10,2), optional)
- ✅ `sku` (TEXT, required, unique)
- ✅ `stock` (INTEGER, defaults to 0)
- ✅ `images` (TEXT[], required)
- ✅ `isActive` (BOOLEAN, defaults to true)
- ✅ `isFeatured` (BOOLEAN, defaults to false)
- ✅ `categoryId` (UUID, required, foreign key)
- ✅ `createdAt` (TIMESTAMPTZ, auto-generated)
- ✅ `updatedAt` (TIMESTAMPTZ, auto-updated)
