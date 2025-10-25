import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Country, Sanction, ForumPost } from '@/types/trade';

interface DashboardTabProps {
  countries: Country[];
  products: any[];
  sanctions: Sanction[];
  forumPosts: ForumPost[];
  totalTrade: number;
  activeDeals: number;
}

const DashboardTab = ({ countries, products, sanctions, forumPosts, totalTrade, activeDeals }: DashboardTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="AlertTriangle" size={20} className="text-destructive" />
              Активные санкции
            </CardTitle>
            <CardDescription>Торговые ограничения и эмбарго</CardDescription>
          </CardHeader>
          <CardContent>
            {sanctions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="CheckCircle" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Нет активных санкций</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sanctions.slice(0, 3).map(sanction => (
                  <Card key={sanction.id} className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {sanction.fromCountry} → {sanction.toCountry}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {sanction.description}
                          </div>
                        </div>
                        <Badge variant={
                          sanction.severity === 'high' ? 'destructive' :
                          sanction.severity === 'medium' ? 'secondary' : 'outline'
                        }>
                          {sanction.type === 'embargo' ? 'Эмбарго' : sanction.type === 'tariff' ? 'Пошлины' : 'Финансовые'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="MessageSquare" size={20} />
              Последние посты на форуме
            </CardTitle>
            <CardDescription>Обсуждения трейдеров</CardDescription>
          </CardHeader>
          <CardContent>
            {forumPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Нет постов на форуме</p>
              </div>
            ) : (
              <div className="space-y-2">
                {forumPosts.slice(0, 3).map(post => (
                  <Card key={post.id} className="bg-muted/30 hover-scale cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{post.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {post.author} • {post.country}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {post.category === 'general' ? 'Общее' : 
                           post.category === 'deals' ? 'Сделки' :
                           post.category === 'analysis' ? 'Анализ' : 'Новости'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
              <p className="text-sm mt-2">Перейдите в меню "Страна" для регистрации</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {countries.map(country => {
                const countryHasSanctions = sanctions.some(s => s.fromCountry === country.name || s.toCountry === country.name);
                const tradeBalance = country.totalExported - country.totalImported;
                return (
                  <Card key={country.id} className="hover-scale">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Icon name="Flag" size={18} />
                          {country.name}
                          {countryHasSanctions && (
                            <Icon name="AlertTriangle" size={14} className="text-destructive" />
                          )}
                        </span>
                        <Badge variant={tradeBalance >= 0 ? "default" : "destructive"}>
                          {tradeBalance > 0 ? '+' : ''}{tradeBalance.toLocaleString()} {country.currency}
                        </Badge>
                      </CardTitle>
                      <CardDescription>Валюта: {country.currency}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Баланс:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          ${country.balance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Экспортировано:</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          ${country.totalExported.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Импортировано:</span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">
                          ${country.totalImported.toLocaleString()}
                        </span>
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
    </div>
  );
};

export default DashboardTab;