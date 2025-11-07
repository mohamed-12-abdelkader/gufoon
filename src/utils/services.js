import axios from 'axios';
import baseUrl from '../api/baseUrl';

// Note: We set axis base URL in `AuthProvider`

export async function getTopLevelCategories() {
  try {
    const token = localStorage.getItem("token");
    const res = await baseUrl.get('/categories/top-level', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch {
    return [];
  }
}

// Query: limit, skip, orderBy, orderType
export async function getDiscountedGlasses({
  limit = 10,
  skip = 0,
  orderBy = 'createdAt',
  orderType = 'desc',
}) {
  const res = await axios.get('/products/discounted-glass-products', {
    params: { limit, skip, orderBy, orderType },
  });

  return res.data;
}

export async function getDiscountedLances({
  limit = 10,
  skip = 0,
  orderBy = 'createdAt',
  orderType = 'desc',
}) {
  const res = await axios.get('/products/discounted-lenses', {
    params: { limit, skip, orderBy, orderType },
  });

  return res.data;
}

export async function getProducts(query) {
  const res = await axios.get('/products', {
    params: query,
  });

  return res.data;
}

export async function getProductById(id) {
  const res = await baseUrl.get(`api/products/${id}`);
  return res.data;
}
