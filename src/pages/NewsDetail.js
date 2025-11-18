import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `https://tokenized.pythonanywhere.com/api`;

const NewsDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, [id]);

  const loadNews = async () => {
    try {
      const response = await axios.get(`${API}/news/${id}/`);
      setNewsItem(response.data);
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

  if (!newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('Yangilik topilmadi', 'Новость не найдена')}
          </h2>
          <Link to="/news" className="text-blue-600 hover:text-blue-700">
            {t('Yangiliklar ro\'yxatiga qaytish', 'Вернуться к списку новостей')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="news-detail-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/news"
          data-testid="back-to-news-btn"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          {t('Orqaga', 'Назад')}
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center text-gray-500">
                <Calendar className="w-5 h-5 mr-2" />
                <span data-testid="news-date">{formatDate(newsItem.date)}</span>
              </div>
              <div className="flex items-center">
                <Tag className="w-5 h-5 mr-2 text-blue-600" />
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full" data-testid="news-category">
                  {language === 'uz' ? newsItem.category_uz : newsItem.category_ru}
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6" data-testid="news-title">
              {language === 'uz' ? newsItem.title_uz : newsItem.title_ru}
            </h1>
          </div>

          {/* Featured Image */}
          <div className="relative mb-8 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 blur-3xl opacity-20"></div>
            <img
              src={newsItem.image}
              alt={language === 'uz' ? newsItem.title_uz : newsItem.title_ru}
              className="relative w-full h-auto rounded-3xl shadow-2xl"
              data-testid="news-image"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line" data-testid="news-content">
              {language === 'uz' ? newsItem.content_uz : newsItem.content_ru}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-2">
              {t('Qo\'shimcha ma\'lumot kerakmi?', 'Нужна дополнительная информация?')}
            </h3>
            <p className="text-blue-100 mb-6">
              {t(
                'Batafsil ma\'lumot olish uchun biz bilan bog\'laning',
                'Свяжитесь с нами для получения детальной информации'
              )}
            </p>
            <Link
              to="/contact"
              data-testid="contact-cta-btn"
              className="inline-block px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {t('Bog\'lanish', 'Связаться')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
