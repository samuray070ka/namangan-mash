import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `https://tokenized.pythonanywhere.com/api`;

const ProductDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error loading product:', error);
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('Mahsulot topilmadi', 'Продукт не найден')}
          </h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-700">
            {t('Mahsulotlar ro\'yxatiga qaytish', 'Вернуться к списку продуктов')}
          </Link>
        </div>
      </div>
    );
  }

  const specifications = language === 'uz' ? product.specifications_uz : product.specifications_ru;

  return (
    <div className="min-h-screen py-12" data-testid="product-detail-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <Link
          to="/products"
          data-testid="back-to-products-btn"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          {t('Orqaga', 'Назад')}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Image */}
          <div className="relative min-w-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl blur-3xl opacity-20"></div>
            <img
              src={product.image}
              alt={language === 'uz' ? product.name_uz : product.name_ru}
              className="relative w-full h-auto rounded-3xl shadow-2xl"
            />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg">
                {language === 'uz' ? product.category_uz : product.category_ru}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6 min-w-0">
            <div className="min-w-0">

              {/* FIXED TITLE */}
              <h1
                className="block w-full max-w-full text-4xl font-bold text-gray-900 mb-4 break-words break-all whitespace-normal"
                data-testid="product-name"
              >
                {language === 'uz' ? product.name_uz : product.name_ru}
              </h1>

              {product.price && (
                <div className="text-4xl font-bold text-blue-600 mb-6" data-testid="product-price">
                  ${product.price.toLocaleString()}
                </div>
              )}

              <p className="text-lg text-gray-600 leading-relaxed" data-testid="product-description">
                {language === 'uz' ? product.content_uz : product.content_ru}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white p-8 rounded-2xl shadow-lg" data-testid="specifications-section">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('Texnik xususiyatlari', 'Технические характеристики')}
              </h2>
              <div className="space-y-4">
                {Object.entries(specifications).map(([key, value], index) => (
                  <div
                    key={index}
                    data-testid={`spec-${index}`}
                    className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 break-words">{key}</div>
                      <div className="text-gray-600 break-words">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-2">
                {t('Qiziqtirdimi?', 'Заинтересовало?')}
              </h3>
              <p className="text-blue-100 mb-6">
                {t(
                  'Batafsil ma\'lumot olish va buyurtma berish uchun biz bilan bog\'laning',
                  'Свяжитесь с нами для получения детальной информации и оформления заказа'
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
    </div>
  );
};

export default ProductDetail;