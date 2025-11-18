import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X } from 'lucide-react';
import { Instagram, Facebook, Youtube, Send } from 'lucide-react';
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineArrowDropDown } from "react-icons/md";
import Carousel from './carusel';

const Layout = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Til tanlash uchun ma'lumotlar
  const languages = [
    { code: 'uz', flag: 'https://flagcdn.com/w20/uz.png', name: "O'zbek" },
    { code: 'ru', flag: 'https://flagcdn.com/w20/ru.png', name: 'Русский' }
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Dropdown tashqariga bosilganda yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode) => {
    toggleLanguage();
    setDropdownOpen(false);
  };

  const navLinks = [
    { path: '/', label: t('Bosh sahifa', 'Главная') },
    { path: '/about', label: t('Biz haqimizda', 'О нас') },
    { path: '/products', label: t('Mahsulotlar', 'Продукция') },
    { path: '/news', label: t('Yangiliklar', 'Новости') },
    { path: '/contact', label: t('Aloqa', 'Контакты') }
  ];
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-500
          ${isScrolled
            ? "bg-white/60 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75 shadow-md shadow-blue-50"
            : "bg-transparent backdrop-blur-0"
          }
          max-sm:bg-white/60 max-sm:backdrop-blur-lg max-sm:backdrop-saturate-150 max-sm:backdrop-brightness-100 max-sm:shadow-md max-sm:shadow-blue-50
           sm:bg-white/60 sm:backdrop-blur-lg sm:backdrop-saturate-150 sm:backdrop-brightness-100 sm:shadow-md sm:shadow-blue-50
        `}
      >
        <nav className="container mx-auto px-4 max-sm:px-4 sm:px-6 lg:px-8 max-[1500px]:px-[4px] ">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex animate-nav_logo items-center space-x-3 group"
              data-testid="logo-link"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  NamanganMash
                </h1>
                <p className="text-xs text-gray-500">{t('Sanoat uskunalari', 'Промышленное оборудование')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex animate-nav_center items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.path}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 hover:bg-white/50 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            

            {/* Language Selector & User */}
            <div className="flex items-center space-x-3 animate-nav_logo2">
              {/* Language Selector */}
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center justify-center gap-[1px] bg-blue-600 rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 h-12
                    md:gap-1.5 md:px-2.5 md:py-1.5 md:h-10
                    max-sm:gap-1 max-sm:px-2 max-sm:py-[6px] max-sm:h-9
                    sm:gap-1 sm:px-2 sm:py-[6px] sm:h-9"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={currentLang.flag}
                    alt={language}
                    className="w-6 h-4 object-cover rounded
                      md:w-5 md:h-4
                      max-sm:w-4 max-sm:h-3"
                  />
                  <span className="text-sm font-medium text-white uppercase
                    md:text-xs
                    max-sm:text-xs">
                    {language}
                  </span>
                  <MdOutlineArrowDropDown
                    className={`w-5 h-5 text-white transition-transform duration-200
                      md:w-4 md:h-4
                      max-sm:w-3 max-sm:h-3 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {dropdownOpen && (
                  <div className="absolute top-14 right-0 bg-blue-600 rounded-lg shadow-lg py-2 w-28 z-50 animate-fade-in
                    md:top-12 md:w-[85px] md:py-1.5
                    max-sm:top-10 max-sm:w-20 sm:py-1">
                    {languages
                      .filter((lang) => lang.code !== language)
                      .map((lang) => (
                        <div
                          key={lang.code}
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-all duration-200
                            md:gap-1.5 md:px-2 md:py-1.5
                            max-sm:gap-1 max-sm:px-1.5 max-sm:py-1"
                          onClick={() => handleLanguageSelect(lang.code)}
                        >
                          <img
                            src={lang.flag}
                            alt={lang.code}
                            className="w-6 h-4 object-cover rounded
                              md:w-5 md:h-4
                              max-sm:w-4 max-sm:h-3"
                          />
                          <span className="text-sm font-medium text-white uppercase
                            md:text-xs
                            max-sm:text-xs">
                            {lang.code}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>



              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
                className="lg:hidden p-2 rounded-lg text-white bg-blue-600 transition-colors
                  md:p-2.5
                  sm:p-2"
              >
                {mobileMenuOpen ?
                  <X className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4 max-sm:w-3 max-sm:h-3" /> :
                  <Menu className="w-6 h-6 md:w-5 md:h-5 sm:w-5 sm:h-5 max-sm:w-4 max-sm:h-4" />
                }
              </button>

                            {/* User Profile */}
              <button className='relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform hover:scale-105 transition-all duration-300 rounded-full text-lg p-2 lg:p-3 group cursor-pointer animate-nav_logo2
                md:p-2.5 md:text-base
                max-sm:p-2.5 max-sm:text-[17px]'>
                <Link to={'/login'}>
                  <AiOutlineUser className="md:w-4 md:h-4 max-sm:w-3 max-sm:h-3" />

                </Link>
              </button>
            </div>
          </div>
          

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 animate-slide-down" data-testid="mobile-menu">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`mobile-nav-link-${link.path}`}
                  className={`block px-4 animate-nav_logo2 py-3 rounded-lg font-medium transition-all duration-300 mb-2
                    md:py-2.5
                    sm:py-2 sm:text-sm ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4
                md:text-lg
                sm:text-base">TechFactory</h3>
              <p className="text-gray-300 text-sm
                md:text-xs
                sm:text-xs">
                {t(
                  'Yuqori sifatli sanoat uskunalari ishlab chiqaruvchisi',
                  'Производитель высококачественного промышленного оборудования'
                )}
              </p>
              {/* Social Media */}
              <div className='mt-10
                md:mt-6
                sm:mt-4'>
                <p className="text-xl font-bold mb-4
                  md:text-lg md:mb-3
                  sm:text-base sm:mb-2">
                  {t('Bizning ijtimoiy tarmoqlar', 'Наши социальные сети')}
                </p>
                <div className="flex items-end space-x-6 mt-10
                  md:space-x-4 md:mt-6
                  sm:space-x-3 sm:mt-4">
                  {[
                    { nameUz: 'Instagram', nameRu: 'Инстаграм', icon: <Instagram className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4" />, color: 'hover:text-pink-500', bg: 'bg-pink-600' },
                    { nameUz: 'Facebook', nameRu: 'Фейсбук', icon: <Facebook className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4" />, color: 'hover:text-blue-500', bg: 'bg-blue-600' },
                    { nameUz: 'YouTube', nameRu: 'Ютуб', icon: <Youtube className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4" />, color: 'hover:text-red-500', bg: 'bg-red-600' },
                    { nameUz: 'Telegram', nameRu: 'Телеграм', icon: <Send className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4" />, color: 'hover:text-sky-400', bg: 'bg-sky-600' },
                  ].map((item) => (
                    <div key={item.nameUz} className="relative group">
                      <span
                        className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-white px-2 py-1 rounded-md opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-1 ${item.bg} transition-all duration-300 pointer-events-none
                          md:-top-7 md:text-xs md:px-1.5 md:py-0.5
                          sm:-top-6 sm:text-xs sm:px-1 sm:py-0.5`}
                      >
                        {t(item.nameUz, item.nameRu)}
                      </span>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-gray-400 transition-all duration-300 ${item.color}`}
                      >
                        {item.icon}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            

            <div>
              <h4 className="text-lg font-semibold mb-4
                md:text-base md:mb-3
                sm:text-sm sm:mb-2">
                {t('Tezkor havolalar', 'Быстрые ссылки')}
              </h4>
              <ul className="space-y-3 text-sm
                md:space-y-2 md:text-xs
                sm:space-y-1.5 sm:text-xs">
                {navLinks.map((link) => (
                  <li key={link.path} className="relative block transition-all">
                    <Link
                      to={link.path}
                      className="relative inline-block group text-gray-300 group-hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full overflow-hidden transition-all duration-500 group-hover:w-full
                        md:-bottom-1 md:h-0.5
                        sm:-bottom-0.5 sm:h-0.5">
                        <span className="absolute top-1/2 left-0 w-2 h-2 bg-white rounded-full animate-dot
                          md:w-1.5 md:h-1.5
                          sm:w-1 sm:h-1"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4
                md:text-base md:mb-3
                sm:text-sm sm:mb-2">{t('Aloqa', 'Контакты')}</h4>
              <ul className="space-y-2 text-sm text-gray-300
                md:text-xs
                sm:text-xs">
                <li>+998 71 234-56-78</li>
                <li>info@techfactory.uz</li>
                <li>@techfactory_uz</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400
            md:mt-6 md:pt-6 md:text-xs
            sm:mt-4 sm:pt-4 sm:text-xs">
            <p>&copy; 2025 TechFactory. {t('Barcha huquqlar himoyalangan', 'Все права защищены')}.</p>
          </div>
        </div>
      </footer>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes dotMove {
          0% { transform: translateX(0) translateY(-50%); }
          50% { transform: translateX(100%) translateY(-50%); }
          100% { transform: translateX(0) translateY(-50%); }
        }
        .animate-dot {
          animation: dotMove 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Layout;