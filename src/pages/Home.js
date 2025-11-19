import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Award, Users, Globe, TrendingUp } from 'lucide-react';
import axios from 'axios';
import * as THREE from 'three';
// YANGI IMPORT: OrbitControls (three.js examples dan)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
const CounterCard = ({ label, value, className = "" }) => {
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

  return (
    <div
      ref={ref}
      className={`text-center transform hover:scale-105 shadow-lg p-12 rounded-[25px] transition-transform ${className}`}
    >
      <div className={`text-5xl font-bold mb-2 ${className.includes('text-white') ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'}`}>
        {count}+
      </div>
      <div className={className.includes('text-white') ? 'text-white' : 'text-gray-600'}>{label}</div>
    </div>
  );
};

// =======================
// Home Component
// =======================
const Home = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ products: 0, news: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const factoryCanvasRef = useRef(null);
  const canvasRef = useRef(null);

  // AOS + Stats yuklash
  useEffect(() => {
    AOS.init({ duration: 1200, once: false, mirror: true });
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

  // Backenddan statistika
  const loadStats = async () => {
    try {
      const [productsRes, newsRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/news`)
      ]);
      setStats({ products: productsRes.data.length, news: newsRes.data.length });
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  // YANGI: 3D Zavod modeli (interaktiv, OrbitControls, tutun, yoritilgan derazalar, aylanuvchi tishli g'ildiraklar)
  useEffect(() => {
    const canvas = factoryCanvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    scene.fog = new THREE.FogExp2(0x0a0a1a, 0.015);

    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
    camera.position.set(35, 25, 35);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 6, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 0.1; // Yaqinlashtirish uchun kichik qiymat, ichiga kirishga imkon beradi
    controls.maxDistance = 100; // Uzoqlashtirish cheklovi, uzoqqa ketmaydi
    controls.maxPolarAngle = Math.PI / 2.1;

    // Yorug'lik
    const hemi = new THREE.HemisphereLight(0xaaaaFF, 0x444466, 0.9);
    scene.add(hemi);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(30, 50, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    scene.add(dirLight);

    // Ichki yoritish (zavod ichida)
    const interiorLight = new THREE.PointLight(0xffffff, 1.2, 50);
    interiorLight.position.set(0, 5, 0);
    scene.add(interiorLight);

    // Yer
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Bino materiallari
    const buildingMat = (c) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.15, roughness: 0.85, transparent: true, opacity: 0.8 }); // Yarmi shaffof qilib, ichini ko'rish uchun
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xffeeaa, emissive: 0xffaa33, emissiveIntensity: 1.2 });

    // Binolar
    const buildings = [];
    const addBuilding = (pos, size, color) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), buildingMat(color));
      mesh.position.set(...pos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      buildings.push({ mesh, size });
      return mesh;
    };
    const main = addBuilding([0, 6, 0], [22, 12, 32], 0x1a5490);
    const left = addBuilding([-18, 4, 6], [14, 8, 18], 0x2c7bc4);
    const right = addBuilding([20, 5, -10], [16, 10, 20], 0x4545DA);

    // Derazalar (faqat old tomondan, yorug‘lik effekti)
    const winGeo = new THREE.BoxGeometry(1.8, 1.8, 0.3);
    buildings.forEach(b => {
      const { w, h, d } = { w: b.size[0], h: b.size[1], d: b.size[2] };
      const cols = Math.floor(w / 3.5);
      const rows = Math.floor(h / 3.5);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const win = new THREE.Mesh(winGeo, windowMat);
          win.position.set(
            b.mesh.position.x - w / 2 + 3 + c * 3.5,
            b.mesh.position.y - h / 2 + 2.5 + r * 3,
            b.mesh.position.z + d / 2 + 0.2
          );
          scene.add(win);
        }
      }
    });

    // Mo'ri (chimney)
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const chimneys = [];
    const addChimney = (parentPos, offset, h = 14, r = 1.3) => {
      const geo = new THREE.CylinderGeometry(r, r, h, 32);
      const mesh = new THREE.Mesh(geo, chimneyMat);
      mesh.position.set(parentPos.x + offset[0], parentPos.y + offset[1] + h / 2, parentPos.z + offset[2]);
      mesh.castShadow = true;
      scene.add(mesh);
      chimneys.push({ mesh, topY: mesh.position.y + h / 2, baseX: mesh.position.x, baseZ: mesh.position.z, radius: r });
    };
    addChimney(main.position, [-6, 6, -10]);
    addChimney(main.position, [7, 6, -10]);
    addChimney(left.position, [0, 4, 0], 9, 0.9);

    // Tutun (smoke particles)
    const smoke = [];
    chimneys.forEach(ch => {
      const count = 250;
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * ch.radius;
        positions[i * 3] = ch.baseX + rad * Math.cos(angle);
        positions[i * 3 + 1] = ch.topY + Math.random() * 3;
        positions[i * 3 + 2] = ch.baseZ + rad * Math.sin(angle);
        velocities[i] = 0.015 + Math.random() * 0.02;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xcccccc,
        size: 1.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      smoke.push({ points, positions, velocities, baseY: ch.topY - 3, ...ch });
    });

    // Aylanuvchi tishli g'ildiraklar (gears) - olib tashlandi, kerak emas deb faraz qilib

    // Zavod ichidagi uskunalarni qo'shish (batafsil, hayotdagiga o'xshatib)
    const equipmentGroup = new THREE.Group();

    // 1. Tel yoki mix yasash uskunalari: sim halqalari (torus), motorli dastgoh (box va cylinder)
    const wireMachineMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6 });
    const dastgohGeo = new THREE.BoxGeometry(3, 4, 3);
    const dastgoh = new THREE.Mesh(dastgohGeo, wireMachineMat);
    dastgoh.position.set(-8, 2, -10);
    equipmentGroup.add(dastgoh);

    const halqaGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 100);
    const halqaMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9 });
    for (let i = 0; i < 3; i++) {
      const halqa = new THREE.Mesh(halqaGeo, halqaMat);
      halqa.position.set(-8 + i * 1, 4, -10);
      halqa.rotation.x = Math.PI / 2;
      equipmentGroup.add(halqa);
    }

    // 2. Issiq po'lat prokat zavodi: qizil issiq plitalar (box, emissive), gaz torchlari (cone)
    const prokatPlateGeo = new THREE.BoxGeometry(4, 0.5, 6);
    const prokatPlateMat = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0xff4500, emissiveIntensity: 0.8 });
    const prokatPlate = new THREE.Mesh(prokatPlateGeo, prokatPlateMat);
    prokatPlate.position.set(0, 1, 0);
    equipmentGroup.add(prokatPlate);

    const torchGeo = new THREE.ConeGeometry(0.5, 2, 32);
    const torchMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 1.2 });
    for (let i = 0; i < 2; i++) {
      const torch = new THREE.Mesh(torchGeo, torchMat);
      torch.position.set(-1 + i * 2, 3, 0);
      torch.rotation.x = Math.PI;
      equipmentGroup.add(torch);
    }

    // 3. Po'lat quvurlar saqlash joyi: uzun po'lat quvurlar (cylinderlar, stack qilingan)
    const quvurGeo = new THREE.CylinderGeometry(0.4, 0.4, 10, 32);
    const quvurMat = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.7 });
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        const quvur = new THREE.Mesh(quvurGeo, quvurMat);
        quvur.position.set(8 + i * 0.9, 0.4 + j * 0.9, -5);
        quvur.rotation.z = Math.PI / 2;
        equipmentGroup.add(quvur);
      }
    }

    // 4. Issiq po'lat kesish uskunalari: issiq relslar (box), olovli kesish (cone va particles)
    const relsGeo = new THREE.BoxGeometry(12, 0.3, 0.5);
    const relsMat = new THREE.MeshStandardMaterial({ color: 0xff8c00, emissive: 0xff8c00, emissiveIntensity: 0.6 });
    const rels = new THREE.Mesh(relsGeo, relsMat);
    rels.position.set(0, 0.5, 10);
    equipmentGroup.add(rels);

    const kesishTorchGeo = new THREE.ConeGeometry(0.3, 1.5, 32);
    const kesishTorch = new THREE.Mesh(kesishTorchGeo, torchMat);
    kesishTorch.position.set(0, 2, 10);
    kesishTorch.rotation.x = Math.PI;
    equipmentGroup.add(kesishTorch);

    // Olov particles
    const olovParticlesGeo = new THREE.BufferGeometry();
    const olovCount = 100;
    const olovPositions = new Float32Array(olovCount * 3);
    for (let i = 0; i < olovCount * 3; i++) {
      olovPositions[i] = (Math.random() - 0.5) * 0.5;
    }
    olovParticlesGeo.setAttribute('position', new THREE.BufferAttribute(olovPositions, 3));
    const olovMat = new THREE.PointsMaterial({ color: 0xff4500, size: 0.1, blending: THREE.AdditiveBlending });
    const olovParticles = new THREE.Points(olovParticlesGeo, olovMat);
    olovParticles.position.set(0, 1, 10);
    equipmentGroup.add(olovParticles);

    // 5. Po'lat profil va nur saqlash: po'lat nur va kanallar (uzun boxlar, stack)
    const profilGeo = new THREE.BoxGeometry(8, 0.4, 0.4);
    const profilMat = new THREE.MeshStandardMaterial({ color: 0x696969, metalness: 0.8 });
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const profil = new THREE.Mesh(profilGeo, profilMat);
        profil.position.set(-10, 0.4 + j * 0.5, 5 + i * 0.5);
        equipmentGroup.add(profil);
      }
    }

    // Animatsiya uchun uskunalarni aylantirish (masalan, konveyerni harakatlantirish)
    equipmentGroup.position.set(0, 0, 0); // Asosiy bino ichida
    scene.add(equipmentGroup);

    // Animatsiya
    const clock = new THREE.Clock();
    let frame;
    const animate = () => {
      const delta = clock.getDelta();
      controls.update();

      // Uskunalarni animatsiya qilish
      // 1. Tel yasash: halqalarni aylantirish
      buildings[0].children?.forEach((child, idx) => {
        if (idx > 0) child.rotation.y += delta * 0.5;
      });

      // 2. Prokat: plitani siljitish
      prokatPlate.position.x += delta * 0.3;
      if (prokatPlate.position.x > 5) prokatPlate.position.x = -5;

      // 3. Quvurlar: eng yuqoridagini aylantirish
      equipmentGroup.children[10].rotation.y += delta * 0.2; // Misol uchun

      // 4. Kesish: olov pulsatsiyasi
      olovParticles.scale.set(1 + Math.sin(clock.elapsedTime * 5) * 0.2, 1 + Math.sin(clock.elapsedTime * 5) * 0.2, 1);

      // 5. Profil: stackni biroz tebratish
      equipmentGroup.children[15].position.y += Math.sin(clock.elapsedTime) * 0.01;

      // Tutun harakati
      smoke.forEach(s => {
        const pos = s.positions;
        for (let i = 0; i < pos.length / 3; i++) {
          pos[i * 3 + 1] += s.velocities[i] * delta * 25;
          if (pos[i * 3 + 1] > s.baseY + 35) {
            pos[i * 3 + 1] = s.baseY - Math.random() * 4;
            const angle = Math.random() * Math.PI * 2;
            const rad = Math.random() * s.radius;
            pos[i * 3] = s.baseX + rad * Math.cos(angle);
            pos[i * 3 + 2] = s.baseZ + rad * Math.sin(angle);
          }
        }
        s.points.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const resize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frame);
      renderer.dispose();
      scene.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
          else o.material.dispose();
        }
      });
    };
  }, []);

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
            <Link to="/products" className="group px-8 py-4 max-sm:px-4 max-sm:py-3 max-sm:text-[15px] bg-white text-blue-600 rounded-full font-semibold shadow-2xl hover:shadow-blue-300/50 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
              <span>{t('Mahsulotlar', "Продукты")}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 max-sm:w-4 max-sm:h-4 transition-transform" />
            </Link>
            <Link to="/contact" className="px-[50px] max-sm:px-7 max-sm:py-3 max-sm:text-[15px] py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
              {t('Bog\'lanish', "Связь")}
            </Link>
          </div>
        </div>
      </section>

      {/* New Achievements Section */}
      <section className="py-20 bg-[#4545DA] relative overflow-hidden">
        <canvas className="absolute inset-0 w-full h-full opacity-20" ref={useRef(null)} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {t('Bizning yutuqlarimiz', 'Наши достижения')}
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              {t('NamanganMash zavodining sanoatdagi muvaffaqiyat ko\'rsatkichlari', 'Показатели успеха завода NamanganMash в промышленности')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className='
                bg-gradient-to-br from-blue-800/20
               to-indigo-900/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl overflow-hidden
               hover:from-blue-600/30 hover:to-indigo-700/30 hover:border-blue-300/50
               transform hover:-translate-y-2 hover:rotate-1 hover:scale-105
               transition-all duration-500 ease-out cursor-pointer
               shadow-[0_10px_30px_rgba(59,130,246,0.2)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.4)]'
             data-aos="zoom-in" data-aos-delay="200">
              <CounterCard className="text-white" label={t('Mahsulotlar', 'Продукты')} value={stats.products} />
            </div>
            <div className='
                bg-gradient-to-br from-blue-800/20
               to-indigo-900/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl overflow-hidden
               hover:from-blue-600/30 hover:to-indigo-700/30 hover:border-blue-300/50
               transform hover:-translate-y-2 hover:rotate-1 hover:scale-105
               transition-all duration-500 ease-out cursor-pointer
               shadow-[0_10px_30px_rgba(59,130,246,0.2)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.4)]' data-aos="zoom-in" data-aos-delay="300">
              <CounterCard className="text-white" label={t('Xodimlar', 'Сотрудники')} value={500} />
            </div>
            <div className='
                bg-gradient-to-br from-blue-800/20
               to-indigo-900/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl overflow-hidden
               hover:from-blue-600/30 hover:to-indigo-700/30 hover:border-blue-300/50
               transform hover:-translate-y-2 hover:rotate-1 hover:scale-105
               transition-all duration-500 ease-out cursor-pointer
               shadow-[0_10px_30px_rgba(59,130,246,0.2)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.4)]' data-aos="zoom-in" data-aos-delay="400">
              <CounterCard className="text-white" label={t('Mamlakatlar', 'Страны')} value={30} />
            </div>
            <div className='
                bg-gradient-to-br from-blue-800/20
               to-indigo-900/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl overflow-hidden
               hover:from-blue-600/30 hover:to-indigo-700/30 hover:border-blue-300/50
               transform hover:-translate-y-2 hover:rotate-1 hover:scale-105
               transition-all duration-500 ease-out cursor-pointer
               shadow-[0_10px_30px_rgba(59,130,246,0.2)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.4)]' data-aos="zoom-in" data-aos-delay="500">
              <CounterCard className="text-white" label={t('Yangiliklar', 'Новости')} value={stats.news} />
            </div>
          </div>
        </div>
      </section>

      {/* Ushbu yangi bo'lim uchun Three.js init - sanoatga mos gear (tishli) mexanizm animatsiyasi */}
      {useEffect(() => {
        const achievementCanvas = document.querySelector('.absolute.inset-0 canvas'); // Yangi canvas ni tanlaymiz
        if (!achievementCanvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: achievementCanvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Sanoatga mos 3D gear model (oddiy torus va cylinder bilan taqlid qilamiz)
        const gearGeometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
        const gearMaterial = new THREE.MeshPhongMaterial({ color: 0x1a5490, shininess: 100, wireframe: true });
        const gear = new THREE.Mesh(gearGeometry, gearMaterial);
        scene.add(gear);

        // Qo'shimcha mexanizm qismlari
        const shaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
        const shaftMaterial = new THREE.MeshPhongMaterial({ color: 0x2c7bc4 });
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft.rotation.x = Math.PI / 2;
        scene.add(shaft);

        // Partikllar sanoat changlari ta'siri uchun
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const positions = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 5;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({ size: 0.01, color: 0xcccccc });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        camera.position.z = 4;

        let animationFrameId;
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          gear.rotation.z += 0.005;
          shaft.rotation.z += 0.003;
          particles.position.y -= 0.001;
          if (particles.position.y < -3) particles.position.y = 3;
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
          gearGeometry.dispose();
          gearMaterial.dispose();
          shaftGeometry.dispose();
          shaftMaterial.dispose();
          particlesGeometry.dispose();
          particlesMaterial.dispose();
          renderer.dispose();
        };
      }, [])}
  <div className='max-[1000px]:hidden'>
        <h1 className='text-center p-5 text-[30px] text-[#4545DA]'>Bizning Zavodimizni 3D ko'rinishi</h1>
      {/* YANGI BO'LIM: 3D Zavod + Statistika (CounterCard) */}
      <section className="min-h-screen bg-gradient-to-b from-[#222] to-[#4545DA] relative overflow-hidden ">
        <canvas ref={factoryCanvasRef} className="absolute inset-0 w-full h-full opacity-100" />
      </section>
  </div>


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

          <div ref={sectionRef2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`fade-zoom-up ${visible2 ? "show" : ""} group relative p-8 bg-gradient-to-br from-blue-800/20
                     to-indigo-900/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl overflow-hidden
                     hover:from-blue-600/30 hover:to-indigo-700/30 hover:border-blue-300/50
                     transform hover:-translate-y-2 hover:rotate-1 hover:scale-105
                     transition-all duration-500 ease-out
                     shadow-[0_10px_30px_rgba(59,130,246,0.2)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.4)]`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative mb-6 z-10">
                  <div className="bg-gradient-to-r text-white from-blue-500 to-indigo-600 rounded-2xl p-4 inline-block shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 relative z-10 drop-shadow-md">
                  {feature.title}
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed relative z-10">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-[#4545DA]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold max-sm:text-[25px] max-sm:mb-[1px] text-white mb-6">
            {t('Hamkorlikni boshlaylik', 'Начнем сотрудничество')}
          </h2>
          <p className="text-xl text-blue-100 max-sm:text-[18px] mb-8 max-sm:mb-[15px] max-w-2xl mx-auto">
            {t(
              'Sanoat uskunalari bo\'yicha maslahat va takliflar olish uchun biz bilan bog\'laning',
              'Свяжитесь с нами для консультации и предложений по промышленному оборудованию'
            )}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold shadow-2xl hover:shadow-white/30 transform hover:scale-105 transition-all duration-300 space-x-2
            max-sm:px-4 max-sm:py-3 max-sm:text-[15px]"
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