# 🚀 Misika Backend API - cURL Commands

## 📋 **Prerequisites**
- Backend server running on `http://localhost:3001`
- Admin user created with email containing "admin" (for admin privileges)

---

## 🔐 **Authentication**

### 1. Create Admin User
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

**📝 Note:** Save the `accessToken` from the response for the next commands.

---

## 📂 **Categories API**

### 3. Create Categories

#### Create "Bags" Category
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Bags",
    "description": "Stylish and durable bags for all occasions",
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
  }'
```

#### Create "Grocery" Category
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Grocery",
    "description": "Fresh groceries and daily essentials",
    "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"
  }'
```

#### Create "Home Textile" Category
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Home Textile",
    "description": "Premium bedding, curtains, and home decor",
    "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"
  }'
```

#### Create "Garments" Category
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Garments",
    "description": "Trendy clothing for every season",
    "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500"
  }'
```

### 4. Get All Categories
```bash
curl -X GET http://localhost:3001/api/categories \
  -H "Content-Type: application/json"
```

---

## 🛍️ **Products API**

### 5. Create Products

#### Create Bag Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Premium Leather Handbag",
    "description": "Elegant leather handbag perfect for professional and casual occasions. Made from genuine leather with multiple compartments.",
    "price": 129.99,
    "salePrice": 99.99,
    "sku": "BAG-LEATHER-001",
    "stock": 25,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
    ],
    "categoryId": "BAGS_CATEGORY_ID_HERE",
    "isFeatured": true
  }'
```

#### Create Grocery Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Organic Basmati Rice 5kg",
    "description": "Premium quality organic basmati rice, aged for perfect aroma and taste. Sourced directly from organic farms.",
    "price": 24.99,
    "sku": "RICE-BASMATI-5KG",
    "stock": 100,
    "images": [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500"
    ],
    "categoryId": "GROCERY_CATEGORY_ID_HERE",
    "isFeatured": false
  }'
```

#### Create Home Textile Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Egyptian Cotton Bed Sheet Set",
    "description": "Luxurious 1000 thread count Egyptian cotton bed sheet set. Includes fitted sheet, flat sheet, and pillowcases.",
    "price": 89.99,
    "salePrice": 69.99,
    "sku": "BEDSHEET-COTTON-QUEEN",
    "stock": 15,
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500"
    ],
    "categoryId": "HOME_TEXTILE_CATEGORY_ID_HERE",
    "isFeatured": true
  }'
```

#### Create Garment Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Classic Denim Jacket",
    "description": "Timeless denim jacket made from premium cotton denim. Perfect for layering and casual styling.",
    "price": 79.99,
    "sku": "JACKET-DENIM-M",
    "stock": 30,
    "images": [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500"
    ],
    "categoryId": "GARMENTS_CATEGORY_ID_HERE",
    "isFeatured": false
  }'
```

### 6. Get Products

#### Get All Products
```bash
curl -X GET http://localhost:3001/api/products \
  -H "Content-Type: application/json"
```

#### Get Products by Category
```bash
curl -X GET "http://localhost:3001/api/products?category=bags" \
  -H "Content-Type: application/json"
```

#### Get Products with Pagination
```bash
curl -X GET "http://localhost:3001/api/products?page=1&limit=5" \
  -H "Content-Type: application/json"
```

#### Search Products
```bash
curl -X GET "http://localhost:3001/api/products?search=leather" \
  -H "Content-Type: application/json"
```

---

## 🔄 **Complete Workflow Script**

### Automated Setup Script
```bash
#!/bin/bash

# 1. Create admin user
echo "Creating admin user..."
curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "email": "admin@misika.com", "password": "admin123456"}'

# 2. Login and get token
echo "Logging in..."
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@misika.com", "password": "admin123456"}' | \
  jq -r '.data.accessToken')

echo "Token: $TOKEN"

# 3. Create categories and get IDs
echo "Creating categories..."
BAGS_ID=$(curl -s -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Bags", "description": "Stylish bags"}' | \
  jq -r '.data.id')

GROCERY_ID=$(curl -s -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Grocery", "description": "Fresh groceries"}' | \
  jq -r '.data.id')

echo "Categories created: Bags($BAGS_ID), Grocery($GROCERY_ID)"

# 4. Create products
echo "Creating products..."
curl -s -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\": \"Leather Bag\", \"description\": \"Premium leather bag\", \"price\": 99.99, \"sku\": \"BAG-001\", \"stock\": 10, \"images\": [\"https://example.com/bag.jpg\"], \"categoryId\": \"$BAGS_ID\"}"

echo "Setup complete!"
```

---

## 📝 **Important Notes**

1. **Replace Placeholders**: Replace `YOUR_ACCESS_TOKEN` and category IDs with actual values
2. **Token Expiry**: Access tokens expire in 15 minutes, get a new one if needed
3. **Category IDs**: Get category IDs from the create category response
4. **Image URLs**: Use valid image URLs for better results
5. **SKU Uniqueness**: Each product must have a unique SKU

---

## 🔍 **Testing the APIs**

After running the commands, test the frontend:
1. Visit `http://localhost:5174`
2. Check the HeroSection banners
3. Click category buttons to see filtered products
4. Verify product counts are displayed correctly
