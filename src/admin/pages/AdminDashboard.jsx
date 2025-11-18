import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../API';
import { Package, Newspaper, MessageSquare, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalNews: 0,
    totalContacts: 0,
    newContactsThisMonth: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);

  useEffect(() => {
    // Fetch stats
    api.get('https://tokenized.pythonanywhere.com/api/statistics/')
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
      });

    // Fetch recent products (last 2)
    api.get('https://tokenized.pythonanywhere.com/api/products/')
      .then((res) => {
        const latest = res.data.slice(-2).reverse();
        setRecentProducts(latest);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      });

    // Fetch recent news (last 2)
    api.get('https://tokenized.pythonanywhere.com/api/news/')
      .then((res) => {
        const latest = res.data.slice(-2).reverse();
        setRecentNews(latest);
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
      });

    // Fetch recent contacts (last 2)
    api.get('https://tokenized.pythonanywhere.com/api/contact-forms/')
      .then((res) => {
        const latest = res.data.slice(-2).reverse();
        setRecentContacts(latest);
      })
      .catch((err) => {
        console.error('Error fetching contacts:', err);
      });
  }, []);

  const statCards = [
    {
      title: 'Barcha Mahsulotlar',
      value: stats.totalProducts,
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Barcha Yangiliklar',
      value: stats.totalNews,
      change: '+8%',
      trend: 'up',
      icon: Newspaper,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Aloqa shakllari',
      value: stats.totalContacts,
      change: '+23%',
      trend: 'up',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Bu oy yangiliklari',
      value: stats.newContactsThisMonth,
      change: '-5%',
      trend: 'down',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Boshqaruv paneli
          </h1>
          <p className="text-gray-400">Xush kelibsiz! Bugun nima sodir bo'layotgani haqida.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
            return (
              <Card
                key={stat.title}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-gray-100">{stat.value}</h3>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendIcon
                          size={16}
                          className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}
                        />
                        <span
                          className={`text-sm font-medium ${
                            stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {stat.change}
                        </span>
                        <span className="text-gray-500 text-sm">o'tgan oyga nisbatan</span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 shadow-lg`}
                    >
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <Package size={20} className="text-blue-500" />
                So'nggi mahsulotlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <img
                      src={product.image_url || product.image}
                      alt={product.name_uz}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-100 font-medium truncate group-hover:text-blue-400 transition-colors">
                        {product.name_uz}
                      </p>
                      <p className="text-gray-500 text-sm">{product.category_uz}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">${product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent News */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <Newspaper size={20} className="text-purple-500" />
                So'ngi Yangiliklar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNews.map((news) => (
                  <div
                    key={news.id}
                    className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <p className="text-gray-100 font-medium mb-1 group-hover:text-purple-400 transition-colors">
                      {news.title_uz}
                    </p>
                    <p className="text-gray-500 text-sm">{news.category_uz}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Contacts */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <MessageSquare size={20} className="text-green-500" />
              So'nggi aloqa yuborishlari
            </CardTitle>
          </CardHeader>
         <CardContent>
          <div className="space-y-3">
            {recentContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col sm:flex-row items-start justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-200"
              >
                {/* Sana joyi — mobil ekranda tepada chiqadi */}
                <div className="sm:order-2 w-full sm:w-auto text-right mb-2 sm:mb-0">
                  <span className="text-xs sm:text-sm text-gray-500 block sm:inline">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Asosiy ma'lumotlar */}
                <div className="flex-1 sm:order-1 min-w-0 overflow-hidden">
                  {/* Name */}
{/* Name */}
<div className="lg:w-full sm:w-full max-sm:w-44">
  <p className="truncate text-gray-100 font-medium text-sm sm:text-sm">
    {contact.name}
  </p>
</div>

{/* Email */}
<div className="lg:w-full sm:w-full max-sm:w-44">
  <p className=" text-gray-400 truncate text-xs sm:text-sm font-medium">
    {contact.email}
  </p>
</div>

{/* Message */}
<div className="lg:w-full sm:w-full max-sm:w-44">
  <p className=" text-gray-400 truncate text-xs sm:text-sm font-medium">
    {contact.message}
  </p>
</div>

                </div>
              </div>
            ))}
          </div>
        </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;