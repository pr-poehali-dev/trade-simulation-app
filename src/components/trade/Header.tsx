import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

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
  setAutoRefresh
}: HeaderProps) => {
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
            <div className="text-right hidden md:block">
              <div className="text-sm text-muted-foreground">Объём торговли</div>
              <div className="text-lg font-bold text-secondary">${totalTrade.toFixed(2)}</div>
            </div>
            <Separator orientation="vertical" className="h-10 hidden md:block" />
            <div className="text-right hidden md:block">
              <div className="text-sm text-muted-foreground">Активных сделок</div>
              <div className="text-lg font-bold text-primary">{activeDeals}</div>
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
