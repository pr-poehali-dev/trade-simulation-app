import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Country, Sanction } from '@/types/trade';

interface SanctionsTabProps {
  countries: Country[];
  sanctions: Sanction[];
  setSanctions: (sanctions: Sanction[]) => void;
  sanctionForm: {
    fromCountry: string;
    toCountry: string;
    type: 'embargo' | 'tariff' | 'financial';
    description: string;
    severity: 'low' | 'medium' | 'high';
  };
  setSanctionForm: (form: any) => void;
  notifications: boolean;
}

const SanctionsTab = ({ 
  countries, 
  sanctions, 
  setSanctions, 
  sanctionForm, 
  setSanctionForm,
  notifications 
}: SanctionsTabProps) => {
  const handleSanctionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sanctionForm.fromCountry || !sanctionForm.toCountry || !sanctionForm.description) {
      toast.error('Заполните все поля');
      return;
    }
    const newSanction: Sanction = {
      id: Date.now().toString(),
      ...sanctionForm,
      date: new Date().toISOString()
    };
    setSanctions([...sanctions, newSanction]);
    if (notifications) {
      toast.warning(`Санкция: ${sanctionForm.fromCountry} → ${sanctionForm.toCountry}`);
    }
    setSanctionForm({
      fromCountry: '',
      toCountry: '',
      type: 'tariff',
      description: '',
      severity: 'medium'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="AlertTriangle" size={24} className="text-destructive" />
            Система санкций
          </CardTitle>
          <CardDescription>Управление торговыми ограничениями и эмбарго</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSanctionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Страна-инициатор</Label>
                <Select value={sanctionForm.fromCountry} onValueChange={(value) => setSanctionForm({ ...sanctionForm, fromCountry: value })}>
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
                <Label>Целевая страна</Label>
                <Select value={sanctionForm.toCountry} onValueChange={(value) => setSanctionForm({ ...sanctionForm, toCountry: value })}>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Тип санкции</Label>
                <Select value={sanctionForm.type} onValueChange={(value: any) => setSanctionForm({ ...sanctionForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="embargo">Торговое эмбарго</SelectItem>
                    <SelectItem value="tariff">Защитные пошлины</SelectItem>
                    <SelectItem value="financial">Финансовые санкции</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Серьезность</Label>
                <Select value={sanctionForm.severity} onValueChange={(value: any) => setSanctionForm({ ...sanctionForm, severity: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкая</SelectItem>
                    <SelectItem value="medium">Средняя</SelectItem>
                    <SelectItem value="high">Высокая</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Описание санкции</Label>
              <Textarea
                value={sanctionForm.description}
                onChange={(e) => setSanctionForm({ ...sanctionForm, description: e.target.value })}
                placeholder="Опишите причину и условия санкции"
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full">
              <Icon name="AlertTriangle" size={16} className="mr-2" />
              Ввести санкцию
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="List" size={20} />
            Активные санкции ({sanctions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sanctions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="CheckCircle" size={48} className="mx-auto mb-4 opacity-20 text-secondary" />
              <p>Нет активных санкций</p>
              <p className="text-sm mt-2">Все страны торгуют свободно</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sanctions.map(sanction => (
                <Card key={sanction.id} className={`hover-scale ${
                  sanction.severity === 'high' ? 'border-destructive/50' :
                  sanction.severity === 'medium' ? 'border-yellow-500/50' :
                  'border-gray-300/50'
                }`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="Flag" size={16} className="text-primary" />
                          <span className="font-bold">{sanction.fromCountry}</span>
                          <Icon name="ArrowRight" size={16} />
                          <Icon name="Flag" size={16} className="text-destructive" />
                          <span className="font-bold">{sanction.toCountry}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{sanction.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(sanction.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant={
                          sanction.type === 'embargo' ? 'destructive' :
                          sanction.type === 'tariff' ? 'secondary' : 'outline'
                        }>
                          {sanction.type === 'embargo' ? 'Эмбарго' : 
                           sanction.type === 'tariff' ? 'Пошлины' : 'Финансовые'}
                        </Badge>
                        <Badge variant={
                          sanction.severity === 'high' ? 'destructive' :
                          sanction.severity === 'medium' ? 'default' : 'outline'
                        }>
                          {sanction.severity === 'high' ? 'Высокая' :
                           sanction.severity === 'medium' ? 'Средняя' : 'Низкая'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        setSanctions(sanctions.filter(s => s.id !== sanction.id));
                        toast.success('Санкция отменена');
                      }}
                    >
                      <Icon name="X" size={14} className="mr-1" />
                      Отменить санкцию
                    </Button>
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

export default SanctionsTab;
