import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { CryptoCurrency } from '@/types/trade';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface CryptoTabProps {
  cryptoCurrencies: CryptoCurrency[];
  autoRefresh: boolean;
}

const CryptoTab = ({ cryptoCurrencies, autoRefresh }: CryptoTabProps) => {
  const handleBuyCrypto = (crypto: CryptoCurrency) => {
    toast.success(`Куплена 1 ${crypto.symbol} за $${crypto.price.toFixed(2)}`);
  };

  const handleSellCrypto = (crypto: CryptoCurrency) => {
    toast.success(`Продана 1 ${crypto.symbol} за $${crypto.price.toFixed(2)}`);
  };

  const totalMarketCap = cryptoCurrencies.reduce((sum, c) => sum + c.marketCap, 0);
  const totalVolume = cryptoCurrencies.reduce((sum, c) => sum + c.volume24h, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon name="TrendingUp" size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Криптовалютная биржа</h1>
            <p className="text-muted-foreground">Торгуйте цифровыми активами в реальном времени</p>
          </div>
        </div>
        <Badge variant={autoRefresh ? "default" : "outline"} className="text-sm">
          <Icon name={autoRefresh ? "Activity" : "Pause"} size={14} className="mr-1" />
          {autoRefresh ? 'Live' : 'Пауза'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="DollarSign" size={16} />
              Общая капитализация
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${(totalMarketCap / 1e9).toFixed(2)}B
            </div>
            <p className="text-xs text-muted-foreground mt-1">Все криптовалюты</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="BarChart3" size={16} />
              Объём за 24ч
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              ${(totalVolume / 1e9).toFixed(2)}B
            </div>
            <p className="text-xs text-muted-foreground mt-1">Торговый оборот</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Coins" size={16} />
              Криптовалют
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {cryptoCurrencies.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Доступно для торговли</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" size={20} />
            Котировки криптовалют
          </CardTitle>
          <CardDescription>Актуальные цены обновляются каждые 5 секунд</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cryptoCurrencies.map((crypto, index) => (
              <Card key={crypto.id} className="hover-scale">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="text-lg font-bold text-primary">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div>
                        <div className="font-bold text-lg">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                      </div>

                      <div className="text-right md:text-left">
                        <div className="text-2xl font-bold">${crypto.price.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Цена</div>
                      </div>

                      <div className="text-right md:text-left">
                        <Badge variant={crypto.change24h >= 0 ? "default" : "destructive"}>
                          <Icon 
                            name={crypto.change24h >= 0 ? "ArrowUp" : "ArrowDown"} 
                            size={12} 
                            className="mr-1" 
                          />
                          {Math.abs(crypto.change24h).toFixed(2)}%
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">24ч</div>
                      </div>

                      <div className="text-right md:text-left">
                        <div className="font-medium">${(crypto.marketCap / 1e9).toFixed(2)}B</div>
                        <div className="text-xs text-muted-foreground">Капитализация</div>
                      </div>

                      <div className="md:col-span-1">
                        <ResponsiveContainer width="100%" height={40}>
                          <LineChart data={crypto.priceHistory.map((price, i) => ({ price, index: i }))}>
                            <Line 
                              type="monotone" 
                              dataKey="price" 
                              stroke={crypto.change24h >= 0 ? '#00C49F' : '#FF8042'}
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleBuyCrypto(crypto)}
                          className="flex-1"
                        >
                          <Icon name="ArrowUpRight" size={14} className="mr-1" />
                          Купить
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSellCrypto(crypto)}
                          className="flex-1"
                        >
                          <Icon name="ArrowDownLeft" size={14} className="mr-1" />
                          Продать
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Info" size={20} />
            Информация о бирже
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Котировки обновляются автоматически каждые 5 секунд при включенном автообновлении</p>
          <p>• График показывает историю изменения цены за последние 10 обновлений</p>
          <p>• Изменение за 24 часа рассчитывается в процентах относительно текущей цены</p>
          <p>• Объём торгов показывает суммарный оборот за последние 24 часа</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoTab;
