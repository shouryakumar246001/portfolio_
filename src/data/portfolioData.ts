export interface ProjectData {
  id: string;
  name: string;
  tagline: string;
  category: string;
  technologies: string[];
  description: string;
  keyFeatures: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
  stats?: string;
  badge?: string;
}

export interface ExperienceData {
  role: string;
  organization: string;
  location?: string;
  period: string;
  type: string;
  bullets: string[];
}

export interface AchievementData {
  title: string;
  platform: string;
  metric: string;
  details: string;
  highlightColor: string;
  link?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
  description: string;
}

export const personalInfo = {
  name: 'Shourya Kumar',
  role: 'Software Development Engineer',
  headline: 'Software Developer | Full-Stack Developer | Competitive Programmer',
  location: 'Bhubaneswar, India',
  email: 'shourya24600101@gmail.com',
  phone: '+91 7870026644',
  github: 'https://github.com/shouryakumar246001',
  linkedin: 'https://linkedin.com/in/shourya-kumar-9143372b9',
  education: {
    institution: 'Kalinga Institute of Industrial Technology (KIIT)',
    degree: 'B.Tech in Computer Science and Engineering',
    period: 'Aug 2024 – May 2028 (Expected)',
    location: 'Bhubaneswar, India',
  },
  bio: "I'm a Computer Science and Engineering undergraduate passionate about building scalable web applications, solving complex problems, and developing practical software solutions. I enjoy working across the full stack, exploring new technologies, and continuously improving my problem-solving skills.",
  aboutDetailed:
    "With a strong foundation in Computer Science and Engineering at KIIT, I specialize in full-stack web development and algorithmic problem solving. I have built scalable full-stack platforms using Next.js 15, React 19, TypeScript, and Prisma ORM, and solved 500+ problems across competitive programming platforms. Dedicated to clean architecture, maintainability, and continuous engineering excellence.",
};

export const skillsCategories: SkillCategory[] = [
  {
    id: '01',
    title: 'Programming Languages',
    description: 'Core languages used for systems, algorithmic problem solving, and modern web application development.',
    skills: ['C++', 'Python', 'C', 'JavaScript', 'TypeScript', 'Java', 'SQL'],
  },
  {
    id: '02',
    title: 'Frontend Development',
    description: 'Modern component-driven UI architecture, state synchronization, and reactive styling.',
    skills: ['React 19', 'Next.js 15', 'Redux Toolkit', 'Tailwind CSS v4', 'HTML', 'CSS'],
  },
  {
    id: '03',
    title: 'Backend & Databases',
    description: 'Serverless API endpoints, data persistence layers, schema engineering, and data modeling.',
    skills: ['Next.js API Routes', 'RESTful API Design', 'Prisma ORM', 'Relational Database Design', 'Data Modeling'],
  },
  {
    id: '04',
    title: 'AI & Machine Learning',
    description: 'Computer vision pipelines, object classification models, and data transformation scripts.',
    skills: ['Machine Learning', 'Computer Vision', 'Artificial Intelligence', 'Data Preprocessing'],
  },
  {
    id: '05',
    title: 'Developer Tools & Platforms',
    description: 'Version control, development environments, and automated hosting platforms.',
    skills: ['Git', 'GitHub', 'VS Code', 'Vercel', 'Netlify'],
  },
  {
    id: '06',
    title: 'Core Computer Science',
    description: 'Fundamental theoretical disciplines backing robust software architecture and problem solving.',
    skills: ['Data Structures and Algorithms', 'Object-Oriented Programming (OOP)', 'Database Management Systems (DBMS)'],
  },
];

