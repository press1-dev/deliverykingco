import {
  GET_CATEGORIES_QUERY,
  GET_PRODUCT_BY_SLUG_QUERY,
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_VARIANTS_QUERY,
  CREATE_CART_MUTATION,
  ADD_CART_ITEMS_MUTATION,
} from "@/lib/bigcommerce/queries";

export function GraphqlReference() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 font-sans text-gray-900">
      <div className="mx-auto max-w-4xl space-y-12">
        <header>
          <h1 className="text-3xl font-bold">API Reference</h1>
          <p className="mt-2 text-lg text-gray-600">
            BigCommerce Storefront GraphQL API - Officially Supported Operations
          </p>
          <p className="mt-4 rounded bg-blue-50 p-4 text-sm text-blue-900">
            <strong>Note:</strong> This API implements only the operations documented by BigCommerce.
            See{" "}
            <a
              href="https://docs.bigcommerce.com/developer/docs/admin/checkout-and-cart/custom-checkouts/graphql-storefront"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              BigCommerce Storefront API docs
            </a>
            {" "}for the full reference.
          </p>
        </header>

        <section className="space-y-4 border-b pb-8">
          <h2 className="text-2xl font-semibold">Endpoint</h2>
          <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
            {`https://store-{storeHash}[-{channelId}].mybigcommerce.com/graphql`}
          </pre>
          <p className="text-gray-600">POST GraphQL queries to this endpoint with Bearer token in Authorization header.</p>
        </section>

        <section className="space-y-4 border-b pb-8">
          <h2 className="text-2xl font-semibold">REST API for Cart Modifications</h2>
          <p className="text-gray-600">
            For cart item deletion and updates, use the REST Storefront API (GraphQL does not support these):
          </p>
          <pre className="overflow-auto rounded bg-gray-100 p-4 text-xs">
            {`DELETE /api/storefront/carts/{cartId}/items/{itemId}\n\nExample: DELETE /api/storefront/carts/xyz-123/items/item-456`}
          </pre>
          <p className="text-sm text-gray-600 mt-2">
            <strong>To update quantity:</strong> Delete the item, then re-add it with the new quantity.
          </p>
        </section>

        <section className="space-y-6 border-b pb-8">
          <h2 className="text-2xl font-semibold">Product Endpoints</h2>
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">GET /api/categories</h3>
              <p className="text-gray-600">List all product categories with images</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">GET /api/products</h3>
              <p className="text-gray-600">List products with optional pagination and filtering</p>
              <p className="text-sm text-gray-600">Query params: first=10 (default), entityIds=111,112 (optional)</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">GET /api/products/{"{slug}"}</h3>
              <p className="text-gray-600">Get full product details with description and all images</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">GET /api/products/{"{slug}"}/variants</h3>
              <p className="text-gray-600">Get product variants with options and pricing</p>
            </div>
          </div>
        </section>

        <section className="space-y-6 border-b pb-8">
          <h2 className="text-2xl font-semibold">Cart Operations (Officially Supported)</h2>
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">POST /api/cart</h3>
              <p className="text-gray-600">Create a new cart with initial items (GraphQL: createCart)</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">POST /api/cart/items</h3>
              <p className="text-gray-600">Add items to existing cart (GraphQL: addCartLineItems)</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">DELETE /api/storefront/carts/{"{cartId}"}/items/{"{itemId}"}</h3>
              <p className="text-gray-600">Delete item from cart (REST API - GraphQL not supported)</p>
            </div>
          </div>
        </section>

        <section className="space-y-4 bg-blue-50 p-6 rounded">
          <h2 className="text-xl font-semibold text-blue-900">Implementation Notes</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
            <li>All queries follow BigCommerce Storefront GraphQL API official documentation</li>
            <li>Cart operations use both GraphQL (create, add) and REST (delete, update)</li>
            <li>To update item quantity: delete + re-add pattern (BigCommerce API limitation)</li>
            <li>Product variants required for cart operations with products having options</li>
          </ul>
        </section>

        <section className="space-y-4 bg-amber-50 border border-amber-200 p-6 rounded">
          <h2 className="text-xl font-semibold text-amber-900">Unsupported Operations</h2>
          <p className="text-sm text-amber-900">The following operations are NOT documented by BigCommerce and are not supported:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-amber-900 mt-2">
            <li>deleteCartLineItem (GraphQL mutation)</li>
            <li>updateCartLineItem (GraphQL mutation)</li>
            <li>PATCH /api/cart/items (REST)</li>
          </ul>
          <p className="text-sm text-amber-900 mt-3">Use the delete + re-add pattern for quantity updates instead.</p>
        </section>
      </div>
    </main>
  );
}
