import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, ChevronRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `https://tokenized.pythonanywhere.com/api`;

const News = () => {
  const { language, t } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await axios.get(`${API}/news/`);
      setNews(response.data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'uz' ? 'uz-UZ' : 'ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="news-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white mb-12">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {t('Yangiliklar', 'Новости')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t(
              'Kompaniya yangiliklari, voqealar va yutuqlar',
              'Новости компании, события и достижения'
            )}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {news.length > 0 && (
          <>
            {/* Featured News */}
            <div className="mb-12" data-testid="featured-news">
              <Link
                to={`/news/${news[0].id}`}
                className="group block bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
              >
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="relative h-96 lg:h-auto overflow-hidden">
                    <img
                      src={news[0].image}
                      alt={language === 'uz' ? news[0].title_uz : news[0].title_ru}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg">
                        {language === 'uz' ? news[0].category_uz : news[0].category_ru}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center text-gray-500 mb-4">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{formatDate(news[0].date)}</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      {language === 'uz' ? news[0].title_uz : news[0].title_ru}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6 line-clamp-4">
                      {language === 'uz' ? news[0].content_uz : news[0].content_ru}
                    </p>
                    <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                      <span>{t('Batafsil o\'qish', 'Читать подробнее')}</span>
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.slice(1).map((item, index) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  data-testid={`news-card-${item.id}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={language === 'uz' ? item.title_uz : item.title_ru}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                        {language === 'uz' ? item.category_uz : item.category_ru}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {language === 'uz' ? item.title_uz : item.title_ru}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {language === 'uz' ? item.content_uz : item.content_ru}
                    </p>
                    <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                      <span>{t('Batafsil', 'Подробнее')}</span>
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {news.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">
              {t('Yangiliklar yo\'q', 'Нет новостей')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
