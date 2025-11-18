import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `https://tokenized.pythonanywhere.com/api`;

const Contact = () => {
  const { language, t } = useLanguage();
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      const response = await axios.get(`${API}/company-info/`);
      setCompanyInfo(response.data);
    } catch (error) {
      console.error('Error loading company info:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contact-forms/`, formData);
      toast.success(
        language === 'uz'
          ? 'Xabar yuborildi! Tez orada siz bilan bog\'lanamiz.'
          : 'Сообщение отправлено! Мы скоро свяжемся с вами.'
      );
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        language === 'uz'
          ? 'Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.'
          : 'Произошла ошибка. Пожалуйста, попробуйте еще раз.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12" data-testid="contact-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white mb-12">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {t('Biz bilan bog\'laning', 'Свяжитесь с нами')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t(
              'Savollaringiz bormi? Biz yordam berishga tayyormiz!',
              'Есть вопросы? Мы готовы помочь!'
            )}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          {companyInfo && (
            <>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500" data-testid="contact-address">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl mb-4">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('Manzil', 'Адрес')}
                </h3>
                <p className="text-gray-600">
                  {language === 'uz' ? companyInfo.address_uz : companyInfo.address_ru}
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500" data-testid="contact-phone">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl mb-4">
                  <Phone className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('Telefon', 'Телефон')}
                </h3>
                <p className="text-gray-600">{companyInfo.phone}</p>
                <p className="text-gray-600 mt-2">Telegram: {companyInfo.telegram}</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500" data-testid="contact-email">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl mb-4">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">{companyInfo.email}</p>
              </div>
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('Xabar yuboring', 'Отправить сообщение')}
            </h2>
            <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('Ism', 'Имя')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  data-testid="contact-name-input"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-testid="contact-email-input"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('Telefon', 'Телефон')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  data-testid="contact-phone-input"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('Kompaniya', 'Компания')}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  data-testid="contact-company-input"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('Xabar', 'Сообщение')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  data-testid="contact-message-input"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                data-testid="contact-submit-btn"
                className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t('Yuborish', 'Отправить')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map */}
          <div className="bg-white p-4 rounded-3xl shadow-2xl" data-testid="contact-map">
            <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden">
              <iframe
                src={`https://www.google.com/maps?q=${companyInfo?.latitude},${companyInfo?.longitude}&z=15&output=embed`}
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Factory Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
