import { bigcommerceFetch } from "../bigcommerce";
import {
  GET_CATEGORIES_QUERY,
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_SLUG_QUERY,
  GET_PRODUCT_VARIANTS_QUERY,
  GET_CART_QUERY,
  CREATE_CART_MUTATION,
  ADD_CART_ITEMS_MUTATION,
  GET_BRANDS_QUERY,
} from "./queries";

// Types (You can expand these as needed)
export type Category = {
  entityId: number;
  name: string;
  path: string;
  image?: { url: string };
  children?: Category[];
};

export type Brand = {
  entityId: number;
  name: string;
  path: string;
};

export type Product = {
  entityId: number;
  name: string;
  path: string;
  brand?: { name: string };
  prices?: { price: { value: number; currencyCode: string } };
  defaultImage?: { url: string; altText: string };
  description?: string;
  images?: {
    edges: { node: { url: string; altText: string; isDefault: boolean } }[];
  };
  productOptions?: {
    edges: {
      node: {
        entityId: number;
        displayName: string;
        values: {
          edges: {
            node: {
              entityId: number;
              label: string;
              hexColors?: string[];
            };
          }[];
        };
      };
    }[];
  };
  variants?: {
    edges: { node: ProductVariant }[];
  };
};

export type CartLineItem = {
  entityId: string;
  name: string;
  quantity: number;
  productEntityId?: number;
};

export type Money = {
  value: number;
  currencyCode: string;
};

export type Cart = {
  entityId: string;
  currencyCode?: string;
  lineItems?: {
    physicalItems?: CartLineItem[];
    digitalItems?: CartLineItem[];
  };
  baseAmount?: Money;
  amount?: Money;
};

export type ProductVariantOption = {
  displayName: string;
  values: { edges: { node: { label: string } }[] };
};

export type ProductVariant = {
  entityId: number;
  sku?: string;
  prices?: {
    price: { value: number; currencyCode: string };
  };
  options?: { edges: { node: ProductVariantOption }[] };
};

export async function getCategories(): Promise<Category[]> {
  const response = await bigcommerceFetch<{
    site: { categoryTree: Category[] };
  }>({
    query: GET_CATEGORIES_QUERY,
  });

  if ("errors" in response) {
    console.error("Error fetching categories:", response.errors);
    return [];
  }

  return response.data.site.categoryTree;
}

export async function getProducts({
  first = 10,
  entityIds,
}: { first?: number; entityIds?: number[] } = {}): Promise<Product[]> {
  const response = await bigcommerceFetch<{
    site: { products: { edges: { node: Product }[] } };
  }>({
    query: GET_PRODUCTS_QUERY,
    variables: { first, entityIds },
  });

  if ("errors" in response) {
    console.error("Error fetching products:", response.errors);
    return [];
  }

  return response.data.site.products.edges.map((edge) => edge.node);
}

export async function getProductBySlug(path: string): Promise<Product | null> {
  // Ensure path starts with a slash
  const formattedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await bigcommerceFetch<{
    site: { route: { node: Product } };
  }>({
    query: GET_PRODUCT_BY_SLUG_QUERY,
    variables: { path: formattedPath },
  });

  if ("errors" in response) {
    console.error("Error fetching product by slug:", response.errors);
    return null;
  }

  return response.data.site.route?.node || null;
}

export async function getProductVariants(
  path: string,
): Promise<ProductVariant[]> {
  // Ensure path starts with a slash
  const formattedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await bigcommerceFetch<{
    site: {
      route: { node: { variants: { edges: { node: ProductVariant }[] } } };
    };
  }>({
    query: GET_PRODUCT_VARIANTS_QUERY,
    variables: { path: formattedPath },
  });

  if ("errors" in response) {
    console.error("Error fetching product variants:", response.errors);
    return [];
  }

  return (
    response.data.site.route?.node?.variants?.edges?.map((edge) => edge.node) ||
    []
  );
}

export async function getCart(cartEntityId: string): Promise<Cart | null> {
  const response = await bigcommerceFetch<{ site: { cart: Cart } }>({
    query: GET_CART_QUERY,
    variables: { cartEntityId },
  });

  if ("errors" in response) {
    console.error("Error fetching cart:", response.errors);
    return null;
  }

  return response.data.site.cart || null;
}

export async function createCart(
  lineItems: Array<{
    productEntityId: number;
    variantEntityId?: number;
    quantity: number;
  }>,
): Promise<Cart | null> {
  const response = await bigcommerceFetch<{
    cart: { createCart: { cart: Cart } };
  }>({
    query: CREATE_CART_MUTATION,
    variables: {
      input: {
        lineItems,
      },
    },
  });

  if ("errors" in response) {
    console.error("Error creating cart:", response.errors);
    return null;
  }

  return response.data.cart.createCart?.cart || null;
}

export async function addCartItems(
  cartEntityId: string,
  lineItems: Array<{
    productEntityId: number;
    variantEntityId?: number;
    quantity: number;
  }>,
): Promise<Cart | null> {
  const response = await bigcommerceFetch<{
    cart: { addCartLineItems: { cart: Cart } };
  }>({
    query: ADD_CART_ITEMS_MUTATION,
    variables: {
      input: {
        cartEntityId,
        data: {
          lineItems,
        },
      },
    },
  });

  if ("errors" in response) {
    console.error("Error adding cart items:", response.errors);
    return null;
  }

  return response.data.cart.addCartLineItems?.cart || null;
}

export async function getBrands(): Promise<Brand[]> {
  const response = await bigcommerceFetch<{
    site: { brands: { edges: { node: Brand }[] } };
  }>({
    query: GET_BRANDS_QUERY,
  });

  if ("errors" in response) {
    console.error("Error fetching brands:", response.errors);
    return [];
  }

  return response.data.site.brands.edges.map((edge) => edge.node);
}

// Note: BigCommerce Storefront GraphQL API does not support deleteCartLineItem or updateCartLineItem mutations
// For modifying cart items, use the REST Storefront API:
// - DELETE /api/storefront/carts/{cartId}/items/{itemId} to remove items
// - To update quantity: delete item + re-add with addCartLineItems
