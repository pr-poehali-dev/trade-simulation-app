import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Country, Product } from '@/types/trade';

interface MarketTabProps {
  countries: Country[];
  products: Product[];
  setProducts: (products: Product[]) => void;
  setCountries: (countries: Country[]) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterCountry: string;
  setFilterCountry: (country: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  currentCountry: string;
}

const MarketTab = ({ 
  countries, 
  products, 
  setProducts,
  setCountries,
  filterType, 
  setFilterType,
  filterCountry,
  setFilterCountry,
  sortBy,
  setSortBy,
  currentCountry
}: MarketTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [buyQuantity, setBuyQuantity] = useState<{[key: string]: number}>({});

  const filteredProducts = products
    .filter(p => {
      if (filterType !== 'all' && p.type !== filterType) return false;
      if (filterCountry !== 'all' && p.country !== filterCountry) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'quantity') return a.quantity - b.quantity;
      if (sortBy === 'quantity-desc') return b.quantity - a.quantity;
      return 0;
    });

  const handleBuyProduct = (product: Product) => {
    const quantity = buyQuantity[product.id] || 1;
    
    if (!currentCountry) {
      toast.error('Выберите страну покупателя!');
      return;
    }
    
    if (product.country === currentCountry) {
      toast.error('Нельзя купить свой собственный товар!');
      return;
    }
    
    if (quantity > product.quantity) {
      toast.error('Недостаточно товара на складе!');
      return;
    }
    
    const buyer = countries.find(c => c.name === currentCountry);
    const seller = countries.find(c => c.name === product.country);
    
    if (!buyer || !seller) {
      toast.error('Страна не найдена!');
      return;
    }
    
    const totalCost = product.price * quantity;
    
    if (buyer.balance < totalCost) {
      toast.error(`Недостаточно средств! Нужно $${totalCost.toFixed(2)}, а баланс: $${buyer.balance.toFixed(2)}`);
      return;
    }
    
    const updatedCountries = countries.map(c => {
      if (c.name === currentCountry) {
        return {
          ...c,
          balance: c.balance - totalCost,
          totalImported: c.totalImported + totalCost
        };
      }
      if (c.name === product.country) {
        return {
          ...c,
          balance: c.balance + totalCost,
          totalExported: c.totalExported + totalCost
        };
      }
      return c;
    });
    
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        const newQuantity = p.quantity - quantity;
        if (newQuantity <= 0) {
          return null;
        }
        return { ...p, quantity: newQuantity };
      }
      return p;
    }).filter(Boolean) as Product[];
    
    setCountries(updatedCountries);
    setProducts(updatedProducts);
    setBuyQuantity({ ...buyQuantity, [product.id]: 1 });
    
    toast.success(`Сделка завершена! Куплено ${quantity} шт. ${product.name} за $${totalCost.toFixed(2)}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="ShoppingCart" size={32} className="text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Торговая площадка</h1>
          <p className="text-muted-foreground">Покупайте товары со всего мира</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Filter" size={20} />
            Фильтры и поиск
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Поиск</Label>
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Название товара"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Категория</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="raw">Сырьё</SelectItem>
                  <SelectItem value="goods">Товары</SelectItem>
                  <SelectItem value="services">Услуги</SelectItem>
                  <SelectItem value="tech">Технологии</SelectItem>
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
                  <SelectItem value="price">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                  <SelectItem value="quantity">Количество: по возрастанию</SelectItem>
                  <SelectItem value="quantity-desc">Количество: по убыванию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Найдено товаров: {filteredProducts.length}
        </h2>
        {(filterType !== 'all' || filterCountry !== 'all' || searchQuery) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterType('all');
              setFilterCountry('all');
              setSearchQuery('');
            }}
          >
            <Icon name="X" size={14} className="mr-1" />
            Сбросить фильтры
          </Button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-20" />
            <p>Товары не найдены</p>
            <p className="text-sm mt-2">Попробуйте изменить фильтры</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <Icon name="Package" size={18} />
                    {product.name}
                  </span>
                  <Badge variant={
                    product.type === 'raw' ? 'default' :
                    product.type === 'goods' ? 'secondary' :
                    product.type === 'services' ? 'outline' : 'default'
                  }>
                    {product.type === 'raw' ? 'Сырьё' :
                     product.type === 'goods' ? 'Товары' :
                     product.type === 'services' ? 'Услуги' : 'Технологии'}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Icon name="Flag" size={12} />
                  {product.country}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Цена за единицу:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">В наличии:</span>
                    <span className="font-medium">{product.quantity} шт.</span>
                  </div>
                </div>

                {product.description && (
                  <p className="text-sm text-muted-foreground pt-2 border-t">
                    {product.description}
                  </p>
                )}

                <div className="space-y-2">
                  <Label>Количество для покупки</Label>
                  <Input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={buyQuantity[product.id] || 1}
                    onChange={(e) => setBuyQuantity({ ...buyQuantity, [product.id]: Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)) })}
                  />
                  <div className="flex justify-between text-sm font-medium">
                    <span>К оплате:</span>
                    <span className="text-lg text-primary">
                      ${(product.price * (buyQuantity[product.id] || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleBuyProduct(product)} 
                  className="w-full"
                  disabled={product.country === currentCountry}
                >
                  <Icon name="ShoppingCart" size={16} className="mr-2" />
                  {product.country === currentCountry ? 'Ваш товар' : 'Купить'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketTab;