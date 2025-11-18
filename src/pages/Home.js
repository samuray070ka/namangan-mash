import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Award, Users, Globe, TrendingUp } from 'lucide-react';
import axios from 'axios';
import * as THREE from 'three';
import AOS from "aos";
import "aos/dist/aos.css";
import video from "../components/assets/kkkk.mp4"
import Product from "../pages/homeProduct"
import News from "../pages/homeNews"

// Backend URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// =======================
// CounterCard - scroll bilan animatsiya qiluvchi counter
// =======================
const CounterCard = ({ label, value }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 30);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 30);

    return () => clearInterval(counter);
  }, [hasAnimated, value]);


  // product





  // product

  return (
    <div
      ref={ref}
      className="text-center transform hover:scale-105 shadow-lg p-12 rounded-[25px] transition-transform"
    >
      <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
        {count}+
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

// =======================
// Home Component
// =======================
const Home = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ products: 0, news: 0 });
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Three.js + load stats
  useEffect(() => {
    setIsVisible(true);
    loadStats();

    if (!canvasRef.current) return;

    // Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Geometrik shakl
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x1a5490,
      shininess: 100,
      wireframe: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Partikllar
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x2c7bc4
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Yoritish
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 5;
    

    // Animatsiya
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.001;
      mesh.rotation.y += 0.002;
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  const loadStats = async () => {
    try {
      const [productsRes, newsRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/news`)
      ]);
      setStats({
        products: productsRes.data.length,
        news: newsRes.data.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: t('Yuqori sifat', 'Высокое качество'),
      description: t('ISO sertifikatlangan mahsulotlar va xalqaro standartlar', 'Сертифицированные ISO продукты и международные стандарты')
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('Tajribali jamoa', 'Опытная команда'),
      description: t('500+ malakali mutaxassislar va muhandislar', 'Более 500 квалифицированных специалистов и инженеров')
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('Xalqaro hamkorlik', 'Международное сотрудничество'),
      description: t('30+ mamlakatda ishonchli hamkorlar', 'Надежные партнеры в 30+ странах')
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('Innovatsiya', 'Инновации'),
      description: t('Eng zamonaviy texnologiyalar va doimiy rivojlanish', 'Новейшие технологии и постоянное развитие')
    }
  ];

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const sectionRef2 = useRef(null);
  const [visible2, setVisible2] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setVisible2(entry.isIntersecting); // har safar ishlaydi
      },
      { threshold: 0.4 }
    );

    if (sectionRef2.current) {
      observer.observe(sectionRef2.current);
    }

    return () => {
      if (sectionRef2.current) observer.unobserve(sectionRef2.current);
    };
  }, []);
  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
  <section className="bg-[#222] relative min-h-[90vh] flex items-center justify-left overflow-hidden" >

      <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src={video} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  

        {/* <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" /> */}
        <div className=" animate-hero_animated max-sm:px-4 p-7 z-10 text-left rounded-[25px] sm:pl-[-60px]">
          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-transform duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {t('Sanoat kelajagini', "Будущее промышленности")}
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {t('Biz yaratamiz', "Мы создаем")}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 ml-0 mb-8 max-w-3xl mx-auto">
            {t('Zamonaviy texnologiyalar va innovatsion yechimlar bilan sanoat uskunalari ishlab chiqarishda yetakchi kompaniya', "Ведущая компания по производству промышленного оборудования с использованием современных технологий и инновационными решениями.")}
          </p>
          <div className="flex sm:mr-[100px] items-center justify-left gap-4">
            <Link to="/products" className="group px-8 py-4 bg-white text-blue-600 rounded-full font-semibold shadow-2xl hover:shadow-blue-300/50 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
              <span>{t('Mahsulotlar', "Продукты")}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="px-[50px]   py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
              {t('Bog\'lanish', "Связь")}
            </Link>
          </div>
        </div>
      </section>

     {/* product  */}
    <Product />


      {/* Features Section */}
      <section className="py-20 bg-[#4545DA] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {t('Nima uchun bizni tanlashadi?', 'Почему выбирают нас?')}
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              {t('Bizning afzalliklarimiz va muvaffaqiyat kalitlari', 'Наши преимущества и ключи к успеху')}
            </p>
          </div>

          {/* Animation uchun ref */}
          <div ref={sectionRef2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`fade-zoom-up ${visible2 ? "show" : ""} group relative p-8 bg-gradient-to-br from-blue-800/20 to-indigo-900/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl overflow-hidden
                     hover:from-blue-600/30 hover:to-indigo-700/30 hover:border-blue-300/50
                     transform hover:-translate-y-2 hover:rotate-1 hover:scale-105
                     transition-all duration-500 ease-out
                     shadow-[0_10px_30px_rgba(59,130,246,0.2)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.4)]`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative mb-6 z-10">
                  <div className="bg-gradient-to-r text-white from-blue-500 to-indigo-600 rounded-2xl p-4 inline-block shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 relative z-10 drop-shadow-md">{feature.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed relative z-10">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      {/* CTA Section */}
      <section className="py-20 bg-[#4545DA]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t('Hamkorlikni boshlaylik', 'Начнем сотрудничество')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t(
              'Sanoat uskunalari bo\'yicha maslahat va takliflar olish uchun biz bilan bog\'laning',
              'Свяжитесь с нами для консультации и предложений по промышленному оборудованию'
            )}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold shadow-2xl hover:shadow-white/30 transform hover:scale-105 transition-all duration-300 space-x-2"
          >
            <span>{t('Aloqaga chiqish', 'Связаться')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      <News />
    </div>
  );
};

export default Home;