import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface SidebarProps {
  sidebarOpen: boolean;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', icon: 'BarChart3', label: 'Дашборд' },
  { id: 'analytics', icon: 'LineChart', label: 'Аналитика' },
  { id: 'country', icon: 'Flag', label: 'Страна' },
  { id: 'product', icon: 'Package', label: 'Товар' },
  { id: 'market', icon: 'ShoppingCart', label: 'Рынок' },
  { id: 'crypto', icon: 'Bitcoin', label: 'Криптобиржа' },
  { id: 'fiat', icon: 'DollarSign', label: 'Валюты' },
  { id: 'sanctions', icon: 'AlertTriangle', label: 'Санкции' },
  { id: 'forum', icon: 'MessageSquare', label: 'Форум' },
  { id: 'organizations', icon: 'Building2', label: 'Организации' },
];

const Sidebar = ({ sidebarOpen, currentTab, setCurrentTab, setSidebarOpen }: SidebarProps) => {
  return (
    <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-white dark:bg-gray-950 border-r dark:border-gray-800 min-h-[calc(100vh-73px)] fixed lg:sticky top-[73px] z-40`}>
      <ScrollArea className="h-[calc(100vh-73px)]">
        <nav className="p-4 space-y-2">
          {menuItems.map(item => (
            <Button
              key={item.id}
              variant={currentTab === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <Icon name={item.icon as any} size={18} className="mr-2" />
              {item.label}
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
