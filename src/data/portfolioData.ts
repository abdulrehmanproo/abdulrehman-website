import { Project, Skill, Certificate } from '../types';

export const PERSONAL_INFO = {
  name: 'Abdul Rehman',
  tagline: 'Web Developer & ICS Student',
  status: 'Available for Freelance & Collaborations',
  location: 'Remote / Worldwide',
  coordinates: '31.5204° N, 74.3587° E',
  phone: '+92 309 1875679',
  phoneLocal: '03091875679',
  whatsappUrl: 'https://wa.me/923091875679',
  email: 'arainbranded83@gmail.com',
  github: 'https://github.com/abdulrehmanproo',
  linkedin: 'https://www.linkedin.com/in/abdulrehman2221/',
  tiktok: 'https://www.tiktok.com/@abdulrehman38762',
  youtube: 'https://youtube.com',
  avatarUrl: '/images/profile-clean.jpg',
  mapUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLvsB9N0xFgzdDIwDN8Ympb8TgiKqB4qoBj8JAnUx8eopY4HEqQ-i0RZN6clWIjRYH9QrwSKvwuI9K-T4pcjyPo9DuhBHBj2dw2IzoTCN4kwOBd7tI_nKzL4mD-f3nGozixJdBLq1qcV-cP8cs8nx-gJQUC3pqkyam-9bqt2FT4boPHyLzfH2RLr7XtteWMF32k8fpfhceHcVOgNX5V3wkjlqdT_6C2qw87_NnCf5m7NWpb5xXt2Lfgg',
  bio: 'Passionate about building modern, responsive, and innovative web experiences. Specializing in high-performance Full Stack Web Apps, interactive 3D interfaces, and modern UI engineering.',
  diagnostic: 'Continuous architectural evolution driven by high computing standards, algorithmic rigor, and creative modern execution.'
};

export const HIGHLIGHTS = [
  {
    id: 'highlight-1',
    icon: 'school',
    title: 'ICS 11th Grade',
    desc: 'Pursuing Intermediate in Computer Science with a sharp focus on software engineering concepts and algorithms.',
    accent: 'cyan'
  },
  {
    id: 'highlight-2',
    icon: 'code',
    title: 'Full Stack Engineering',
    desc: 'Engineering high-performance web applications, modern responsive UI systems, and interactive digital products.',
    accent: 'purple'
  },
  {
    id: 'highlight-3',
    icon: 'bolt',
    title: 'Freelance Pro',
    desc: 'Delivering tailor-made enterprise dashboards, e-commerce storefronts, and interactive 3D client platforms.',
    accent: 'cyan'
  },
  {
    id: 'highlight-4',
    icon: 'verified_user',
    title: 'Clean Code Craftsman',
    desc: 'Adhering to strict modularity, automated test patterns, optimal time complexity, and zero-compromise UX.',
    accent: 'purple'
  }
];

export const SKILLS: Skill[] = [
  {
    name: 'HTML5 & Modern CSS3',
    level: 96,
    category: 'frontend',
    icon: 'html',
    color: 'cyan',
    description: 'Semantic hierarchy, responsive design systems, CSS grid, SVG manipulation, fluid typography.'
  },
  {
    name: 'JavaScript & TypeScript',
    level: 92,
    category: 'languages',
    icon: 'javascript',
    color: 'purple',
    description: 'ESNext, strong type safety, asynchronous event loop, state streams, functional patterns.'
  },
  {
    name: 'React.js & Next.js',
    level: 88,
    category: 'frontend',
    icon: 'deployed_code',
    color: 'cyan',
    description: 'Server Components, dynamic SSR/SSG caching, React Query hooks, Framer Motion transitions.'
  },
  {
    name: 'Python Programming',
    level: 84,
    category: 'languages',
    icon: 'terminal',
    color: 'purple',
    description: 'Backend logic pipelines, data structures, automation scripts, API integration, and parsing.'
  },
  {
    name: 'Git & GitHub Versioning',
    level: 90,
    category: 'tools',
    icon: 'fork_right',
    color: 'cyan',
    description: 'Branching lifecycles, CI/CD GitHub Actions, PR code reviews, and trunk-based deployment.'
  },
  {
    name: 'Tailwind CSS & UI/UX',
    level: 95,
    category: 'frontend',
    icon: 'palette',
    color: 'purple',
    description: 'Design token architecture, glassmorphism, responsive systems, accessible WCAG contrast.'
  }
];

export const CERTIFICATE: Certificate = {
  id: 'nexskill-2026',
  title: 'Certificate of Completion – Web Development Bootcamp',
  organization: 'Nexskill – Training • Freelancing • Placement',
  year: '2026',
  credentialId: 'NEXSKILL-DEV-2026',
  status: 'Verified Credential • Distinction',
  description: 'Comprehensive Web Development Bootcamp at Nexskill covering HTML5, CSS3, JavaScript, React, MongoDB, Supabase, backend development, and responsive UI engineering. Awarded with Technical Assessment B+ (78%) and 92% attendance.',
  skillsAcquired: [
    'HTML5, Modern CSS3 & JavaScript',
    'React & Component Architecture',
    'Backend Development & REST APIs',
    'Database Management (MongoDB, Supabase)',
    'Responsive Design & Modern UI/UX',
    'Authentication & API Integration'
  ],
  imageUrl: '/images/nexskill-certificate.jpg'
};

