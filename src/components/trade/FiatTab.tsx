import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { FiatCurrency } from '@/types/trade';
import { useState } from 'react';

interface FiatTabProps {
  fiatCurrencies: FiatCurrency[];
  autoRefresh: boolean;
}

const FiatTab = ({ fiatCurrencies, autoRefresh }: FiatTabProps) => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');

  const calculateConversion = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return 0;

    const from = fiatCurrencies.find(c => c.code === fromCurrency);
    const to = fiatCurrencies.find(c => c.code === toCurrency);

    if (!from || !to) return 0;

    const amountInUSD = amountNum / from.rate;
    const convertedAmount = amountInUSD * to.rate;

    return convertedAmount;
  };

  const handleConvert = () => {
    const result = calculateConversion();
    toast.success(`${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`);
  };

  const convertedAmount = calculateConversion();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon name="DollarSign" size={32} className="text-secondary" />
          <div>
            <h1 className="text-3xl font-bold">Валютный рынок</h1>
            <p className="text-muted-foreground">Курсы фиатных валют и конвертер</p>
          </div>
        </div>
        <Badge variant={autoRefresh ? "default" : "outline"} className="text-sm">
          <Icon name={autoRefresh ? "Activity" : "Pause"} size={14} className="mr-1" />
          {autoRefresh ? 'Live' : 'Пауза'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="ArrowLeftRight" size={20} />
            Конвертер валют
          </CardTitle>
          <CardDescription>Рассчитайте обменный курс между валютами</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label>Сумма</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label>Из валюты</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fiatCurrencies.map(c => (
                    <SelectItem key={c.id} value={c.code}>
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>В валюту</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fiatCurrencies.map(c => (
                    <SelectItem key={c.id} value={c.code}>
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleConvert}>
              <Icon name="ArrowLeftRight" size={16} className="mr-2" />
              Конвертировать
            </Button>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <Card className="mt-6 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Результат конвертации</div>
                  <div className="text-3xl font-bold text-primary">
                    {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    1 {fromCurrency} = {(convertedAmount / parseFloat(amount)).toFixed(4)} {toCurrency}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" size={20} />
            Курсы валют
          </CardTitle>
          <CardDescription>Обновляются каждые 8 секунд (относительно USD)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fiatCurrencies.map((currency) => (
              <Card key={currency.id} className="hover-scale">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold">{currency.code}</div>
                      <div className="text-sm text-muted-foreground">{currency.name}</div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10">
                      <Icon name="DollarSign" size={24} className="text-secondary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">Курс к USD:</span>
                      <span className="text-xl font-bold">
                        {currency.rate.toFixed(4)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Изменение 24ч:</span>
                      <Badge variant={currency.change24h >= 0 ? "default" : "destructive"}>
                        <Icon 
                          name={currency.change24h >= 0 ? "ArrowUp" : "ArrowDown"} 
                          size={12} 
                          className="mr-1" 
                        />
                        {Math.abs(currency.change24h).toFixed(2)}%
                      </Badge>
                    </div>

                    {currency.code !== 'USD' && (
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        1 USD = {currency.rate.toFixed(4)} {currency.code}
                      </div>
                    )}
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
            Информация о валютном рынке
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Все курсы указаны относительно доллара США (USD)</p>
          <p>• Котировки обновляются автоматически каждые 8 секунд при включенном автообновлении</p>
          <p>• Конвертер позволяет рассчитать обмен между любыми двумя валютами</p>
          <p>• Изменение за 24 часа показывает динамику курса в процентах</p>
          <p>• USD служит базовой валютой с курсом 1.0</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FiatTab;
