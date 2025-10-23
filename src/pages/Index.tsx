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
}

const Index = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price');

  useEffect(() => {
    const savedCountries = localStorage.getItem('countries');
    const savedProducts = localStorage.getItem('products');
    if (savedCountries) setCountries(JSON.parse(savedCountries));
    if (savedProducts) setProducts(JSON.parse(savedProducts));

    const priceInterval = setInterval(() => {
      setProducts(prev => prev.map(p => ({
        ...p,
        price: Math.max(1, p.price * (0.95 + Math.random() * 0.1))
      })));
    }, 10000);

    return () => clearInterval(priceInterval);
  }, []);

  useEffect(() => {
    localStorage.setItem('countries', JSON.stringify(countries));
  }, [countries]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

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
      ...productForm
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

  const filteredProducts = products
    .filter(p => filterType === 'all' || p.type === filterType)
    .filter(p => filterCountry === 'all' || p.country === filterCountry)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'quantity') return b.quantity - a.quantity;
      return 0;
    });

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
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Icon name="BarChart3" size={16} />
              Дашборд
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
            <TabsTrigger value="agreements" className="flex items-center gap-2">
              <Icon name="FileText" size={16} />
              Соглашения
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

          <TabsContent value="agreements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Handshake" size={24} className="text-secondary" />
                    Торговые соглашения
                  </CardTitle>
                  <CardDescription>Типы торговых союзов и договоренностей</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg hover-scale">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Icon name="Globe" size={16} className="text-primary" />
                        Свободная торговля
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Отсутствие торговых барьеров, пошлин и квот между странами-участниками
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg hover-scale">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Icon name="Shield" size={16} className="text-secondary" />
                        Таможенный союз
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Единый таможенный тариф для третьих стран и свободное перемещение товаров внутри союза
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg hover-scale">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Icon name="FileText" size={16} className="text-accent" />
                        Преференциальные соглашения
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Особые торговые условия для определённых товаров или категорий
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="AlertTriangle" size={24} className="text-destructive" />
                    Конфликты и санкции
                  </CardTitle>
                  <CardDescription>Торговые войны и ограничения</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5 hover-scale">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Icon name="Ban" size={16} className="text-destructive" />
                        Торговое эмбарго
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Полный запрет на торговлю определёнными товарами или со всей страной
                      </p>
                    </div>
                    <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5 hover-scale">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Icon name="TrendingDown" size={16} className="text-destructive" />
                        Экономические санкции
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Ограничения на финансовые операции, заморозка активов, запрет на инвестиции
                      </p>
                    </div>
                    <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5 hover-scale">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Icon name="Percent" size={16} className="text-destructive" />
                        Защитные пошлины
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Повышенные таможенные сборы для защиты внутреннего рынка от импорта
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Scale" size={24} />
                  Международные торговые организации
                </CardTitle>
                <CardDescription>Регуляторы и арбитры глобальной торговли</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center hover-scale">
                    <Icon name="Building" size={32} className="mx-auto mb-3 text-primary" />
                    <h4 className="font-semibold mb-2">ВТО</h4>
                    <p className="text-sm text-muted-foreground">Всемирная торговая организация</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center hover-scale">
                    <Icon name="Globe" size={32} className="mx-auto mb-3 text-secondary" />
                    <h4 className="font-semibold mb-2">МВФ</h4>
                    <p className="text-sm text-muted-foreground">Международный валютный фонд</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center hover-scale">
                    <Icon name="Landmark" size={32} className="mx-auto mb-3 text-accent" />
                    <h4 className="font-semibold mb-2">Всемирный банк</h4>
                    <p className="text-sm text-muted-foreground">Финансирование развития</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
