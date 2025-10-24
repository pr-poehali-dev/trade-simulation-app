import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Country, Product, Sanction } from '@/types/trade';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsTabProps {
  countries: Country[];
  products: Product[];
  sanctions: Sanction[];
}

const AnalyticsTab = ({ countries, products, sanctions }: AnalyticsTabProps) => {
  const tradeBalance = countries.map(country => {
    const exportTotal = country.exports.reduce((sum, e) => sum + (e.quantity * e.price), 0);
    const importTotal = country.imports.reduce((sum, i) => sum + (i.quantity * i.price), 0);
    return {
      name: country.name,
      export: exportTotal,
      import: importTotal,
      balance: exportTotal - importTotal
    };
  });

  const productsByCategory = products.reduce((acc, product) => {
    acc[product.type] = (acc[product.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(productsByCategory).map(([type, count]) => ({
    name: type === 'raw' ? 'Сырьё' : type === 'goods' ? 'Товары' : type === 'services' ? 'Услуги' : 'Технологии',
    value: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const sanctionsByCountry = countries.map(country => {
    const incoming = sanctions.filter(s => s.toCountry === country.name).length;
    const outgoing = sanctions.filter(s => s.fromCountry === country.name).length;
    return {
      name: country.name,
      incoming,
      outgoing,
      total: incoming + outgoing
    };
  });

  const topExporters = [...countries]
    .map(c => ({
      name: c.name,
      total: c.exports.reduce((sum, e) => sum + (e.quantity * e.price), 0)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const topImporters = [...countries]
    .map(c => ({
      name: c.name,
      total: c.imports.reduce((sum, i) => sum + (i.quantity * i.price), 0)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="TrendingUp" size={32} className="text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Аналитика</h1>
          <p className="text-muted-foreground">Статистика и графики торговой системы</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всего стран</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{countries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Участников системы</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Товаров</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">На торговой площадке</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Санкций</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{sanctions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Активных ограничений</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Общий объём</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              ${products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Стоимость товаров</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={20} />
              Торговый баланс стран
            </CardTitle>
            <CardDescription>Экспорт vs Импорт</CardDescription>
          </CardHeader>
          <CardContent>
            {tradeBalance.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="BarChart3" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Нет данных для отображения</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tradeBalance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="export" fill="#00C49F" name="Экспорт" />
                  <Bar dataKey="import" fill="#FF8042" name="Импорт" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="PieChart" size={20} />
              Распределение товаров
            </CardTitle>
            <CardDescription>По категориям</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="PieChart" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Нет данных для отображения</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} className="text-secondary" />
              Топ-5 экспортёров
            </CardTitle>
            <CardDescription>По объёму экспорта</CardDescription>
          </CardHeader>
          <CardContent>
            {topExporters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Нет данных</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topExporters.map((country, index) => (
                  <div key={country.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "outline"} className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-semibold">{country.name}</div>
                        <div className="text-xs text-muted-foreground">${country.total.toFixed(0)}</div>
                      </div>
                    </div>
                    <Icon name="ArrowUpRight" size={20} className="text-secondary" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingDown" size={20} className="text-destructive" />
              Топ-5 импортёров
            </CardTitle>
            <CardDescription>По объёму импорта</CardDescription>
          </CardHeader>
          <CardContent>
            {topImporters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Нет данных</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topImporters.map((country, index) => (
                  <div key={country.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "destructive" : "outline"} className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-semibold">{country.name}</div>
                        <div className="text-xs text-muted-foreground">${country.total.toFixed(0)}</div>
                      </div>
                    </div>
                    <Icon name="ArrowDownRight" size={20} className="text-destructive" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} />
            Санкции по странам
          </CardTitle>
          <CardDescription>Входящие и исходящие ограничения</CardDescription>
        </CardHeader>
        <CardContent>
          {sanctionsByCountry.length === 0 || sanctionsByCountry.every(s => s.total === 0) ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="CheckCircle" size={48} className="mx-auto mb-4 opacity-20 text-secondary" />
              <p>Нет санкций</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sanctionsByCountry.filter(s => s.total > 0)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="incoming" fill="#FF8042" name="Входящие" stackId="a" />
                <Bar dataKey="outgoing" fill="#FFBB28" name="Исходящие" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
