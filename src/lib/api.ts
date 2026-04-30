const CORE_API = import.meta.env.VITE_CORE_API_URL ?? 'http://localhost:8000';
const ANALYTICS_API = import.meta.env.VITE_ANALYTICS_API_URL ?? 'http://localhost:8001';

function getToken(): string | null {
  return localStorage.getItem('access_token');
}

async function request<T>(baseUrl: string, path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  user_id: string;
  name: string;
  image: string | null;
  batch_quantity: number;
  remaining_quantity: number;
  batch_cost: number;
  selling_price: number;
  category: string | null;
  status: 'hot' | 'stable' | 'dead';
  created_at: string;
}

export interface ProductPayload {
  name: string;
  image?: string;
  batch_quantity: number;
  remaining_quantity: number;
  batch_cost: number;
  selling_price: number;
  category?: string;
  status: 'hot' | 'stable' | 'dead';
}

export interface TransactionPayload {
  product_id: string;
  quantity: number;
  type: 'sale' | 'restock';
}

export interface AnalyticsSummary {
  total_revenue: number;
  total_cost: number;
  net_profit: number;
  roi: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  status: string;
  units_sold: number;
  revenue: number;
  cost: number;
  profit: number;
  roi: number;
}

export interface CashflowMonth {
  month: string;
  earned: number;
  spent: number;
  net: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

const auth = {
  register: (email: string, password: string) =>
    request<TokenResponse>(CORE_API, '/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<TokenResponse>(CORE_API, '/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// ─── Products ────────────────────────────────────────────────────────────────

const products = {
  list: () => request<Product[]>(CORE_API, '/products'),
  create: (data: ProductPayload) =>
    request<Product>(CORE_API, '/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ProductPayload>) =>
    request<Product>(CORE_API, `/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(CORE_API, `/products/${id}`, { method: 'DELETE' }),
};

// ─── Transactions ─────────────────────────────────────────────────────────────

const transactions = {
  create: (data: TransactionPayload) =>
    request<unknown>(CORE_API, '/transactions', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Analytics ───────────────────────────────────────────────────────────────

const analytics = {
  summary: () => request<AnalyticsSummary>(ANALYTICS_API, '/analytics/summary'),
  topProducts: () => request<TopProduct[]>(ANALYTICS_API, '/analytics/top-products'),
  underperformers: () => request<TopProduct[]>(ANALYTICS_API, '/analytics/underperformers'),
  cashflow: () => request<CashflowMonth[]>(ANALYTICS_API, '/analytics/cashflow'),
};

const api = { auth, products, transactions, analytics };
export default api;
