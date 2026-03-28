import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/api/v1/auth/refresh`, { refresh_token: refreshToken });
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          error.config.headers.Authorization = `Bearer ${res.data.access_token}`;
          return api(error.config);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; full_name: string; country_code: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/me', data),
};
export const portfolioAPI = {
  list: () => api.get('/portfolio/'),
  get: (id: string) => api.get(`/portfolio/${id}`),
  create: (data: { name: string; currency?: string }) => api.post('/portfolio/', data),
  update: (id: string, data: any) => api.put(`/portfolio/${id}`, data),
  delete: (id: string) => api.delete(`/portfolio/${id}`),
  getHoldings: (id: string) => api.get(`/portfolio/${id}/holdings`),
  addHolding: (portfolioId: string, data: any) => api.post(`/portfolio/${portfolioId}/holdings`, data),
  deleteHolding: (portfolioId: string, holdingId: string) => api.delete(`/portfolio/${portfolioId}/holdings/${holdingId}`),
  getMetrics: (id: string) => api.get(`/portfolio/${id}/metrics`),
  optimize: (id: string, data: any) => api.post(`/portfolio/${id}/optimize`, data),
  xray: (id: string) => api.get(`/portfolio/${id}/xray`),
};
export const marketAPI = {
  getQuote: (ticker: string) => api.get(`/market/quote/${ticker}`),
  getHistory: (ticker: string, period?: string) => api.get(`/market/history/${ticker}`, { params: { period } }),
  getFundamentals: (ticker: string) => api.get(`/market/fundamentals/${ticker}`),
  search: (query: string) => api.get('/market/search', { params: { q: query } }),
  batchQuotes: (tickers: string[]) => api.post('/market/quotes/batch', tickers),
};
export const newsAPI = {
  getFeed: (params?: { country?: string; trust_min?: number; limit?: number }) => api.get('/news/feed', { params }),
  getArticle: (id: string) => api.get(`/news/article/${id}`),
  getSentiment: (ticker: string) => api.get(`/news/sentiment/${ticker}`),
  triggerIngestion: () => api.post('/news/ingest'),
};
export const geoAPI = {
  getCountryRisk: (code: string) => api.get(`/geo/country/${code}/risk-score`),
  getSectorImpact: (code: string) => api.get(`/geo/country/${code}/sectors`),
  getPortfolioExposure: (portfolioId: string) => api.post('/geo/portfolio/exposure', null, { params: { portfolio_id: portfolioId } }),
  getCountriesOverview: () => api.get('/geo/countries/overview'),
};
export const aiAPI = {
  chat: (data: { message: string; conversation_id?: string; context?: any }) => api.post('/ai/chat', data),
  getConversations: () => api.get('/ai/conversations'),
  getConversation: (id: string) => api.get(`/ai/conversations/${id}`),
};
export const causalAPI = {
  traceChain: (data: { event_type: string; source_country?: string }) => api.post('/causal/trace', data),
  getActiveChains: () => api.get('/causal/chains/active'),
  getPortfolioRisks: (portfolioId: string) => api.get(`/causal/portfolio/${portfolioId}/hidden-risk`),
};
export const riskAPI = {
  submitProfile: (answers: any) => api.post('/risk/profile', answers),
  getMyProfile: () => api.get('/risk/profile/me'),
};
export const scenarioAPI = {
  simulate: (data: { portfolio_id: string; scenarios: any[] }) => api.post('/scenario/simulate', data),
};
export const graphAPI = {
  query: (entity: string, depth?: number) => api.get('/graph/query', { params: { entity, depth } }),
};
export default api;
