import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronRight } from 'lucide-react';
import axios from 'axios';

const API = `https://tokenized.pythonanywhere.com/api`;

const HomeProducts = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products, language]);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products/`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setDisplayLimit(8);
  };

  const handleViewAll = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen py-12" data-testid="products-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sizga tavsiya qilinadigan mahsulotlar */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            {language === 'uz' ? 'Bizning mahsulotlarimiz' : 'Наши продукты'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {language === 'uz'
              ? 'Kompaniyamiz quvur armaturalari va boshqa mahsulotlarni ishlab chiqaruvchilardan to\'g\'ridan-to\'g\'ri yetkazib berish bilan shug\'ullanadi. Biz mijozlarimizga eng yuqori sifat va ishonchli xizmatni taqdim etamiz.'
              : 'Наша компания занимается прямыми поставками трубной арматуры и других продуктов от производителей. Мы предоставляем нашим клиентам высочайшее качество и надежный сервис.'}
          </p>
        </div>
        

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {filteredProducts
            .slice(0, displayLimit)
            .map((product, index) => (
              <div
                key={product.id}
                data-testid={`product-card-${product.id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={language === 'uz' ? product.name_uz : product.name_ru}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                      {language === 'uz' ? product.category_uz : product.category_ru}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {language === 'uz' ? product.name_uz : product.name_ru}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {language === 'uz' ? product.description_uz : product.description_ru}
                  </p>
                  {product.price && (
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      ${product.price.toLocaleString()}
                    </div>
                  )}
                  <Link
                    to={`/products/${product.id}`}
                    data-testid={`view-product-${product.id}`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group/link"
                  >
                    <span>{t('Batafsil', 'Подробнее')}</span>
                    <ChevronRight className="w-5 h-5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
        </div>

        {/* Ko'proq mahsulotlarni ko'rsatish tugmasi */}
        {filteredProducts.length > 4 && displayLimit === 4 && (
          <div className="text-center mt-12">
            <button
              onClick={handleShowMore}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              {t('Ko\'proq mahsulotlarni ko\'rish', 'Посмотреть больше продуктов')}
            </button>
          </div>
        )}

        {/* Barcha mahsulotlarni ko'rish tugmasi */}
        {displayLimit === 8 && filteredProducts.length > 8 && (
          <div className="text-center mt-12">
            <button
              onClick={handleViewAll}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              {t('Barcha mahsulotlarni ko\'rish', 'Посмотреть все продукты')}
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20" data-testid="no-products-message">
            <p className="text-2xl text-gray-500">
              {t('Mahsulotlar topilmadi', 'Продукты не найдены')}
            </p>
          </div>
        )}
        

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">
              {t('Yuklanmoqda...', 'Загрузка...')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProducts;