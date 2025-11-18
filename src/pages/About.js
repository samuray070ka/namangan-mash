import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Building2, Target, Eye, Users } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `https://tokenized.pythonanywhere.com/api`;

const About = () => {
  const { language, t } = useLanguage();
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      const response = await axios.get(`${API}/company-info/`);
      setCompanyInfo(response.data);
    } catch (error) {
      console.error('Error loading company info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!companyInfo) {
    return null;
  }

  return (
    <div className="min-h-screen py-12" data-testid="about-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {t('Biz haqimizda', 'О нас')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {language === 'uz' ? companyInfo.about_uz : companyInfo.about_ru}
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6" data-testid="history-section">
              <div className="inline-flex items-center space-x-2 text-blue-600 font-semibold">
                <Building2 className="w-5 h-5" />
                <span>{t('Bizning tarixim', 'Наша история')}</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                {t('1995 yildan buyon', 'С 1995 года')}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {language === 'uz' ? companyInfo.history_uz : companyInfo.history_ru}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {companyInfo.established_year}
                  </div>
                  <div className="text-gray-600">{t('Tashkil topgan', 'Основан')}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {companyInfo.employees_count}+
                  </div>
                  <div className="text-gray-600">{t('Xodimlar', 'Сотрудников')}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"
                alt="Factory"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500" data-testid="mission-section">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {t('Missiyamiz', 'Наша миссия')}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {language === 'uz' ? companyInfo.mission_uz : companyInfo.mission_ru}
              </p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500" data-testid="vision-section">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl mb-6">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {t('Vizyonimiz', 'Наше видение')}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {language === 'uz' ? companyInfo.vision_uz : companyInfo.vision_ru}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600 font-semibold mb-4">
            <Users className="w-5 h-5" />
            <span>{t('Jamoa', 'Команда')}</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('Bizning jamoamiz', 'Наша команда')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            {t(
              'Malakali mutaxassislar va tajribali muhandislardan iborat kuchli jamoa',
              'Сильная команда квалифицированных специалистов и опытных инженеров'
            )}
          </p>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-3xl opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200"
              alt="Team"
              className="relative rounded-3xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;