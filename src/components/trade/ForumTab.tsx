import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Country, ForumPost } from '@/types/trade';

interface ForumTabProps {
  countries: Country[];
  forumPosts: ForumPost[];
  setForumPosts: (posts: ForumPost[]) => void;
  forumPostForm: {
    author: string;
    country: string;
    title: string;
    content: string;
    category: 'general' | 'deals' | 'analysis' | 'news';
  };
  setForumPostForm: (form: any) => void;
}

const ForumTab = ({ 
  countries, 
  forumPosts, 
  setForumPosts, 
  forumPostForm, 
  setForumPostForm 
}: ForumTabProps) => {
  const handleForumPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumPostForm.author || !forumPostForm.title || !forumPostForm.content) {
      toast.error('Заполните все поля');
      return;
    }
    const newPost: ForumPost = {
      id: Date.now().toString(),
      ...forumPostForm,
      date: new Date().toISOString(),
      replies: 0,
      likes: 0
    };
    setForumPosts([newPost, ...forumPosts]);
    toast.success('Пост опубликован!');
    setForumPostForm({
      author: '',
      country: '',
      title: '',
      content: '',
      category: 'general'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageSquare" size={24} />
            Форум трейдеров
          </CardTitle>
          <CardDescription>Обсуждайте сделки, делитесь аналитикой и новостями</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForumPostSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ваше имя</Label>
                <Input
                  value={forumPostForm.author}
                  onChange={(e) => setForumPostForm({ ...forumPostForm, author: e.target.value })}
                  placeholder="Например: Иван Петров"
                />
              </div>
              <div className="space-y-2">
                <Label>Страна</Label>
                <Select value={forumPostForm.country} onValueChange={(value) => setForumPostForm({ ...forumPostForm, country: value })}>
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
                <Label>Категория</Label>
                <Select value={forumPostForm.category} onValueChange={(value: any) => setForumPostForm({ ...forumPostForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Общее</SelectItem>
                    <SelectItem value="deals">Сделки</SelectItem>
                    <SelectItem value="analysis">Анализ</SelectItem>
                    <SelectItem value="news">Новости</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Заголовок</Label>
              <Input
                value={forumPostForm.title}
                onChange={(e) => setForumPostForm({ ...forumPostForm, title: e.target.value })}
                placeholder="О чём вы хотите рассказать?"
              />
            </div>
            <div className="space-y-2">
              <Label>Содержание</Label>
              <Textarea
                value={forumPostForm.content}
                onChange={(e) => setForumPostForm({ ...forumPostForm, content: e.target.value })}
                placeholder="Подробности..."
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full">
              <Icon name="Send" size={16} className="mr-2" />
              Опубликовать пост
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageCircle" size={20} />
            Все посты ({forumPosts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {forumPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-20" />
              <p>Пока нет постов</p>
              <p className="text-sm mt-2">Станьте первым!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {forumPosts.map(post => (
                <Card key={post.id} className="hover-scale">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {post.author[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold">{post.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span className="font-medium">{post.author}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Icon name="Flag" size={12} />
                                {post.country}
                              </span>
                              <span>•</span>
                              <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {post.category === 'general' ? 'Общее' : 
                             post.category === 'deals' ? 'Сделки' :
                             post.category === 'analysis' ? 'Анализ' : 'Новости'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Icon name="ThumbsUp" size={14} />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Icon name="MessageCircle" size={14} />
                            {post.replies}
                          </button>
                        </div>
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

export default ForumTab;
