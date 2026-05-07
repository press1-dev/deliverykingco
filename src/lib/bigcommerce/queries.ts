export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    site {
      categoryTree {
        entityId
        name
        path
        image {
          url(width: 600)
        }
        children {
          entityId
          name
          path
          image {
            url(width: 600)
          }
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
            variants {
              edges {
                node {
                  entityId
                  sku
                  prices {
                    price {
                      value
                      currencyCode
                    }
                  }
                  options {
                    edges {
                      node {
                        displayName
                        values {
                          edges {
                            node {
                              label
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_VARIANTS_QUERY = `
  query GetProductVariants($path: String!) {
    site {
      route(path: $path) {
        node {
          ... on Product {
            entityId
            name
            variants {
              edges {
                node {
                  entityId
                  sku
                  prices {
                    price {
                      value
                      currencyCode
                    }
                  }
                  options {
                    edges {
                      node {
                        displayName
                        values {
                          edges {
                            node {
                              label
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CART_QUERY = `
  query GetCart($cartEntityId: String!) {
    site {
      cart(entityId: $cartEntityId) {
        entityId
        currencyCode
        lineItems {
          edges {
            node {
              entityId
              name
              quantity
              selectedOptions {
                name
                value
              }
              productEntityId
              variantEntityId
              originalPrice {
                value
                currencyCode
              }
              salePrice {
                value
                currencyCode
              }
            }
          }
        }
        subtotal {
          value
          currencyCode
        }
        estimatedTaxTotal {
          value
          currencyCode
        }
        cartAmount {
          value
          currencyCode
        }
      }
    }
  }
`;

export const CREATE_CART_MUTATION = `
  mutation CreateCart($input: CreateCartInput!) {
    cart {
      createCart(input: $input) {
        cart {
          entityId
          currencyCode
          lineItems {
            physicalItems {
              entityId
              name
              quantity
              productEntityId
            }
          }
          amount {
            value
            currencyCode
          }
        }
      }
    }
  }
`;

export const ADD_CART_ITEMS_MUTATION = `
  mutation AddCartItems($input: AddCartLineItemsInput!) {
    cart {
      addCartLineItems(input: $input) {
        cart {
          entityId
          lineItems {
            physicalItems {
              entityId
              name
              quantity
              productEntityId
            }
          }
          amount {
            value
            currencyCode
          }
        }
      }
    }
  }
`;

// Note: BigCommerce Storefront GraphQL API does not officially support:
// - deleteCartLineItem mutation
// - updateCartLineItem mutation
// To modify cart items, use addCartLineItems (add/replace) or the REST Storefront API (delete)

export const GET_BRANDS_QUERY = `
  query GetBrands {
    site {
      brands {
        edges {
          node {
            entityId
            name
            path
          }
        }
      }
    }
  }
`;
