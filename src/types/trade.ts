export interface Country {
  id: string;
  name: string;
  currency: string;
  exports: TradeItem[];
  imports: TradeItem[];
  partners: string;
  tradeNotes: string;
}

export interface TradeItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  partner: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  country: string;
  quantity: number;
  unit: string;
  price: number;
  availability: string[];
  condition: string;
  description: string;
  priceHistory?: number[];
}

export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  priceHistory: number[];
}

export interface FiatCurrency {
  id: string;
  name: string;
  code: string;
  rate: number;
  change24h: number;
}

export interface IMFLoan {
  id: string;
  country: string;
  amount: number;
  interestRate: number;
  purpose: string;
  status: 'pending' | 'approved' | 'repaid';
}

export interface WBProject {
  id: string;
  country: string;
  name: string;
  amount: number;
  sector: string;
  progress: number;
}

export interface Sanction {
  id: string;
  fromCountry: string;
  toCountry: string;
  type: 'embargo' | 'tariff' | 'financial';
  description: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}

export interface ForumPost {
  id: string;
  author: string;
  country: string;
  title: string;
  content: string;
  category: 'general' | 'deals' | 'analysis' | 'news';
  date: string;
  replies: number;
  likes: number;
}
