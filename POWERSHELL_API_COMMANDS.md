# 🚀 Misika Backend API - PowerShell Commands

## 📋 **Prerequisites**
- Backend server running on `http://localhost:3001`
- PowerShell (Windows)

---

## 🔐 **Authentication**

### 1. Create Admin User
```powershell
$body = @{
    username = "admin"
    email = "admin@misika.com"
    password = "admin123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### 2. Login to Get Access Token
```powershell
$loginBody = @{
    email = "admin@misika.com"
    password = "admin123456"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.accessToken
Write-Host "Access Token: $token"
```

---

## 📂 **Categories API**

### 3. Create Categories

#### Create "Bags" Category
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$bagsBody = @{
    name = "Bags"
    description = "Stylish and durable bags for all occasions"
    image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
} | ConvertTo-Json

$bagsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/categories" -Method POST -Body $bagsBody -Headers $headers
$bagsId = $bagsResponse.data.id
Write-Host "Bags Category ID: $bagsId"
```

#### Create "Grocery" Category
```powershell
$groceryBody = @{
    name = "Grocery"
    description = "Fresh groceries and daily essentials"
    image = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"
} | ConvertTo-Json

$groceryResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/categories" -Method POST -Body $groceryBody -Headers $headers
$groceryId = $groceryResponse.data.id
Write-Host "Grocery Category ID: $groceryId"
```

#### Create "Home Textile" Category
```powershell
$homeTextileBody = @{
    name = "Home Textile"
    description = "Premium bedding, curtains, and home decor"
    image = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"
} | ConvertTo-Json

$homeTextileResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/categories" -Method POST -Body $homeTextileBody -Headers $headers
$homeTextileId = $homeTextileResponse.data.id
Write-Host "Home Textile Category ID: $homeTextileId"
```

#### Create "Garments" Category
```powershell
$garmentsBody = @{
    name = "Garments"
    description = "Trendy clothing for every season"
    image = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500"
} | ConvertTo-Json

$garmentsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/categories" -Method POST -Body $garmentsBody -Headers $headers
$garmentsId = $garmentsResponse.data.id
Write-Host "Garments Category ID: $garmentsId"
```

### 4. Get All Categories
```powershell
$categories = Invoke-RestMethod -Uri "http://localhost:3001/api/categories" -Method GET
$categories.data | Format-Table
```

---

## 🛍️ **Products API**

### 5. Create Products

#### Create Bag Product
```powershell
$bagProductBody = @{
    name = "Premium Leather Handbag"
    description = "Elegant leather handbag perfect for professional and casual occasions. Made from genuine leather with multiple compartments."
    price = 129.99
    salePrice = 99.99
    sku = "BAG-LEATHER-001"
    stock = 25
    images = @(
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
    )
    categoryId = $bagsId
    isFeatured = $true
} | ConvertTo-Json

$bagProduct = Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method POST -Body $bagProductBody -Headers $headers
Write-Host "Bag Product Created: $($bagProduct.data.name)"
```

#### Create Grocery Product
```powershell
$groceryProductBody = @{
    name = "Organic Basmati Rice 5kg"
    description = "Premium quality organic basmati rice, aged for perfect aroma and taste. Sourced directly from organic farms."
    price = 24.99
    sku = "RICE-BASMATI-5KG"
    stock = 100
    images = @("https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500")
    categoryId = $groceryId
    isFeatured = $false
} | ConvertTo-Json

$groceryProduct = Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method POST -Body $groceryProductBody -Headers $headers
Write-Host "Grocery Product Created: $($groceryProduct.data.name)"
```

#### Create Home Textile Product
```powershell
$homeTextileProductBody = @{
    name = "Egyptian Cotton Bed Sheet Set"
    description = "Luxurious 1000 thread count Egyptian cotton bed sheet set. Includes fitted sheet, flat sheet, and pillowcases."
    price = 89.99
    salePrice = 69.99
    sku = "BEDSHEET-COTTON-QUEEN"
    stock = 15
    images = @(
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500"
    )
    categoryId = $homeTextileId
    isFeatured = $true
} | ConvertTo-Json

$homeTextileProduct = Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method POST -Body $homeTextileProductBody -Headers $headers
Write-Host "Home Textile Product Created: $($homeTextileProduct.data.name)"
```

#### Create Garment Product
```powershell
$garmentProductBody = @{
    name = "Classic Denim Jacket"
    description = "Timeless denim jacket made from premium cotton denim. Perfect for layering and casual styling."
    price = 79.99
    sku = "JACKET-DENIM-M"
    stock = 30
    images = @(
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500"
    )
    categoryId = $garmentsId
    isFeatured = $false
} | ConvertTo-Json

$garmentProduct = Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method POST -Body $garmentProductBody -Headers $headers
Write-Host "Garment Product Created: $($garmentProduct.data.name)"
```

### 6. Get Products

#### Get All Products
```powershell
$products = Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method GET
$products.data | Select-Object name, price, category | Format-Table
```

#### Get Products by Category
```powershell
$bagProducts = Invoke-RestMethod -Uri "http://localhost:3001/api/products?category=bags" -Method GET
$bagProducts.data | Format-Table
```

---

## 🔄 **Complete Setup Script**

### Run All Commands at Once
```powershell
# Complete setup script for Misika Backend
Write-Host "🚀 Setting up Misika Backend with sample data..." -ForegroundColor Green

# 1. Create admin user
Write-Host "1. Creating admin user..." -ForegroundColor Yellow
try {
    $body = @{
        username = "admin"
        email = "admin@misika.com"
        password = "admin123456"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Admin user created" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Admin user already exists" -ForegroundColor Blue
}

# 2. Login and get token
Write-Host "2. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@misika.com"
    password = "admin123456"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.accessToken
Write-Host "✅ Login successful" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Create categories
Write-Host "3. Creating categories..." -ForegroundColor Yellow

$categories = @(
    @{ name = "Bags"; description = "Stylish and durable bags"; image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" },
    @{ name = "Grocery"; description = "Fresh groceries and essentials"; image = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500" },
    @{ name = "Home Textile"; description = "Premium home decor"; image = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500" },
    @{ name = "Garments"; description = "Trendy clothing"; image = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500" }
)

$categoryIds = @{}
foreach ($cat in $categories) {
    try {
        $catBody = $cat | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/categories" -Method POST -Body $catBody -Headers $headers
        $categoryIds[$cat.name] = $response.data.id
        Write-Host "✅ Created category: $($cat.name)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Category $($cat.name) might already exist" -ForegroundColor Yellow
    }
}

# 4. Create products
Write-Host "4. Creating products..." -ForegroundColor Yellow

$products = @(
    @{
        name = "Premium Leather Handbag"
        description = "Elegant leather handbag perfect for all occasions"
        price = 129.99
        salePrice = 99.99
        sku = "BAG-LEATHER-$(Get-Random)"
        stock = 25
        images = @("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500")
        categoryId = $categoryIds["Bags"]
        isFeatured = $true
    },
    @{
        name = "Organic Basmati Rice 5kg"
        description = "Premium quality organic basmati rice"
        price = 24.99
        sku = "RICE-BASMATI-$(Get-Random)"
        stock = 100
        images = @("https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500")
        categoryId = $categoryIds["Grocery"]
        isFeatured = $false
    }
)

foreach ($product in $products) {
    if ($product.categoryId) {
        try {
            $productBody = $product | ConvertTo-Json
            $response = Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method POST -Body $productBody -Headers $headers
            Write-Host "✅ Created product: $($product.name)" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to create product: $($product.name)" -ForegroundColor Red
        }
    }
}

Write-Host "🎉 Setup complete! Check your frontend at http://localhost:5174" -ForegroundColor Green
```

---

## 📝 **Usage Instructions**

1. **Open PowerShell** as Administrator
2. **Navigate** to your project directory
3. **Copy and paste** the commands above
4. **Run the complete setup script** for quick setup
5. **Check the frontend** at `http://localhost:5174`

The PowerShell commands will work natively on Windows without requiring curl.
