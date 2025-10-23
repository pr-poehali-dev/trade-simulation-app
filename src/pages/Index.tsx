import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface Country {
  id: string;
  name: string;
  currency: string;
  exports: TradeItem[];
  imports: TradeItem[];
  partners: string;
  tradeNotes: string;
}

interface TradeItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  partner: string;
}

interface Product {
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

interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  priceHistory: number[];
}

interface FiatCurrency {
  id: string;
  name: string;
  code: string;
  rate: number;
  change24h: number;
}

interface IMFLoan {
  id: string;
  country: string;
  amount: number;
  interestRate: number;
  purpose: string;
  status: 'pending' | 'approved' | 'repaid';
}

interface WBProject {
  id: string;
  country: string;
  name: string;
  amount: number;
  sector: string;
  progress: number;
}

const COLORS = ['#1E40AF', '#059669', '#F59E0B', '#DC2626', '#8B5CF6', '#EC4899'];

const Index = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price');

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
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null);

  useEffect(() => {
    const savedCountries = localStorage.getItem('countries');
    const savedProducts = localStorage.getItem('products');
    const savedImfLoans = localStorage.getItem('imfLoans');
    const savedWbProjects = localStorage.getItem('wbProjects');
    
    if (savedCountries) setCountries(JSON.parse(savedCountries));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedImfLoans) setImfLoans(JSON.parse(savedImfLoans));
    if (savedWbProjects) setWbProjects(JSON.parse(savedWbProjects));

    const cryptoInterval = setInterval(() => {
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
  }, []);

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

  const totalTrade = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const activeDeals = products.length;

  const [countryForm, setCountryForm] = useState({
    name: '',
    currency: '',
    exports: [{ id: '1', name: '', quantity: 0, price: 0, partner: '' }],
    imports: [{ id: '1', name: '', quantity: 0, price: 0, partner: '' }],
    partners: '',
    tradeNotes: ''
  });

  const [productForm, setProductForm] = useState({
    name: '',
    type: 'raw',
    country: '',
    quantity: 0,
    unit: 'units',
    price: 0,
    availability: [] as string[],
    condition: 'new',
    description: ''
  });

  const [imfLoanForm, setImfLoanForm] = useState({
    country: '',
    amount: 0,
    interestRate: 3.5,
    purpose: ''
  });

  const [wbProjectForm, setWbProjectForm] = useState({
    country: '',
    name: '',
    amount: 0,
    sector: 'infrastructure'
  });

  const addExportRow = () => {
    setCountryForm(prev => ({
      ...prev,
      exports: [...prev.exports, { id: Date.now().toString(), name: '', quantity: 0, price: 0, partner: '' }]
    }));
  };

  const addImportRow = () => {
    setCountryForm(prev => ({
      ...prev,
      imports: [...prev.imports, { id: Date.now().toString(), name: '', quantity: 0, price: 0, partner: '' }]
    }));
  };

  const removeExportRow = (id: string) => {
    setCountryForm(prev => ({
      ...prev,
      exports: prev.exports.filter(e => e.id !== id)
    }));
  };

  const removeImportRow = (id: string) => {
    setCountryForm(prev => ({
      ...prev,
      imports: prev.imports.filter(i => i.id !== id)
    }));
  };

  const updateExportRow = (id: string, field: string, value: any) => {
    setCountryForm(prev => ({
      ...prev,
      exports: prev.exports.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const updateImportRow = (id: string, field: string, value: any) => {
    setCountryForm(prev => ({
      ...prev,
      imports: prev.imports.map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  const calculateTradeBalance = () => {
    const exportTotal = countryForm.exports.reduce((sum, e) => sum + (e.quantity * e.price), 0);
    const importTotal = countryForm.imports.reduce((sum, i) => sum + (i.quantity * i.price), 0);
    return exportTotal - importTotal;
  };

  const handleCountrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryForm.name || !countryForm.currency) {
      toast.error('Заполните название страны и валюту');
      return;
    }
    const newCountry: Country = {
      id: Date.now().toString(),
      name: countryForm.name,
      currency: countryForm.currency,
      exports: countryForm.exports.filter(e => e.name),
      imports: countryForm.imports.filter(i => i.name),
      partners: countryForm.partners,
      tradeNotes: countryForm.tradeNotes
    };
    setCountries([...countries, newCountry]);
    toast.success(`Страна ${newCountry.name} зарегистрирована!`);
    setCountryForm({
      name: '',
      currency: '',
      exports: [{ id: '1', name: '', quantity: 0, price: 0, partner: '' }],
      imports: [{ id: '1', name: '', quantity: 0, price: 0, partner: '' }],
      partners: '',
      tradeNotes: ''
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.country || productForm.quantity <= 0 || productForm.price <= 0) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productForm,
      priceHistory: [productForm.price]
    };
    setProducts([...products, newProduct]);
    toast.success(`Товар ${newProduct.name} выставлен на рынок!`);
    setProductForm({
      name: '',
      type: 'raw',
      country: '',
      quantity: 0,
      unit: 'units',
      price: 0,
      availability: [],
      condition: 'new',
      description: ''
    });
  };

  const handlePurchase = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(`Сделка подтверждена: ${product.name} от ${product.country}`);
    }
  };

  const handleIMFLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imfLoanForm.country || imfLoanForm.amount <= 0) {
      toast.error('Заполните все поля');
      return;
    }
    const newLoan: IMFLoan = {
      id: Date.now().toString(),
      ...imfLoanForm,
      status: 'pending'
    };
    setImfLoans([...imfLoans, newLoan]);
    toast.success('Заявка на кредит МВФ отправлена!');
    setImfLoanForm({ country: '', amount: 0, interestRate: 3.5, purpose: '' });
  };

  const handleWBProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wbProjectForm.country || !wbProjectForm.name || wbProjectForm.amount <= 0) {
      toast.error('Заполните все поля');
      return;
    }
    const newProject: WBProject = {
      id: Date.now().toString(),
      ...wbProjectForm,
      progress: 0
    };
    setWbProjects([...wbProjects, newProject]);
    toast.success('Проект Всемирного банка создан!');
    setWbProjectForm({ country: '', name: '', amount: 0, sector: 'infrastructure' });
  };

  const filteredProducts = products
    .filter(p => filterType === 'all' || p.type === filterType)
    .filter(p => filterCountry === 'all' || p.country === filterCountry)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'quantity') return b.quantity - a.quantity;
      return 0;
    });

  const getTradeDistributionData = () => {
    const typeCount: { [key: string]: number } = {};
    products.forEach(p => {
      typeCount[p.type] = (typeCount[p.type] || 0) + 1;
    });
    return Object.entries(typeCount).map(([name, value]) => ({ name, value }));
  };

  const getCountryTradeData = () => {
    return countries.slice(0, 5).map(country => {
      const exportTotal = country.exports.reduce((sum, e) => sum + (e.quantity * e.price), 0);
      const importTotal = country.imports.reduce((sum, i) => sum + (i.quantity * i.price), 0);
      return {
        name: country.name.slice(0, 10),
        Экспорт: exportTotal,
        Импорт: importTotal
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Globe" size={32} className="text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">GLOBAL TRADE SYSTEM</h1>
                <p className="text-sm text-muted-foreground">International Commerce Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Объём торговли</div>
                <div className="text-lg font-bold text-secondary">${totalTrade.toFixed(2)}</div>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Активных сделок</div>
                <div className="text-lg font-bold text-primary">{activeDeals}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-8 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Icon name="BarChart3" size={16} />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Icon name="LineChart" size={16} />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="country" className="flex items-center gap-2">
              <Icon name="Flag" size={16} />
              Страна
            </TabsTrigger>
            <TabsTrigger value="product" className="flex items-center gap-2">
              <Icon name="Package" size={16} />
              Товар
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <Icon name="ShoppingCart" size={16} />
              Рынок
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Icon name="Bitcoin" size={16} />
              Криптобиржа
            </TabsTrigger>
            <TabsTrigger value="fiat" className="flex items-center gap-2">
              <Icon name="DollarSign" size={16} />
              Валюты
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center gap-2">
              <Icon name="Building2" size={16} />
              Организации
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Зарегистрировано стран</CardTitle>
                  <Icon name="Globe" className="text-primary" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{countries.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">Участников торговой системы</p>
                </CardContent>
              </Card>

              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Товаров на рынке</CardTitle>
                  <Icon name="Package" className="text-secondary" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">{products.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">Доступно для покупки</p>
                </CardContent>
              </Card>

              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Общий объём торговли</CardTitle>
                  <Icon name="TrendingUp" className="text-accent" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">${totalTrade.toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground mt-2">Суммарная стоимость товаров</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Globe" size={20} />
                  Зарегистрированные страны
                </CardTitle>
                <CardDescription>Участники международной торговой системы</CardDescription>
              </CardHeader>
              <CardContent>
                {countries.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Globe" size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Пока нет зарегистрированных стран</p>
                    <p className="text-sm mt-2">Перейдите на вкладку "Страна" для регистрации</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {countries.map(country => {
                      const exportTotal = country.exports.reduce((sum, e) => sum + (e.quantity * e.price), 0);
                      const importTotal = country.imports.reduce((sum, i) => sum + (i.quantity * i.price), 0);
                      const balance = exportTotal - importTotal;
                      return (
                        <Card key={country.id} className="hover-scale">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <Icon name="Flag" size={18} />
                                {country.name}
                              </span>
                              <Badge variant={balance > 0 ? "default" : "destructive"}>
                                {balance > 0 ? '+' : ''}{balance.toFixed(0)} {country.currency}
                              </Badge>
                            </CardTitle>
                            <CardDescription>Валюта: {country.currency}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Экспорт:</span>
                              <span className="font-medium text-secondary">{exportTotal.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Импорт:</span>
                              <span className="font-medium text-destructive">{importTotal.toFixed(0)}</span>
                            </div>
                            {country.partners && (
                              <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                                Партнёры: {country.partners}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="PieChart" size={20} />
                    Распределение товаров по типам
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {products.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getTradeDistributionData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getTradeDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Нет данных для отображения
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart3" size={20} />
                    Торговый баланс стран
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {countries.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getCountryTradeData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Экспорт" fill="#059669" />
                        <Bar dataKey="Импорт" fill="#DC2626" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Нет данных для отображения
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} />
                  Динамика цен на криптовалюты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cryptoCurrencies[0].priceHistory.map((price, idx) => ({
                    time: idx,
                    [cryptoCurrencies[0].name]: price,
                    [cryptoCurrencies[1].name]: cryptoCurrencies[1].priceHistory[idx]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={cryptoCurrencies[0].name} stroke="#1E40AF" strokeWidth={2} />
                    <Line type="monotone" dataKey={cryptoCurrencies[1].name} stroke="#059669" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="country" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Flag" size={24} />
                  Регистрация страны
                </CardTitle>
                <CardDescription>Заполните информацию о торговых показателях вашей страны</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCountrySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="countryName">Название страны *</Label>
                      <Input
                        id="countryName"
                        value={countryForm.name}
                        onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })}
                        placeholder="Например: Российская Федерация"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Валюта *</Label>
                      <Input
                        id="currency"
                        value={countryForm.currency}
                        onChange={(e) => setCountryForm({ ...countryForm, currency: e.target.value })}
                        placeholder="Например: RUB"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Icon name="TrendingUp" className="text-secondary" size={20} />
                        Экспорт
                      </Label>
                      <Button type="button" onClick={addExportRow} variant="outline" size="sm">
                        <Icon name="Plus" size={16} className="mr-1" />
                        Добавить
                      </Button>
                    </div>
                    {countryForm.exports.map((exp) => (
                      <div key={exp.id} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-4">
                          <Label className="text-xs">Товар</Label>
                          <Input
                            value={exp.name}
                            onChange={(e) => updateExportRow(exp.id, 'name', e.target.value)}
                            placeholder="Название"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Кол-во</Label>
                          <Input
                            type="number"
                            value={exp.quantity}
                            onChange={(e) => updateExportRow(exp.id, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Цена</Label>
                          <Input
                            type="number"
                            value={exp.price}
                            onChange={(e) => updateExportRow(exp.id, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-3">
                          <Label className="text-xs">Покупатель</Label>
                          <Input
                            value={exp.partner}
                            onChange={(e) => updateExportRow(exp.id, 'partner', e.target.value)}
                            placeholder="Страна"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExportRow(exp.id)}
                            disabled={countryForm.exports.length === 1}
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Icon name="TrendingDown" className="text-destructive" size={20} />
                        Импорт
                      </Label>
                      <Button type="button" onClick={addImportRow} variant="outline" size="sm">
                        <Icon name="Plus" size={16} className="mr-1" />
                        Добавить
                      </Button>
                    </div>
                    {countryForm.imports.map((imp) => (
                      <div key={imp.id} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-4">
                          <Label className="text-xs">Товар</Label>
                          <Input
                            value={imp.name}
                            onChange={(e) => updateImportRow(imp.id, 'name', e.target.value)}
                            placeholder="Название"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Кол-во</Label>
                          <Input
                            type="number"
                            value={imp.quantity}
                            onChange={(e) => updateImportRow(imp.id, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Цена</Label>
                          <Input
                            type="number"
                            value={imp.price}
                            onChange={(e) => updateImportRow(imp.id, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-3">
                          <Label className="text-xs">Продавец</Label>
                          <Input
                            value={imp.partner}
                            onChange={(e) => updateImportRow(imp.id, 'partner', e.target.value)}
                            placeholder="Страна"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImportRow(imp.id)}
                            disabled={countryForm.imports.length === 1}
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon name="Scale" size={18} />
                        Торговый баланс
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        <span className={calculateTradeBalance() >= 0 ? 'text-secondary' : 'text-destructive'}>
                          {calculateTradeBalance() >= 0 ? '+' : ''}{calculateTradeBalance().toFixed(2)}
                        </span>
                        <span className="text-lg ml-2 text-muted-foreground">{countryForm.currency || 'валюта'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="partners">Основные торговые партнёры</Label>
                      <Input
                        id="partners"
                        value={countryForm.partners}
                        onChange={(e) => setCountryForm({ ...countryForm, partners: e.target.value })}
                        placeholder="Например: США, Китай, ЕС"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tradeNotes">Особенности торговли</Label>
                      <Input
                        id="tradeNotes"
                        value={countryForm.tradeNotes}
                        onChange={(e) => setCountryForm({ ...countryForm, tradeNotes: e.target.value })}
                        placeholder="Например: Член ВТО, свободная экономическая зона"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить страну
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="product" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Package" size={24} />
                  Выставить товар на продажу
                </CardTitle>
                <CardDescription>Заполните информацию о товаре для размещения на рынке</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Название товара *</Label>
                      <Input
                        id="productName"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Например: Нефть сырая"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productType">Тип товара *</Label>
                      <Select value={productForm.type} onValueChange={(value) => setProductForm({ ...productForm, type: value })}>
                        <SelectTrigger id="productType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="raw">Сырьё</SelectItem>
                          <SelectItem value="weapons">Вооружение</SelectItem>
                          <SelectItem value="tech">Технология</SelectItem>
                          <SelectItem value="service">Услуга</SelectItem>
                          <SelectItem value="food">Продовольствие</SelectItem>
                          <SelectItem value="industrial">Промышленные товары</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productCountry">Страна-производитель *</Label>
                      <Select value={productForm.country} onValueChange={(value) => setProductForm({ ...productForm, country: value })}>
                        <SelectTrigger id="productCountry">
                          <SelectValue placeholder="Выберите страну" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(c => (
                            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productCondition">Состояние</Label>
                      <Select value={productForm.condition} onValueChange={(value) => setProductForm({ ...productForm, condition: value })}>
                        <SelectTrigger id="productCondition">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Новый</SelectItem>
                          <SelectItem value="used">Б/У</SelectItem>
                          <SelectItem value="refurbished">Восстановленный</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productQuantity">Количество *</Label>
                      <Input
                        id="productQuantity"
                        type="number"
                        value={productForm.quantity}
                        onChange={(e) => setProductForm({ ...productForm, quantity: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productUnit">Единица измерения</Label>
                      <Input
                        id="productUnit"
                        value={productForm.unit}
                        onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                        placeholder="шт, кг, тонны"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productPrice">Цена за единицу *</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Общая стоимость:</span>
                        <span className="text-2xl font-bold text-accent">
                          ${(productForm.quantity * productForm.price).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Описание и особенности</Label>
                    <Input
                      id="productDescription"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Дополнительная информация о товаре"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    Выставить на продажу
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="ShoppingCart" size={24} />
                  Международный рынок товаров
                </CardTitle>
                <CardDescription>Фильтруйте и покупайте товары от разных стран</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Тип товара</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все типы</SelectItem>
                        <SelectItem value="raw">Сырьё</SelectItem>
                        <SelectItem value="weapons">Вооружение</SelectItem>
                        <SelectItem value="tech">Технология</SelectItem>
                        <SelectItem value="service">Услуга</SelectItem>
                        <SelectItem value="food">Продовольствие</SelectItem>
                        <SelectItem value="industrial">Промышленные товары</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Страна</Label>
                    <Select value={filterCountry} onValueChange={setFilterCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все страны</SelectItem>
                        {countries.map(c => (
                          <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Сортировка</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">По цене</SelectItem>
                        <SelectItem value="quantity">По количеству</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Package" size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Нет товаров, соответствующих фильтрам</p>
                    <p className="text-sm mt-2">Измените фильтры или добавьте товары на вкладке "Товар"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map(product => (
                      <Card key={product.id} className="hover-scale">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base">{product.name}</CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <Icon name="Flag" size={12} />
                                {product.country}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">{
                              product.type === 'raw' ? 'Сырьё' :
                              product.type === 'weapons' ? 'Вооружение' :
                              product.type === 'tech' ? 'Технология' :
                              product.type === 'service' ? 'Услуга' :
                              product.type === 'food' ? 'Продовольствие' :
                              'Промышленные'
                            }</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Количество:</span>
                              <span className="font-medium">{product.quantity} {product.unit}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Цена за единицу:</span>
                              <span className="font-medium text-primary">${product.price.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                              <span className="font-semibold">Общая стоимость:</span>
                              <span className="text-xl font-bold text-accent">
                                ${(product.quantity * product.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {product.description && (
                            <p className="text-xs text-muted-foreground border-t pt-2">{product.description}</p>
                          )}
                          <Button onClick={() => handlePurchase(product.id)} className="w-full">
                            <Icon name="ShoppingCart" size={16} className="mr-2" />
                            Купить
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Bitcoin" size={24} />
                  Криптовалютная биржа
                </CardTitle>
                <CardDescription>Торговля цифровыми активами в режиме реального времени</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {cryptoCurrencies.map(crypto => (
                    <Dialog key={crypto.id}>
                      <DialogTrigger asChild>
                        <Card className="hover-scale cursor-pointer" onClick={() => setSelectedCrypto(crypto)}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Icon name="Bitcoin" className="text-primary" size={20} />
                                </div>
                                <div>
                                  <div className="font-bold">{crypto.name}</div>
                                  <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold">${crypto.price.toFixed(2)}</div>
                                <Badge variant={crypto.change24h >= 0 ? "default" : "destructive"}>
                                  {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Капитализация</div>
                                <div className="font-medium">${(crypto.marketCap / 1e9).toFixed(2)}B</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Объём 24ч</div>
                                <div className="font-medium">${(crypto.volume24h / 1e9).toFixed(2)}B</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Icon name="Bitcoin" size={24} />
                            {crypto.name} ({crypto.symbol})
                          </DialogTitle>
                          <DialogDescription>
                            Текущая цена: ${crypto.price.toFixed(2)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={crypto.priceHistory.map((price, idx) => ({ time: idx, price }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="price" stroke="#1E40AF" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                          <div className="grid grid-cols-2 gap-4">
                            <Button className="w-full">
                              <Icon name="TrendingUp" size={16} className="mr-2" />
                              Купить
                            </Button>
                            <Button variant="outline" className="w-full">
                              <Icon name="TrendingDown" size={16} className="mr-2" />
                              Продать
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fiat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="DollarSign" size={24} />
                  Валютный рынок
                </CardTitle>
                <CardDescription>Курсы фиатных валют в реальном времени</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fiatCurrencies.map(currency => (
                    <Card key={currency.id} className="hover-scale">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-lg">{currency.code}</div>
                            <div className="text-sm text-muted-foreground">{currency.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">{currency.rate.toFixed(4)}</div>
                            <Badge variant={currency.change24h >= 0 ? "default" : "destructive"} className="text-xs">
                              {currency.change24h >= 0 ? '+' : ''}{currency.change24h.toFixed(2)}%
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <Tabs defaultValue="wto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="wto">
                  <Icon name="Scale" size={16} className="mr-2" />
                  ВТО
                </TabsTrigger>
                <TabsTrigger value="imf">
                  <Icon name="Building" size={16} className="mr-2" />
                  МВФ
                </TabsTrigger>
                <TabsTrigger value="wb">
                  <Icon name="Landmark" size={16} className="mr-2" />
                  Всемирный банк
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wto" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Scale" size={24} className="text-primary" />
                      Всемирная торговая организация (ВТО)
                    </CardTitle>
                    <CardDescription>Регулирование международной торговли и разрешение споров</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 text-center">
                          <Icon name="Users" size={32} className="mx-auto mb-2 text-primary" />
                          <div className="text-2xl font-bold">{countries.length}</div>
                          <div className="text-sm text-muted-foreground">Стран-членов</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 text-center">
                          <Icon name="FileText" size={32} className="mx-auto mb-2 text-secondary" />
                          <div className="text-2xl font-bold">0</div>
                          <div className="text-sm text-muted-foreground">Активных споров</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 text-center">
                          <Icon name="CheckCircle" size={32} className="mx-auto mb-2 text-accent" />
                          <div className="text-2xl font-bold">0</div>
                          <div className="text-sm text-muted-foreground">Разрешённых дел</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Функции ВТО</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Icon name="CheckCircle" className="text-secondary mt-1" size={16} />
                          <div>
                            <div className="font-semibold">Торговые переговоры</div>
                            <div className="text-sm text-muted-foreground">Проведение многосторонних торговых раундов</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Icon name="CheckCircle" className="text-secondary mt-1" size={16} />
                          <div>
                            <div className="font-semibold">Разрешение споров</div>
                            <div className="text-sm text-muted-foreground">Арбитраж в торговых конфликтах между странами</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Icon name="CheckCircle" className="text-secondary mt-1" size={16} />
                          <div>
                            <div className="font-semibold">Мониторинг политики</div>
                            <div className="text-sm text-muted-foreground">Отслеживание торговой политики членов организации</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="imf" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Building" size={24} className="text-secondary" />
                      Международный валютный фонд (МВФ)
                    </CardTitle>
                    <CardDescription>Финансовая помощь и экономическое консультирование</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 text-center">
                          <Icon name="DollarSign" size={32} className="mx-auto mb-2 text-secondary" />
                          <div className="text-2xl font-bold">${imfLoans.reduce((sum, l) => sum + l.amount, 0).toFixed(0)}B</div>
                          <div className="text-sm text-muted-foreground">Выдано кредитов</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 text-center">
                          <Icon name="FileText" size={32} className="mx-auto mb-2 text-primary" />
                          <div className="text-2xl font-bold">{imfLoans.filter(l => l.status === 'pending').length}</div>
                          <div className="text-sm text-muted-foreground">Заявок на рассмотрении</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 text-center">
                          <Icon name="TrendingUp" size={32} className="mx-auto mb-2 text-accent" />
                          <div className="text-2xl font-bold">3.5%</div>
                          <div className="text-sm text-muted-foreground">Средняя ставка</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Подать заявку на кредит</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleIMFLoanSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Страна</Label>
                              <Select value={imfLoanForm.country} onValueChange={(value) => setImfLoanForm({ ...imfLoanForm, country: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите страну" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map(c => (
                                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Сумма (млрд $)</Label>
                              <Input
                                type="number"
                                value={imfLoanForm.amount}
                                onChange={(e) => setImfLoanForm({ ...imfLoanForm, amount: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Процентная ставка: {imfLoanForm.interestRate}%</Label>
                            <Input
                              type="range"
                              min="1"
                              max="10"
                              step="0.5"
                              value={imfLoanForm.interestRate}
                              onChange={(e) => setImfLoanForm({ ...imfLoanForm, interestRate: parseFloat(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Цель кредита</Label>
                            <Input
                              value={imfLoanForm.purpose}
                              onChange={(e) => setImfLoanForm({ ...imfLoanForm, purpose: e.target.value })}
                              placeholder="Например: стабилизация экономики"
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            <Icon name="Send" size={16} className="mr-2" />
                            Подать заявку
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {imfLoans.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Активные кредиты</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {imfLoans.map(loan => (
                              <Card key={loan.id} className="bg-muted/30">
                                <CardContent className="pt-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="font-semibold">{loan.country}</div>
                                    <Badge variant={
                                      loan.status === 'approved' ? 'default' :
                                      loan.status === 'pending' ? 'secondary' : 'outline'
                                    }>
                                      {loan.status === 'approved' ? 'Одобрен' : loan.status === 'pending' ? 'На рассмотрении' : 'Погашен'}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <div className="text-muted-foreground">Сумма</div>
                                      <div className="font-medium">${loan.amount}B</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground">Ставка</div>
                                      <div className="font-medium">{loan.interestRate}%</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground">Цель</div>
                                      <div className="font-medium truncate">{loan.purpose}</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wb" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Landmark" size={24} className="text-accent" />
                      Всемирный банк
                    </CardTitle>
                    <CardDescription>Финансирование проектов развития и сокращения бедности</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 text-center">
                          <Icon name="FolderOpen" size={32} className="mx-auto mb-2 text-accent" />
                          <div className="text-2xl font-bold">{wbProjects.length}</div>
                          <div className="text-sm text-muted-foreground">Активных проектов</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 text-center">
                          <Icon name="DollarSign" size={32} className="mx-auto mb-2 text-secondary" />
                          <div className="text-2xl font-bold">${wbProjects.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}B</div>
                          <div className="text-sm text-muted-foreground">Выделено средств</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 text-center">
                          <Icon name="Globe" size={32} className="mx-auto mb-2 text-primary" />
                          <div className="text-2xl font-bold">{new Set(wbProjects.map(p => p.country)).size}</div>
                          <div className="text-sm text-muted-foreground">Стран-получателей</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Создать проект</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleWBProjectSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Страна</Label>
                              <Select value={wbProjectForm.country} onValueChange={(value) => setWbProjectForm({ ...wbProjectForm, country: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите страну" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map(c => (
                                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Сектор</Label>
                              <Select value={wbProjectForm.sector} onValueChange={(value) => setWbProjectForm({ ...wbProjectForm, sector: value })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="infrastructure">Инфраструктура</SelectItem>
                                  <SelectItem value="education">Образование</SelectItem>
                                  <SelectItem value="healthcare">Здравоохранение</SelectItem>
                                  <SelectItem value="agriculture">Сельское хозяйство</SelectItem>
                                  <SelectItem value="energy">Энергетика</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Название проекта</Label>
                            <Input
                              value={wbProjectForm.name}
                              onChange={(e) => setWbProjectForm({ ...wbProjectForm, name: e.target.value })}
                              placeholder="Например: Модернизация дорог"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Финансирование (млн $)</Label>
                            <Input
                              type="number"
                              value={wbProjectForm.amount}
                              onChange={(e) => setWbProjectForm({ ...wbProjectForm, amount: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            <Icon name="Plus" size={16} className="mr-2" />
                            Создать проект
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {wbProjects.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Портфель проектов</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {wbProjects.map(project => (
                              <Card key={project.id} className="bg-muted/30">
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <div className="font-semibold">{project.name}</div>
                                      <div className="text-sm text-muted-foreground">{project.country} • {project.sector}</div>
                                    </div>
                                    <Badge>${project.amount}M</Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Прогресс</span>
                                      <span className="font-medium">{project.progress}%</span>
                                    </div>
                                    <Progress value={project.progress} className="h-2" />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>GLOBAL TRADE SYSTEM © 2025 | Симулятор международной торговли</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