export const PROJECTS: Project[] = [
  {
    id: 'techtitan',
    title: 'TechTitan E-Commerce Engine',
    category: 'E-COMMERCE ENGINE',
    type: 'Full Stack Web Platform',
    description: 'High-performance custom PC & Gaming Laptop marketplace with live cart computation, comprehensive hardware specs filters, interactive bench reviews, and zero-latency checkout flows.',
    tags: ['React', 'Node.js', 'Tailwind CSS', 'Stripe API'],
    accentColor: 'cyan',
    icon: 'memory',
    features: [
      'Interactive Custom PC Part Picker with instant wattage & compatibility verification',
      'Real-time inventory calculation and Stripe payment gateway integration',
      'Benchmark comparisons for RTX 4090 / RX 7900 XTX gaming configurations',
      'Dark obsidian cyber UI with instantaneous search and filtering'
    ],
    metrics: [
      { label: 'Latency', value: '45ms' },
      { label: 'Uptime', value: '99.98%' },
      { label: 'Cart Conversion', value: '+38%' }
    ],
    highlights: ['Stripe 3D-Secure', 'Zustand State', 'Dynamic SSR', 'Instant Cart']
  },
  {
    id: 'cravedash',
    title: 'CraveDash Food Delivery App',
    category: 'DELIVERY ECOSYSTEM',
    type: 'Realtime Dispatch Platform',
    description: 'Real-time food order & live courier GPS delivery tracking platform with custom in-app wallet integration, scheduled dispatches, and culinary menu search algorithms.',
    tags: ['Next.js', 'WebSockets', 'Leaflet Maps', 'Tailwind CSS'],
    accentColor: 'purple',
    icon: 'delivery_dining',
    features: [
      'Live courier GPS coordinate interpolation via high-frequency WebSockets',
      'Interactive vector map telemetry with estimated delivery time updates',
      'Restaurant dispatch dashboard with instant sound alerts and order queues',
      'In-app digital wallet and contactless delivery authorization'
    ],
    metrics: [
      { label: 'Socket Ping', value: '18ms' },
      { label: 'Tracking Accuracy', value: '99.4%' },
      { label: 'Active Couriers', value: '250+' }
    ],
    highlights: ['Leaflet Vector Engine', 'WebSocket Streams', 'Instant Push', 'Dynamic Routing']
  },
  {
    id: 'luxemobile',
    title: 'LuxeMobile Premium Storefront',
    category: 'INTERACTIVE 3D STOREFRONT',
    type: 'WebGL & Hardware Showcase',
    description: 'Next-generation interactive 3D smartphone showcase with custom Three.js orbit viewer, exploded hardware internals visualization, and real-time colorway configuration.',
    tags: ['Three.js', 'WebGL', 'TypeScript', 'GSAP Motion'],
    accentColor: 'cyan',
    icon: 'view_in_ar',
    features: [
      'Interactive 360° PBR shader rendering of flagship smartphone chassis',
      'Exploded camera array animation detailing periscope telephoto lens mechanics',
      'Real-time material gloss, roughness, and titanium finish customization',
      'Smooth scroll-triggered cinematic camera waypoints'
    ],
    metrics: [
      { label: 'FPS Target', value: '60 FPS' },
      { label: 'Draw Calls', value: '< 24' },
      { label: 'PBR Shaders', value: 'Custom' }
    ],
    highlights: ['Three.js WebGL', 'Custom PBR Shader', 'OrbitControls', 'Exploded View']
  },
  {
    id: 'cyberweather',
    title: 'CyberWeather Live Radar',
    category: 'RADAR TELEMETRY',
    type: 'Meteorological Intelligence',
    description: 'Real-time meteorological forecasting web application with glassmorphic spatial cards, interactive atmospheric pressure maps, and severe weather alert feeds.',
    tags: ['OpenWeather API', 'Chart.js', 'Tailwind CSS', 'REST API'],
    accentColor: 'purple',
    icon: 'thunderstorm',
    features: [
      'High-precision live atmospheric radar with precipitation telemetry and wind vectors',
      'Hourly temperature and humidity projection graphs rendered in custom cyber charts',
      'Global location search with automatic geolocation fallback and timezone alignment',
      'Severe micro-climate meteorological alert broadcast triggers'
    ],
    metrics: [
      { label: 'Forecast Range', value: '14 Days' },
      { label: 'Cities Monitored', value: '200,000+' },
      { label: 'Refresh Rate', value: '30s' }
    ],
    highlights: ['OpenWeather API', 'Chart.js Visualizer', 'Live Radar', 'Air Quality Telemetry']
  }
];
