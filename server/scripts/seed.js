require('dotenv').config();

const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  // =========================
  // ELECTRONICS
  // =========================

  {
    name: 'Apple iPhone 15 Pro Max',
    description:
      'The iPhone 15 Pro Max features a premium titanium body, the powerful A17 Pro chip, and an advanced 48MP triple-camera system capable of capturing cinematic-quality photos and videos. Its 6.7-inch Super Retina XDR display with ProMotion technology delivers an ultra-smooth and immersive viewing experience for gaming, streaming, and productivity.',
    price: 159900,
    stock: 12,
    category: 'Electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200',
      'https://images.unsplash.com/photo-1695634628453-1e4c3d0f559f?w=1200',
    ],
  },

  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Samsung Galaxy S24 Ultra combines flagship AI features, a stunning Dynamic AMOLED 2X display, and an integrated S-Pen for productivity. Its 200MP camera system captures highly detailed images with exceptional zoom capabilities, making it ideal for creators and professionals.',
    price: 129999,
    stock: 18,
    category: 'Electronics',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200',
    ],
  },

  {
    name: 'MacBook Air M3',
    description:
      'The MacBook Air M3 offers exceptional performance and battery efficiency in a lightweight aluminum design. With a brilliant Liquid Retina display, silent fanless architecture, and Apple silicon optimization, it is perfect for students, developers, and content creators.',
    price: 124900,
    stock: 9,
    category: 'Electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200',
    ],
  },

  {
    name: 'Sony WH-1000XM5 Headphones',
    description:
      'Sony WH-1000XM5 delivers industry-leading active noise cancellation with premium sound quality and deep bass. The lightweight design, adaptive audio control, and long battery life make these headphones perfect for travel, work, and entertainment.',
    price: 29990,
    stock: 22,
    category: 'Electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200',
    ],
  },

  {
    name: 'Logitech MX Master 3S Mouse',
    description:
      'The Logitech MX Master 3S is a premium productivity mouse designed for creators and professionals. It features ultra-fast scrolling, silent clicks, ergonomic comfort, and seamless multi-device connectivity for efficient workflows.',
    price: 9999,
    stock: 35,
    category: 'Electronics',
    brand: 'Logitech',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200',
    ],
  },

  // =========================
  // FASHION
  // =========================

  {
    name: 'Nike Air Max 270',
    description:
      'Nike Air Max 270 sneakers provide exceptional comfort with a breathable mesh upper and responsive Air cushioning technology. Their modern athletic design makes them suitable for everyday casual wear and gym sessions.',
    price: 12995,
    stock: 30,
    category: 'Fashion',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200',
    ],
  },

  {
    name: 'Adidas Ultraboost Light',
    description:
      'Adidas Ultraboost Light running shoes are engineered for maximum energy return and comfort. The lightweight Boost midsole and breathable Primeknit upper deliver superior cushioning and flexibility during workouts and daily activities.',
    price: 17999,
    stock: 20,
    category: 'Fashion',
    brand: 'Adidas',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200',
      'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=1200',
    ],
  },

  {
    name: 'Levi’s 511 Slim Fit Jeans',
    description:
      'Levi’s 511 Slim Fit Jeans offer a timeless slim silhouette with stretch denim for enhanced comfort and durability. The versatile design pairs effortlessly with both casual and smart-casual outfits.',
    price: 3499,
    stock: 45,
    category: 'Fashion',
    brand: 'Levis',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200',
    ],
  },

  {
    name: 'Ray-Ban Aviator Sunglasses',
    description:
      'Ray-Ban Aviator Sunglasses feature the iconic teardrop design with premium metal frames and UV-protected lenses. Their timeless style makes them a perfect accessory for both casual and formal looks.',
    price: 8990,
    stock: 28,
    category: 'Fashion',
    brand: 'Ray-Ban',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200',
    ],
  },

  {
    name: 'Leather Travel Backpack',
    description:
      'This premium leather travel backpack combines style, durability, and functionality. It features padded laptop storage, multiple organizer compartments, and comfortable shoulder straps suitable for office, college, and travel use.',
    price: 5499,
    stock: 16,
    category: 'Fashion',
    brand: 'Hidesign',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
    ],
  },

  // =========================
  // BOOKS
  // =========================

  {
    name: 'Atomic Habits',
    description:
      'Atomic Habits by James Clear explains how tiny daily improvements can create remarkable long-term results. The book provides actionable frameworks for building good habits, breaking bad ones, and achieving consistent self-improvement.',
    price: 499,
    stock: 100,
    category: 'Books',
    brand: 'Penguin Random House',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200',
    ],
  },

  {
    name: 'The Psychology of Money',
    description:
      'Morgan Housel explores how emotions, habits, and behavior shape financial success more than technical knowledge. The book presents timeless lessons about wealth, investing, greed, and happiness.',
    price: 399,
    stock: 85,
    category: 'Books',
    brand: 'Jaico',
    images: [
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200',
      'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=1200',
    ],
  },

  {
    name: 'Deep Work',
    description:
      'Deep Work by Cal Newport teaches how focused and distraction-free work can dramatically improve productivity and creativity in a world filled with constant digital interruptions.',
    price: 599,
    stock: 65,
    category: 'Books',
    brand: 'Grand Central Publishing',
    images: [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200',
      'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=1200',
    ],
  },

  // =========================
  // HOME
  // =========================

  {
    name: 'Ergonomic Office Chair',
    description:
      'This ergonomic office chair is designed for long working hours with breathable mesh support, adjustable lumbar cushioning, and smooth height adjustment. It helps maintain healthy posture and reduces back strain.',
    price: 14999,
    stock: 14,
    category: 'Home',
    brand: 'GreenSoul',
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=1200',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1200',
    ],
  },

  {
    name: 'Minimal Ceramic Coffee Mug Set',
    description:
      'This ceramic coffee mug set features a modern minimalist design with durable heat-resistant material. Perfect for coffee, tea, and hot beverages, the mugs are microwave and dishwasher safe.',
    price: 999,
    stock: 50,
    category: 'Home',
    brand: 'Cello',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200',
    ],
  },

  {
    name: 'Luxury Scented Candle Set',
    description:
      'This luxury scented candle set includes relaxing lavender, vanilla, and sandalwood fragrances crafted with natural soy wax. Ideal for home décor, stress relief, and creating a calming atmosphere.',
    price: 1499,
    stock: 40,
    category: 'Home',
    brand: 'Karma',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200',
      'https://images.unsplash.com/photo-1602874801006-e26c4c5b5f8a?w=1200',
    ],
  },

  // =========================
  // BEAUTY
  // =========================

  {
    name: 'Minimalist Vitamin C Serum',
    description:
      'This Vitamin C face serum helps brighten skin tone, reduce pigmentation, and improve skin texture. The lightweight formula absorbs quickly and provides antioxidant protection against environmental damage.',
    price: 699,
    stock: 70,
    category: 'Beauty',
    brand: 'Minimalist',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200',
    ],
  },

  {
    name: 'Hydrating Face Moisturizer',
    description:
      'A lightweight daily moisturizer enriched with hyaluronic acid and niacinamide for deep hydration and healthy skin barrier support. Suitable for all skin types including sensitive skin.',
    price: 799,
    stock: 90,
    category: 'Beauty',
    brand: 'Cetaphil',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200',
    ],
  },

  // =========================
  // SPORTS
  // =========================

  {
    name: 'Professional Cricket Bat',
    description:
      'Crafted from premium English willow, this professional cricket bat offers excellent balance, powerful stroke play, and superior durability for competitive matches and practice sessions.',
    price: 6999,
    stock: 10,
    category: 'Sports',
    brand: 'SG',
    images: [
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200',
      'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=1200',
    ],
  },

  {
    name: 'Adjustable Dumbbell Set 20KG',
    description:
      'This adjustable dumbbell set is ideal for home workouts, strength training, and fitness routines. The durable build and ergonomic grip provide stability and comfort during exercise sessions.',
    price: 4499,
    stock: 18,
    category: 'Sports',
    brand: 'Kore',
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
    ],
  },

  {
    name: 'Premium Yoga Mat',
    description:
      'This eco-friendly yoga mat features a non-slip textured surface with excellent cushioning for yoga, stretching, pilates, and meditation. Lightweight and durable for both indoor and outdoor workouts.',
    price: 1499,
    stock: 32,
    category: 'Sports',
    brand: 'Boldfit',
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200',
    ],
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log('✅ 20 Products Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

importData();