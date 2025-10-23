import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Country, Product, CryptoCurrency, FiatCurrency, IMFLoan, WBProject, Sanction, ForumPost } from '@/types/trade';
import Header from '@/components/trade/Header';
import Sidebar from '@/components/trade/Sidebar';
import DashboardTab from '@/components/trade/DashboardTab';
import SanctionsTab from '@/components/trade/SanctionsTab';
import ForumTab from '@/components/trade/ForumTab';

const Index = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sanctions, setSanctions] = useState<Sanction[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cryptoCurrencies, setCryptoCurrencies] = useState<CryptoCurrency[]>([
    { id: '1', name: 'DigiCoin', symbol: 'DGC', price: 42500, change24h: 2.5, marketCap: 800000000000, volume24h: 35000000000, priceHistory: [40000, 41000, 42000, 41500, 42500] },
    { id: '2', name: 'StateChain', symbol: 'STC', price: 2800, change24h: -1.2, marketCap: 320000000000, volume24h: 18000000000, priceHistory: [2900, 2850, 2820, 2800, 2800] },
    { id: '3', name: 'TradeToken', symbol: 'TRT', price: 1.05, change24h: 0.8, marketCap: 45000000000, volume24h: 3000000000, priceHistory: [1.02, 1.03, 1.04, 1.05, 1.05] },
    { id: '4', name: 'GlobalPay', symbol: 'GPY', price: 0.52, change24h: 5.2, marketCap: 23000000000, volume24h: 1200000000, priceHistory: [0.48, 0.49, 0.50, 0.51, 0.52] },
    { id: '5', name: 'FederalCoin', symbol: 'FDC', price: 125, change24h: -3.1, marketCap: 95000000000, volume24h: 7500000000, priceHistory: [130, 128, 126, 125, 125] },
  ]);

  const [fiatCurrencies, setFiatCurrencies] = useState<FiatCurrency[]>([
    { id: '1', name: 'US Dollar', code: 'USD', rate: 1.0, change24h: 0.0 },
    { id: '2', name: 'Euro', code: 'EUR', rate: 0.92, change24h: -0.15 },
    { id: '3', name: 'Russian Ruble', code: 'RUB', rate: 92.5, change24h: 0.8 },
    { id: '4', name: 'Chinese Yuan', code: 'CNY', rate: 7.24, change24h: -0.3 },
    { id: '5', name: 'British Pound', code: 'GBP', rate: 0.79, change24h: 0.2 },
    { id: '6', name: 'Japanese Yen', code: 'JPY', rate: 149.8, change24h: 0.5 },
  ]);

  const [imfLoans, setImfLoans] = useState<IMFLoan[]>([]);
  const [wbProjects, setWbProjects] = useState<WBProject[]>([]);

  const [sanctionForm, setSanctionForm] = useState({
    fromCountry: '',
    toCountry: '',
    type: 'tariff' as 'embargo' | 'tariff' | 'financial',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high'
  });

  const [forumPostForm, setForumPostForm] = useState({
    author: '',
    country: '',
    title: '',
    content: '',
    category: 'general' as 'general' | 'deals' | 'analysis' | 'news'
  });

  useEffect(() => {
    const savedCountries = localStorage.getItem('countries');
    const savedProducts = localStorage.getItem('products');
    const savedImfLoans = localStorage.getItem('imfLoans');
    const savedWbProjects = localStorage.getItem('wbProjects');
    const savedSanctions = localStorage.getItem('sanctions');
    const savedForumPosts = localStorage.getItem('forumPosts');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedCountries) setCountries(JSON.parse(savedCountries));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedImfLoans) setImfLoans(JSON.parse(savedImfLoans));
    if (savedWbProjects) setWbProjects(JSON.parse(savedWbProjects));
    if (savedSanctions) setSanctions(JSON.parse(savedSanctions));
    if (savedForumPosts) setForumPosts(JSON.parse(savedForumPosts));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));

    const cryptoInterval = setInterval(() => {
      if (!autoRefresh) return;
      setCryptoCurrencies(prev => prev.map(crypto => {
        const changePercent = (Math.random() - 0.5) * 5;
        const newPrice = Math.max(0.01, crypto.price * (1 + changePercent / 100));
        const newHistory = [...crypto.priceHistory.slice(-9), newPrice];
        return {
          ...crypto,
          price: newPrice,
          change24h: changePercent,
          priceHistory: newHistory
        };
      }));
    }, 5000);

    const fiatInterval = setInterval(() => {
      if (!autoRefresh) return;
      setFiatCurrencies(prev => prev.map(fiat => {
        if (fiat.code === 'USD') return fiat;
        const changePercent = (Math.random() - 0.5) * 0.5;
        return {
          ...fiat,
          rate: Math.max(0.01, fiat.rate * (1 + changePercent / 100)),
          change24h: changePercent
        };
      }));
    }, 8000);

    return () => {
      clearInterval(cryptoInterval);
      clearInterval(fiatInterval);
    };
  }, [autoRefresh]);

  useEffect(() => {
    localStorage.setItem('countries', JSON.stringify(countries));
  }, [countries]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('imfLoans', JSON.stringify(imfLoans));
  }, [imfLoans]);

  useEffect(() => {
    localStorage.setItem('wbProjects', JSON.stringify(wbProjects));
  }, [wbProjects]);

  useEffect(() => {
    localStorage.setItem('sanctions', JSON.stringify(sanctions));
  }, [sanctions]);

  useEffect(() => {
    localStorage.setItem('forumPosts', JSON.stringify(forumPosts));
  }, [forumPosts]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const totalTrade = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const activeDeals = products.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header
        totalTrade={totalTrade}
        activeDeals={activeDeals}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={notifications}
        setNotifications={setNotifications}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 container mx-auto px-4 py-8 lg:ml-0">
          {currentTab === 'dashboard' && (
            <DashboardTab
              countries={countries}
              products={products}
              sanctions={sanctions}
              forumPosts={forumPosts}
              totalTrade={totalTrade}
              activeDeals={activeDeals}
            />
          )}

          {currentTab === 'sanctions' && (
            <SanctionsTab
              countries={countries}
              sanctions={sanctions}
              setSanctions={setSanctions}
              sanctionForm={sanctionForm}
              setSanctionForm={setSanctionForm}
              notifications={notifications}
            />
          )}

          {currentTab === 'forum' && (
            <ForumTab
              countries={countries}
              forumPosts={forumPosts}
              setForumPosts={setForumPosts}
              forumPostForm={forumPostForm}
              setForumPostForm={setForumPostForm}
            />
          )}

          {currentTab === 'analytics' && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Вкладка "Аналитика" — в разработке</p>
              <p className="text-sm mt-2">Скоро здесь появятся графики и статистика</p>
            </div>
          )}

          {currentTab === 'country' && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Вкладка "Страна" — в разработке</p>
              <p className="text-sm mt-2">Здесь будет форма регистрации страны</p>
            </div>
          )}

          {currentTab === 'product' && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Вкладка "Товар" — в разработке</p>
              <p className="text-sm mt-2">Здесь будет форма добавления товара</p>
            </div>
          )}

          {currentTab === 'market' && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Вкладка "Рынок" — в разработке</p>
              <p className="text-sm mt-2">Здесь будет каталог товаров</p>
            </div>
          )}

          {currentTab === 'crypto' && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Вкладка "Криптобиржа" — в разработке</p>
              <p className="text-sm mt-2">Здесь будет торговля криптовалютами</p>
            </div>
          )}

          {currentTab === 'fiat' && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Вкладка "Валюты" — в разработке</p>
              <p className="text-sm mt-2">Здесь будут курсы валют</p>
            </div>
          )}

          {currentTab === 'organizations' && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Вкладка "Организации" — в разработке</p>
              <p className="text-sm mt-2">Здесь будут ВТО, МВФ и Всемирный банк</p>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-white dark:bg-gray-950 border-t dark:border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>GLOBAL TRADE SYSTEM © 2025 | Симулятор международной торговли</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
