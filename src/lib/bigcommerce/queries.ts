export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    site {
      categoryTree {
        entityId
        name
        path
        children {
          entityId
          name
          path
        }
      }
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int = 10, $entityIds: [Int!]) {
    site {
      products(first: $first, entityIds: $entityIds) {
        edges {
          node {
            entityId
            name
            path
            brand {
              name
            }
            prices {
              price {
                value
                currencyCode
              }
            }
            defaultImage {
              url(width: 500)
              altText
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG_QUERY = `
  query GetProductBySlug($path: String!) {
    site {
      route(path: $path) {
        node {
          ... on Product {
            entityId
            name
            path
            description
            brand {
              name
            }
            prices {
              price {
                value
                currencyCode
              }
            }
            defaultImage {
              url(width: 1000)
              altText
            }
            images {
              edges {
                node {
                  url(width: 1000)
                  altText
                  isDefault
                }
              }
            }
          }
        }
      }
    }
  }
`;
