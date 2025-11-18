import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, Filter, ChevronRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `https://tokenized.pythonanywhere.com/api`;

const Products = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, language]);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products/`);
      setProducts(response.data);

      // Extract unique categories
      const cats = [...new Set(response.data.map(p => language === 'uz' ? p.category_uz : p.category_ru))];
      setCategories(cats);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product => {
        const name =
          (language === 'uz' ? product.name_uz : product.name_ru) || '';
        const description =
          (language === 'uz' ? product.description_uz : product.description_ru) || '';
        const term = searchTerm.toLowerCase();

        return (
          name.toLowerCase().includes(term) ||
          description.toLowerCase().includes(term)
        );
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const category =
          (language === 'uz' ? product.category_uz : product.category_ru) || '';
        return category === selectedCategory;
      });
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="products-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white mb-12">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {t('Mahsulotlarimiz', 'Наша продукция')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t(
              'Yuqori sifatli sanoat uskunalari va zamonaviy texnologiyalar',
              'Высококачественное промышленное оборудование и современные технологии'
            )}
          </p>
        </div>
      </section>
      

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters - YANGILANGAN QISM */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col justify-start lg:flex-row gap-4">
            {/* Search - Yangi dizayn */}
              <div className="relative group">
              <div className="relative">
  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 z-10" />
  <input
    type="text"
    placeholder={t('Mahsulot qidirish...', 'Поиск продуктов...')}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    data-testid="product-search-input"
    className="w-[350px] pl-12 pr-4 py-3.5 bg-white/90 rounded-xl border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-[0px_0_8px_0px_rgba(30,144,255,0.3)] relative z-5"
  />
</div>
              </div>

            {/* Category Filter - Yangi dizayn */}
            <div className="lg:w-64">
              <div className="relative group d">

                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500 w-5 h-5 z-10" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    data-testid="category-filter"
                    className="w-full pl-12 pr-10 py-3.5 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-all duration-300   appearance-none cursor-pointer relative shadow-[0px_0_8px_0px_rgba(30,144,255,0.3)] z-5"
                  >
                    <option value="all">{t('Barcha kategoriyalar', 'Все категории')}</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results count - Yangi dizayn */}
          <div className="flex items-center" data-testid="products-count">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium shadow-lg">
              {t(`${filteredProducts.length} ta mahsulot topildi`, `Найдено ${filteredProducts.length} продуктов`)}
            </div>
          </div>
        </div>
        

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-20" data-testid="no-products-message">
            <p className="text-2xl text-gray-500">
              {t('Mahsulotlar topilmadi', 'Продукты не найдены')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;