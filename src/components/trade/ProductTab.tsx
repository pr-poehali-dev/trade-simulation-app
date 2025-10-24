import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Country, Product } from '@/types/trade';

interface ProductTabProps {
  countries: Country[];
  products: Product[];
  setProducts: (products: Product[]) => void;
}

const ProductTab = ({ countries, products, setProducts }: ProductTabProps) => {
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const name = formData.get('name') as string;
    const country = formData.get('country') as string;
    const type = formData.get('type') as 'raw' | 'goods' | 'services' | 'tech';
    const price = parseFloat(formData.get('price') as string);
    const quantity = parseInt(formData.get('quantity') as string);
    const description = formData.get('description') as string;

    if (!name || !country || !price || !quantity) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      country,
      type,
      price,
      quantity,
      description: description || undefined
    };

    setProducts([...products, newProduct]);
    toast.success(`Товар "${name}" добавлен!`);
    (e.target as HTMLFormElement).reset();
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(products.filter(p => p.id !== id));
    toast.success(`Товар "${product?.name}" удалён`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Package" size={32} className="text-secondary" />
        <div>
          <h1 className="text-3xl font-bold">Добавить товар</h1>
          <p className="text-muted-foreground">Разместите товар на торговой площадке</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Plus" size={20} />
            Новый товар
          </CardTitle>
          <CardDescription>Заполните информацию о товаре для продажи</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название товара *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Например: Нефть"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Страна-продавец *</Label>
                <Select name="country" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите страну" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.length === 0 ? (
                      <SelectItem value="none" disabled>Сначала создайте страну</SelectItem>
                    ) : (
                      countries.map(c => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Категория *</Label>
                <Select name="type" required defaultValue="goods">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw">Сырьё</SelectItem>
                    <SelectItem value="goods">Товары</SelectItem>
                    <SelectItem value="services">Услуги</SelectItem>
                    <SelectItem value="tech">Технологии</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Цена (USD) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Количество *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="1000"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Дополнительная информация о товаре"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={countries.length === 0}>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить товар
            </Button>
            {countries.length === 0 && (
              <p className="text-xs text-center text-muted-foreground">
                Сначала создайте хотя бы одну страну
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Package" size={20} />
            Ваши товары ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Package" size={48} className="mx-auto mb-4 opacity-20" />
              <p>Пока нет товаров</p>
              <p className="text-sm mt-2">Добавьте первый товар выше</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <Card key={product.id} className="hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2">
                        <Icon name="Package" size={16} />
                        {product.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Icon name="Trash2" size={14} className="text-destructive" />
                      </Button>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Icon name="Flag" size={12} />
                      {product.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={
                        product.type === 'raw' ? 'default' :
                        product.type === 'goods' ? 'secondary' :
                        product.type === 'services' ? 'outline' : 'default'
                      }>
                        {product.type === 'raw' ? 'Сырьё' :
                         product.type === 'goods' ? 'Товары' :
                         product.type === 'services' ? 'Услуги' : 'Технологии'}
                      </Badge>
                      <span className="text-lg font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Количество:</span>
                        <span className="font-medium">{product.quantity}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-muted-foreground">Общая стоимость:</span>
                        <span className="font-bold text-secondary">
                          ${(product.price * product.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {product.description && (
                      <p className="text-xs text-muted-foreground pt-2 border-t">
                        {product.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTab;
