# Frontend Developer API Handoff

All BigCommerce API integrations are ready for frontend use. This document covers implemented endpoints and usage patterns.

## Available Endpoints

### Product Discovery
- **GET /api/categories** - All product categories with images
- **GET /api/products?first=10&entityIds=111,112** - Product list with pagination  
- **GET /api/products/{slug}** - Full product details (HTML description, images)
- **GET /api/products/{slug}/variants** - Product variants with options

### Cart Operations
- **POST /api/cart** - Create new cart with items
- **POST /api/cart/items** - Add items to existing cart
- **DELETE /api/storefront/carts/{cartId}/items/{itemId}** - Delete item (REST API)

## Key Implementation Notes

1. **Cart Creation Pattern**
   ```
   POST /api/cart
   { "lineItems": [{ "productEntityId": 112, "variantEntityId": 78, "quantity": 1 }] }
   ```
   Returns: `{ "success": true, "data": { "entityId": "uuid", ... } }`

2. **Update Cart Item Quantity**
   - BigCommerce does not support direct quantity updates
   - **Pattern**: Delete item + re-add with new quantity
   - Delete: `DELETE /api/storefront/carts/{cartId}/items/{itemId}`
   - Re-add: `POST /api/cart/items` with new quantity

3. **Product Variants Required**
   - Always fetch variants before adding items to cart
   - Use `variantEntityId` from variants endpoint for cart operations
   - GET /api/products/{slug}/variants returns all available options

## API Documentation
Full endpoint documentation with examples available at: `/docs`

## Testing
All endpoints tested and verified to match official BigCommerce Storefront GraphQL API documentation.

## Limitations
- Cart retrieval via GraphQL has issues (use REST API instead)
- No direct quantity update support (use delete + re-add)
- All cart modifications require valid product/variant IDs
