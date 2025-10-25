import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Country } from '@/types/trade';

interface HeaderProps {
  totalTrade: number;
  activeDeals: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  countries: Country[];
  currentCountry: string;
  setCurrentCountry: (country: string) => void;
}

const Header = ({
  totalTrade,
  activeDeals,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  notifications,
  setNotifications,
  autoRefresh,
  setAutoRefresh,
  countries,
  currentCountry,
  setCurrentCountry
}: HeaderProps) => {
  const selectedCountry = countries.find(c => c.name === currentCountry);
  return (
    <header className="bg-white dark:bg-gray-950 shadow-sm border-b dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Icon name="Menu" size={24} />
            </Button>
            <Icon name="Globe" size={32} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">GLOBAL TRADE SYSTEM</h1>
              <p className="text-sm text-muted-foreground">International Commerce Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="min-w-[200px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Ваша страна</Label>
              <Select value={currentCountry} onValueChange={setCurrentCountry}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Выберите страну" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(c => (
                    <SelectItem key={c.id} value={c.name}>
                      <div className="flex items-center gap-2">
                        <Icon name="Flag" size={14} />
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCountry && (
              <>
                <Separator orientation="vertical" className="h-10 hidden lg:block" />
                <div className="text-right hidden lg:block">
                  <div className="text-xs text-muted-foreground">Баланс</div>
                  <div className="text-sm font-bold text-green-600 dark:text-green-400">
                    ${selectedCountry.balance.toLocaleString()}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-10 hidden xl:block" />
                <div className="text-right hidden xl:block">
                  <div className="text-xs text-muted-foreground">Экспорт</div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    ${selectedCountry.totalExported.toLocaleString()}
                  </div>
                </div>
                <div className="text-right hidden xl:block">
                  <div className="text-xs text-muted-foreground">Импорт</div>
                  <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    ${selectedCountry.totalImported.toLocaleString()}
                  </div>
                </div>
              </>
            )}
            <Separator orientation="vertical" className="h-10 hidden md:block" />
            <div className="text-right hidden md:block">
              <div className="text-xs text-muted-foreground">Объём торговли</div>
              <div className="text-sm font-bold text-secondary">${totalTrade.toFixed(2)}</div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Icon name="Settings" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Icon name="Settings" size={20} />
                    Настройки
                  </SheetTitle>
                  <SheetDescription>
                    Персонализируйте работу платформы
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Icon name="Palette" size={18} />
                      Внешний вид
                    </h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode">Темная тема</Label>
                      <Switch
                        id="dark-mode"
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Icon name="Bell" size={18} />
                      Уведомления
                    </h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Показывать уведомления</Label>
                      <Switch
                        id="notifications"
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Icon name="RefreshCw" size={18} />
                      Обновление данных
                    </h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-refresh">Автообновление цен</Label>
                      <Switch
                        id="auto-refresh"
                        checked={autoRefresh}
                        onCheckedChange={setAutoRefresh}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Icon name="Trash2" size={18} />
                      Данные
                    </h3>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        if (confirm('Удалить все данные?')) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Очистить все данные
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;