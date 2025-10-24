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
  filterType: string;
  setFilterType: (type: string) => void;
  filterCountry: string;
  setFilterCountry: (country: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const MarketTab = ({ 
  countries, 
  products, 
  setProducts, 
  filterType, 
  setFilterType,
  filterCountry,
  setFilterCountry,
  sortBy,
  setSortBy
}: MarketTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');

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
    toast.success(`Вы купили ${product.name} за $${product.price}!`);
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
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Общая стоимость:</span>
                    <span className="font-bold text-secondary">
                      ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {product.description && (
                  <p className="text-sm text-muted-foreground pt-2 border-t">
                    {product.description}
                  </p>
                )}

                <Button 
                  onClick={() => handleBuyProduct(product)} 
                  className="w-full"
                >
                  <Icon name="ShoppingCart" size={16} className="mr-2" />
                  Купить
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
