import { bigcommerceFetch } from '../bigcommerce';
import { GET_CATEGORIES_QUERY, GET_PRODUCTS_QUERY, GET_PRODUCT_BY_SLUG_QUERY } from './queries';

// Types (You can expand these as needed)
export type Category = {
  entityId: number;
  name: string;
  path: string;
  image?: { url: string };
  children?: Category[];
};

export type Product = {
  entityId: number;
  name: string;
  path: string;
  brand?: { name: string };
  prices?: { price: { value: number; currencyCode: string } };
  defaultImage?: { url: string; altText: string };
  description?: string;
  images?: { edges: { node: { url: string; altText: string; isDefault: boolean } }[] };
};

export async function getCategories(): Promise<Category[]> {
  const response = await bigcommerceFetch<{ site: { categoryTree: Category[] } }>({
    query: GET_CATEGORIES_QUERY,
  });

  if ('errors' in response) {
    console.error('Error fetching categories:', response.errors);
    return [];
  }

  return response.data.site.categoryTree;
}

export async function getProducts({ first = 10, entityIds }: { first?: number; entityIds?: number[] } = {}): Promise<Product[]> {
  const response = await bigcommerceFetch<{ site: { products: { edges: { node: Product }[] } } }>({
    query: GET_PRODUCTS_QUERY,
    variables: { first, entityIds },
  });

  if ('errors' in response) {
    console.error('Error fetching products:', response.errors);
    return [];
  }

  return response.data.site.products.edges.map(edge => edge.node);
}

export async function getProductBySlug(path: string): Promise<Product | null> {
  // Ensure path starts with a slash
  const formattedPath = path.startsWith('/') ? path : `/${path}`;

  const response = await bigcommerceFetch<{ site: { route: { node: Product } } }>({
    query: GET_PRODUCT_BY_SLUG_QUERY,
    variables: { path: formattedPath },
  });

  if ('errors' in response) {
    console.error('Error fetching product by slug:', response.errors);
    return null;
  }

  return response.data.site.route?.node || null;
}
