export async function bigcommerceFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<{ data: T } | { errors: any[] }> {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
  const token = process.env.BIGCOMMERCE_STOREFRONT_TOKEN;
  const channelId = process.env.BIGCOMMERCE_CHANNEL_ID;

  if (!storeHash || !token) {
    throw new Error('BigCommerce store hash or token is missing from environment variables.');
  }

  const endpoint = channelId 
    ? `https://store-${storeHash}-${channelId}.mybigcommerce.com/graphql`
    : `https://store-${storeHash}.mybigcommerce.com/graphql`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`BigCommerce API responded with ${res.status} ${res.statusText}`);
  }

  return res.json();
}
