// Mock data for admin panel - will be replaced with real API calls later

export const mockProducts = [
  {
    id: "prod-001",
    name_uz: "CNC Frezerlash mashinasi",
    name_ru: "Фрезерный станок CNC",
    description_uz: "Yuqori aniqlikdagi CNC frezerlash mashinasi",
    description_ru: "Фрезерный станок CNC высокой точности",
    specifications_uz: {
      "Ish maydoni": "1200x800x600 mm",
      "Quvvat": "15 kW"
    },
    specifications_ru: {
      "Рабочая область": "1200x800x600 мм",
      "Мощность": "15 кВт"
    },
    category_uz: "Dastgohlar",
    category_ru: "Станки",
    price: 85000,
    image_url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-002",
    name_uz: "Lazer kesish mashinasi",
    name_ru: "Лазерный станок для резки",
    description_uz: "Yuqori quvvatli lazer bilan metall kesish",
    description_ru: "Резка металла с мощным лазером",
    specifications_uz: {
      "Lazer quvvati": "6000 W",
      "Kesish qalinligi": "25 mm"
    },
    specifications_ru: {
      "Мощность лазера": "6000 Вт",
      "Толщина резки": "25 мм"
    },
    category_uz: "Lazer uskunalari",
    category_ru: "Лазерное оборудование",
    price: 125000,
    image_url: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800",
    created_at: new Date().toISOString()
  }
];

export const mockNews = [
  {
    id: "news-001",
    title_uz: "Yangi lazer kesish mashinasi ishga tushirildi",
    title_ru: "Введена в эксплуатацию новая лазерная машина",
    content_uz: "Zavodimiz yangi avlod lazer kesish mashinasini ishga tushirdi...",
    content_ru: "Наш завод ввел в эксплуатацию лазерную машину нового поколения...",
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    date: new Date().toISOString(),
    category_uz: "Yangiliklarimiz",
    category_ru: "Наши новости"
  },
  {
    id: "news-002",
    title_uz: "Xalqaro ko'rgazmada ishtirok etdik",
    title_ru: "Приняли участие в международной выставке",
    content_uz: "Kompaniyamiz Germaniyada bo'lib o'tgan ko'rgazmada ishtirok etdi...",
    content_ru: "Наша компания приняла участие в выставке в Германии...",
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    date: new Date().toISOString(),
    category_uz: "Ko'rgazmalar",
    category_ru: "Выставки"
  }
];

export const mockContacts = [
  {
    id: "contact-001",
    name: "Sardor Alimov",
    email: "sardor@example.com",
    phone: "+998 90 123-45-67",
    company: "Tech Solutions",
    message: "Interested in CNC machines",
    created_at: new Date().toISOString()
  },
  {
    id: "contact-002",
    name: "Olga Petrova",
    email: "olga@example.com",
    phone: "+998 91 234-56-78",
    company: "Industrial Corp",
    message: "Need laser cutting equipment",
    created_at: new Date().toISOString()
  }
];

export const mockCompanyInfo = {
  about_uz: "Bizning zavodimiz 1995 yildan beri yuqori sifatli sanoat uskunalarini ishlab chiqaradi.",
  about_ru: "Наш завод производит высококачественное промышленное оборудование с 1995 года.",
  history_uz: "1995 yilda kichik ustaxona sifatida boshlangan...",
  history_ru: "Начав в 1995 году как небольшая мастерская...",
  mission_uz: "Zamonaviy texnologiyalar orqali sanoatni rivojlantirish",
  mission_ru: "Развитие промышленности через современные технологии",
  vision_uz: "2030 yilga kelib xalqaro miqyosdagi ishlab chiqaruvchi",
  vision_ru: "Производитель международного уровня к 2030 году",
  employees_count: 500,
  established_year: 1995,
  address_uz: "Toshkent shahar, Yashnobod tumani, Sanoat ko'chasi 45-uy",
  address_ru: "г. Ташкент, Яшнабадский район, ул. Саноат 45",
  phone: "+998 71 234-56-78",
  email: "info@techfactory.uz",
  telegram: "@techfactory_uz",
  latitude: 41.2856806,
  longitude: 69.2286191
};

export const mockStats = {
  totalProducts: 10,
  totalNews: 10,
  totalContacts: 15,
  newContactsThisMonth: 5
};