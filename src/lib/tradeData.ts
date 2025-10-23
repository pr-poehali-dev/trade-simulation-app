export const COLORS = ['#1E40AF', '#059669', '#F59E0B', '#DC2626', '#8B5CF6', '#EC4899'];

export const initialCryptos = [
  { id: '1', name: 'DigiCoin', symbol: 'DGC', price: 42500, change24h: 2.5, marketCap: 800000000000, volume24h: 35000000000, priceHistory: [40000, 41000, 42000, 41500, 42500] },
  { id: '2', name: 'StateChain', symbol: 'STC', price: 2800, change24h: -1.2, marketCap: 320000000000, volume24h: 18000000000, priceHistory: [2900, 2850, 2820, 2800, 2800] },
  { id: '3', name: 'TradeToken', symbol: 'TRT', price: 1.05, change24h: 0.8, marketCap: 45000000000, volume24h: 3000000000, priceHistory: [1.02, 1.03, 1.04, 1.05, 1.05] },
  { id: '4', name: 'GlobalPay', symbol: 'GPY', price: 0.52, change24h: 5.2, marketCap: 23000000000, volume24h: 1200000000, priceHistory: [0.48, 0.49, 0.50, 0.51, 0.52] },
  { id: '5', name: 'FederalCoin', symbol: 'FDC', price: 125, change24h: -3.1, marketCap: 95000000000, volume24h: 7500000000, priceHistory: [130, 128, 126, 125, 125] },
];

export const initialFiats = [
  { id: '1', name: 'US Dollar', code: 'USD', rate: 1.0, change24h: 0.0 },
  { id: '2', name: 'Euro', code: 'EUR', rate: 0.92, change24h: -0.15 },
  { id: '3', name: 'Russian Ruble', code: 'RUB', rate: 92.5, change24h: 0.8 },
  { id: '4', name: 'Chinese Yuan', code: 'CNY', rate: 7.24, change24h: -0.3 },
  { id: '5', name: 'British Pound', code: 'GBP', rate: 0.79, change24h: 0.2 },
  { id: '6', name: 'Japanese Yen', code: 'JPY', rate: 149.8, change24h: 0.5 },
];

export const menuItems = [
  { id: 'dashboard', icon: 'BarChart3', label: 'Дашборд' },
  { id: 'analytics', icon: 'LineChart', label: 'Аналитика' },
  { id: 'country', icon: 'Flag', label: 'Страна' },
  { id: 'product', icon: 'Package', label: 'Товар' },
  { id: 'market', icon: 'ShoppingCart', label: 'Рынок' },
  { id: 'crypto', icon: 'Bitcoin', label: 'Криптобиржа' },
  { id: 'fiat', icon: 'DollarSign', label: 'Валюты' },
  { id: 'sanctions', icon: 'AlertTriangle', label: 'Санкции' },
  { id: 'forum', icon: 'MessageSquare', label: 'Форум' },
  { id: 'organizations', icon: 'Building2', label: 'Организации' },
];
