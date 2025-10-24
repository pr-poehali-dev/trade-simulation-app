import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Country, IMFLoan, WBProject } from '@/types/trade';

interface OrganizationsTabProps {
  countries: Country[];
  imfLoans: IMFLoan[];
  setImfLoans: (loans: IMFLoan[]) => void;
  wbProjects: WBProject[];
  setWbProjects: (projects: WBProject[]) => void;
}

const OrganizationsTab = ({ 
  countries, 
  imfLoans, 
  setImfLoans,
  wbProjects,
  setWbProjects 
}: OrganizationsTabProps) => {
  const handleImfLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const country = formData.get('country') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const interestRate = parseFloat(formData.get('interestRate') as string);
    const term = parseInt(formData.get('term') as string);
    const purpose = formData.get('purpose') as string;

    if (!country || !amount || !interestRate || !term || !purpose) {
      toast.error('Заполните все поля');
      return;
    }

    const newLoan: IMFLoan = {
      id: Date.now().toString(),
      country,
      amount,
      interestRate,
      term,
      purpose,
      status: 'active',
      date: new Date().toISOString()
    };

    setImfLoans([...imfLoans, newLoan]);
    toast.success(`Кредит МВФ для ${country} одобрен!`);
    (e.target as HTMLFormElement).reset();
  };

  const handleWbProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const country = formData.get('country') as string;
    const name = formData.get('name') as string;
    const budget = parseFloat(formData.get('budget') as string);
    const sector = formData.get('sector') as 'infrastructure' | 'education' | 'health' | 'environment';
    const description = formData.get('description') as string;

    if (!country || !name || !budget || !sector || !description) {
      toast.error('Заполните все поля');
      return;
    }

    const newProject: WBProject = {
      id: Date.now().toString(),
      country,
      name,
      budget,
      sector,
      description,
      status: 'active',
      date: new Date().toISOString()
    };

    setWbProjects([...wbProjects, newProject]);
    toast.success(`Проект Всемирного банка "${name}" запущен!`);
    (e.target as HTMLFormElement).reset();
  };

  const totalImfLoans = imfLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalWbBudget = wbProjects.reduce((sum, proj) => sum + proj.budget, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Building2" size={32} className="text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Международные организации</h1>
          <p className="text-muted-foreground">МВФ, Всемирный банк и ВТО</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="DollarSign" size={16} />
              МВФ: Кредиты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">${totalImfLoans.toFixed(0)}B</div>
            <p className="text-xs text-muted-foreground mt-2">{imfLoans.length} активных кредитов</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Building2" size={16} />
              ВБ: Проекты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">${totalWbBudget.toFixed(0)}B</div>
            <p className="text-xs text-muted-foreground mt-2">{wbProjects.length} проектов в работе</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Globe" size={16} />
              ВТО: Страны
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{countries.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Члены организации</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="DollarSign" size={20} />
              МВФ - Международный валютный фонд
            </CardTitle>
            <CardDescription>Выдача кредитов странам</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImfLoanSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Страна-получатель</Label>
                <Select name="country" required>
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Сумма (млрд $)</Label>
                  <Input name="amount" type="number" step="0.1" min="0.1" placeholder="5.0" required />
                </div>
                <div className="space-y-2">
                  <Label>Ставка (%)</Label>
                  <Input name="interestRate" type="number" step="0.01" min="0.01" placeholder="2.5" required />
                </div>
                <div className="space-y-2">
                  <Label>Срок (лет)</Label>
                  <Input name="term" type="number" min="1" placeholder="10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Цель кредита</Label>
                <Textarea name="purpose" placeholder="Стабилизация экономики..." rows={2} required />
              </div>

              <Button type="submit" className="w-full" disabled={countries.length === 0}>
                <Icon name="DollarSign" size={16} className="mr-2" />
                Выдать кредит МВФ
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Building2" size={20} />
              Всемирный банк
            </CardTitle>
            <CardDescription>Финансирование проектов развития</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWbProjectSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Страна</Label>
                  <Select name="country" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Сектор</Label>
                  <Select name="sector" required defaultValue="infrastructure">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">Инфраструктура</SelectItem>
                      <SelectItem value="education">Образование</SelectItem>
                      <SelectItem value="health">Здравоохранение</SelectItem>
                      <SelectItem value="environment">Экология</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Название проекта</Label>
                  <Input name="name" placeholder="Модернизация дорог" required />
                </div>
                <div className="space-y-2">
                  <Label>Бюджет (млрд $)</Label>
                  <Input name="budget" type="number" step="0.1" min="0.1" placeholder="3.0" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea name="description" placeholder="Цели и задачи проекта..." rows={2} required />
              </div>

              <Button type="submit" className="w-full" disabled={countries.length === 0}>
                <Icon name="Building2" size={16} className="mr-2" />
                Запустить проект ВБ
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="List" size={20} />
              Активные кредиты МВФ ({imfLoans.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {imfLoans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="DollarSign" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Нет активных кредитов</p>
              </div>
            ) : (
              <div className="space-y-3">
                {imfLoans.map(loan => (
                  <Card key={loan.id} className="hover-scale">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Icon name="Flag" size={14} />
                          <span className="font-bold">{loan.country}</span>
                        </div>
                        <Badge variant="default">${loan.amount}B</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{loan.purpose}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Ставка: {loan.interestRate}%</span>
                        <span>Срок: {loan.term} лет</span>
                        <span>{new Date(loan.date).toLocaleDateString('ru-RU')}</span>
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
              <Icon name="List" size={20} />
              Проекты Всемирного банка ({wbProjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wbProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Building2" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Нет активных проектов</p>
              </div>
            ) : (
              <div className="space-y-3">
                {wbProjects.map(project => (
                  <Card key={project.id} className="hover-scale">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold">{project.name}</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Icon name="Flag" size={12} />
                            {project.country}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {project.sector === 'infrastructure' ? 'Инфраструктура' :
                           project.sector === 'education' ? 'Образование' :
                           project.sector === 'health' ? 'Здравоохранение' : 'Экология'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Бюджет: ${project.budget}B</span>
                        <span>{new Date(project.date).toLocaleDateString('ru-RU')}</span>
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
            ВТО - Всемирная торговая организация
          </CardTitle>
          <CardDescription>Регулирование международной торговли</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Icon name="Globe" size={32} className="mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{countries.length}</div>
              <div className="text-sm text-muted-foreground">Стран-членов</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Icon name="Package" size={32} className="mx-auto mb-2 text-secondary" />
              <div className="text-2xl font-bold">{countries.reduce((sum, c) => sum + c.exports.length, 0)}</div>
              <div className="text-sm text-muted-foreground">Экспортных позиций</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Icon name="ShoppingCart" size={32} className="mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold">{countries.reduce((sum, c) => sum + c.imports.length, 0)}</div>
              <div className="text-sm text-muted-foreground">Импортных позиций</div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground pt-4 border-t">
            <p>• ВТО регулирует торговые отношения между странами-членами</p>
            <p>• Организация следит за соблюдением торговых правил и разрешает споры</p>
            <p>• Все зарегистрированные в системе страны автоматически становятся членами ВТО</p>
            <p>• ВТО способствует снижению торговых барьеров и развитию международной торговли</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationsTab;