export const projectsData: ProjectData[] = [
  {
    id: '01',
    name: 'SugaCart.com – Multi-Vendor E-Commerce Platform',
    tagline: 'Full-stack multivendor platform with 3 role-based workflows and analytics',
    category: 'Full-Stack Web Application',
    technologies: ['Next.js 15', 'React 19', 'Redux Toolkit', 'Prisma ORM', 'Tailwind CSS v4', 'Recharts'],
    description:
      'Engineered a comprehensive full-stack multi-vendor e-commerce platform supporting three distinct user roles: Buyer, Seller, and Super Admin via Next.js App Router and Prisma relational models.',
    keyFeatures: [
      'Role-based workflows for Buyer shopping, Seller inventory, and Super Admin verification.',
      'Relational database schemas designed with Prisma ORM for merchants, orders, and catalogs.',
      'Centralized Redux Toolkit state management for shopping cart, shipping addresses, and ratings.',
      'URL-driven search, multi-category filtering, dynamic review modals, and adaptive interfaces.',
      'Seller order fulfillment, admin merchant verification, promotional coupons, and Recharts revenue dashboards.',
      'Automated and manual test cycles verifying end-to-end purchasing and checkout journeys.',
    ],
    liveDemoUrl: 'https://sugacart-demo.vercel.app', // placeholder link indicated in resume
    githubUrl: 'https://github.com/shouryakumar246001/sugacart-multivendor',
    badge: 'Flagship Full-Stack',
  },
  {
    id: '02',
    name: 'Sneaker Authenticity Checker',
    tagline: 'Responsive verification application evaluating sneaker attributes & indicators',
    category: 'Frontend & Verification Tool',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    description:
      'Developed a responsive web application designed to evaluate sneaker attributes and product authenticity indicators through a structured, multi-step verification workflow.',
    keyFeatures: [
      'Structured attribute evaluation comparing product features and authenticity criteria.',
      'Multi-step guided verification workflow with instant visual confirmation cues.',
      'Streamlined client-side state transitions handling user inputs without page reloads.',
      'Adaptive layouts optimized for both handheld mobile inspections and desktop browsing.',
    ],
    liveDemoUrl: 'https://shouryakumar246001.github.io/sneaker-authenticity-checker',
    githubUrl: 'https://github.com/shouryakumar246001/sneaker-authenticity-checker',
    badge: 'Interactive Web Tool',
  },
  {
    id: '03',
    name: 'Real-Time Object Detector',
    tagline: 'Computer vision application detecting and classifying objects in live streams',
    category: 'Computer Vision & AI',
    technologies: ['Python', 'Computer Vision', 'Machine Learning'],
    description:
      'Built a real-time computer vision application that detects, locates, and classifies objects from live video cameras and static image inputs with continuous ML inference.',
    keyFeatures: [
      'Real-time object detection and spatial classification across continuous video frames.',
      'Dual input processing pipeline supporting both live camera feeds and high-res static images.',
      'Frame preprocessing, normalization, and optimization for low-latency inference in Python.',
      'Machine learning model integration ensuring reliable classification across varying conditions.',
    ],
    githubUrl: 'https://github.com/shouryakumar246001/realtime-object-detector',
    badge: 'AI & Machine Learning',
  },
];

export const experiencesData: ExperienceData[] = [
  {
    role: 'Open Source Contributor',
    organization: 'Independent Contributor',
    period: 'Oct 2024 – Present',
    type: 'Open Source & Remote',
    bullets: [
      'Resolved defects and refactored data preprocessing pipelines across open-source Python machine learning and web repositories.',
      'Delivered frontend UI fixes and improved cross-browser rendering and responsive layouts using JavaScript and CSS.',
      'Participated in collaborative code reviews and adhered to strict upstream coding standards and Git workflows.',
    ],
  },
  {
    role: 'Placement Coordinator',
    organization: 'Training & Placement Cell, KIIT',
    location: 'Bhubaneswar, India',
    period: 'Nov 2024 – Present',
    type: 'Leadership & Student Coordination',
    bullets: [
      'Orchestrated campus recruitment drives, interview scheduling, logistics, and communication between university administration, students, and corporate HR teams.',
      'Mentored fellow students on recruitment processes, resume preparation, and technical interview readiness.',
      'Streamlined workflow management during high-volume recruitment drives ensuring seamless operations.',
    ],
  },
];

export const achievementsData: AchievementData[] = [
  {
    title: '500+ Algorithmic Problems Solved',
    platform: 'LeetCode • Codeforces • CodeChef',
    metric: '500+ Solved',
    details: 'Covering Data Structures, Dynamic Programming, Graph Theory, and Greedy Algorithms.',
    highlightColor: 'from-purple-500 to-indigo-500',
    link: 'https://github.com/shouryakumar246001',
  },
  {
    title: 'Global Rank 1326 / 25,000+',
    platform: 'CodeChef Starters 227',
    metric: 'Rank 1326',
    details: 'Achieved top 5% global standing among 25,000+ competitive programmers worldwide.',
    highlightColor: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Rank 5668 (Div. 2)',
    platform: 'Codeforces Round 1064',
    metric: 'Rank 5668',
    details: 'Competitive division performance solving complex time-constrained mathematical and graph challenges.',
    highlightColor: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Rank 7527',
    platform: 'LeetCode Weekly Contest 490',
    metric: 'Rank 7527',
    details: 'High-speed problem solving and algorithm implementation under strict contest conditions.',
    highlightColor: 'from-emerald-500 to-teal-500',
  },
];
