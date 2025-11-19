import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, ChevronRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `https://tokenized.pythonanywhere.com/api`;

const HomeNews = () => {
  const { language, t } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(4); // Faqat 4 ta yangilik chiqarish
  const navigate = useNavigate();

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

  const handleShowMore = () => {
    // Navigate qilish - o'zingiz yo'nalishni yozing
    navigate('/news'); // Masalan, /news sahifasiga o'tkazish
    // Yoki boshqa yo'nalish:
    // navigate('/all-news');
    // navigate('/news-archive');
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sizga tavsiya qilingan yangiliklar sarlavhasi */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            {language === 'uz' ? 'Bizning yangiliklarimiz' : 'Наши новости'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'uz'
              ? 'Eng so\'ngi va dolzarb yangiliklar'
              : 'Последние и актуальные новости'}
          </p>
        </div>
        {news.length > 0 && (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
              {news.slice(0, displayLimit).map((item, index) => (
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

            {/* Barcha yangiliklarni ko'rish tugmasi */}
            {news.length > displayLimit && (
              <div className="text-center mt-8">
                <button
                  onClick={handleShowMore}
                  className="px-8 py-3 bg-gradient-to-r from-gray-700 via-blue-900 to-indigo-900 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  {language === 'uz' ? 'Barcha yangiliklarni ko\'rish' : 'Посмотреть все новости'}
                </button>
              </div>
            )}

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

export default HomeNews;