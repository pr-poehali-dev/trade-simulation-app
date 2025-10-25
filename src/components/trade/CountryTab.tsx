import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Country } from '@/types/trade';

interface CountryTabProps {
  countries: Country[];
  setCountries: (countries: Country[]) => void;
}

const CountryTab = ({ countries, setCountries }: CountryTabProps) => {
  const handleCountrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const name = formData.get('name') as string;
    const currency = formData.get('currency') as string;
    const population = formData.get('population') as string;
    const gdp = formData.get('gdp') as string;
    const partners = formData.get('partners') as string;
    const description = formData.get('description') as string;

    if (!name || !currency) {
      toast.error('Заполните обязательные поля');
      return;
    }

    if (countries.find(c => c.name === name)) {
      toast.error('Страна с таким названием уже существует');
      return;
    }

    const newCountry: Country = {
      id: Date.now().toString(),
      name,
      currency,
      population: population ? parseInt(population) : undefined,
      gdp: gdp ? parseFloat(gdp) : undefined,
      partners: partners || '',
      tradeNotes: description || '',
      exports: [],
      imports: [],
      balance: 1000000,
      totalExported: 0,
      totalImported: 0
    };

    setCountries([...countries, newCountry]);
    toast.success(`Страна ${name} зарегистрирована!`);
    (e.target as HTMLFormElement).reset();
  };

  const handleDeleteCountry = (id: string) => {
    const country = countries.find(c => c.id === id);
    setCountries(countries.filter(c => c.id !== id));
    toast.success(`Страна ${country?.name} удалена`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Flag" size={32} className="text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Регистрация страны</h1>
          <p className="text-muted-foreground">Добавьте новую страну в торговую систему</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Plus" size={20} />
            Новая страна
          </CardTitle>
          <CardDescription>Заполните информацию о стране</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCountrySubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название страны *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Например: Россия"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Валюта *</Label>
                <Input
                  id="currency"
                  name="currency"
                  placeholder="Например: RUB"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="population">Население (млн)</Label>
                <Input
                  id="population"
                  name="population"
                  type="number"
                  placeholder="Например: 146"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gdp">ВВП (млрд USD)</Label>
                <Input
                  id="gdp"
                  name="gdp"
                  type="number"
                  step="0.01"
                  placeholder="Например: 1800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partners">Торговые партнёры</Label>
              <Input
                id="partners"
                name="partners"
                placeholder="Например: Китай, Индия, Турция"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Краткое описание экономики и специализации страны"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">
              <Icon name="Plus" size={16} className="mr-2" />
              Зарегистрировать страну
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Globe" size={20} />
            Зарегистрированные страны ({countries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {countries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Globe" size={48} className="mx-auto mb-4 opacity-20" />
              <p>Пока нет зарегистрированных стран</p>
              <p className="text-sm mt-2">Создайте первую страну выше</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {countries.map(country => (
                <Card key={country.id} className="hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Icon name="Flag" size={18} />
                        {country.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCountry(country.id)}
                      >
                        <Icon name="Trash2" size={16} className="text-destructive" />
                      </Button>
                    </CardTitle>
                    <CardDescription>Валюта: {country.currency}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Баланс:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ${country.balance.toLocaleString()}
                      </span>
                    </div>
                    {country.population && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Население:</span>
                        <span className="font-medium">{country.population} млн</span>
                      </div>
                    )}
                    {country.gdp && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ВВП:</span>
                        <span className="font-medium">${country.gdp} млрд</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Экспортировано:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        ${country.totalExported.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Импортировано:</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        ${country.totalImported.toLocaleString()}
                      </span>
                    </div>
                    {country.partners && (
                      <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                        Партнёры: {country.partners}
                      </div>
                    )}
                    {country.tradeNotes && (
                      <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                        {country.tradeNotes}
                      </div>
                    )}
                    <div className="flex gap-2 text-xs pt-2 border-t">
                      <div className="flex-1 text-center">
                        <div className="text-muted-foreground">Товаров</div>
                        <div className="font-bold text-secondary">{country.exports.length}</div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-muted-foreground">Импорт</div>
                        <div className="font-bold text-destructive">{country.imports.length}</div>
                      </div>
                    </div>
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

export default CountryTab;