import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Download, X, MapPin, Phone, Mail, Linkedin, Github } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Shourya_Kumar_Resume.pdf';
    link.download = 'Shourya_Kumar_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#111111]/85 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden flex flex-col z-10"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-medium text-[#D7E2EA] uppercase tracking-wider text-sm sm:text-base">
                  Resume Preview • Shourya Kumar
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors cursor-pointer"
                  title="Print / Save as PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B600A8] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#B600A8]/80 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Resume Content */}
            <div className="p-6 sm:p-10 overflow-y-auto text-[#D7E2EA] space-y-8 bg-[#0C0C0C]/90 font-['Kanit']">
              {/* Name & Contact */}
              <div className="border-b border-[#D7E2EA]/15 pb-6 text-center">
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
                  SHOURYA KUMAR
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#D7E2EA]/80 font-light">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Bhubaneswar, India
                  </span>
                  <a href="tel:+917870026644" className="flex items-center gap-1 hover:text-white no-underline text-[#D7E2EA]/80">
                    <Phone className="w-3.5 h-3.5" /> +91 7870026644
                  </a>
                  <a href="mailto:shourya24600101@gmail.com" className="flex items-center gap-1 hover:text-white no-underline text-[#D7E2EA]/80">
                    <Mail className="w-3.5 h-3.5" /> shourya24600101@gmail.com
                  </a>
                  <a
                    href="https://linkedin.com/in/shourya-kumar-9143372b9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white no-underline text-[#D7E2EA]/80"
                  >
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a
                    href="https://github.com/shouryakumar246001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white no-underline text-[#D7E2EA]/80"
                  >
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#BBCCD7] border-b border-[#D7E2EA]/10 pb-1 mb-2">
                  Professional Summary
                </h2>
                <p className="text-xs sm:text-sm text-[#D7E2EA]/90 leading-relaxed font-light">
                  Computer Science undergraduate (B.Tech CSE, expected May 2028) at KIIT seeking a Software Development Engineer (SDE) internship. Full-stack developer skilled in building web applications and REST APIs with React, Next.js, TypeScript, Prisma ORM and SQL, backed by strong proficiency in data structures and algorithms.
                </p>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#BBCCD7] border-b border-[#D7E2EA]/10 pb-1 mb-2">
                  Education
                </h2>
                <div className="flex justify-between items-start text-xs sm:text-sm">
                  <div>
                    <h3 className="font-medium text-white">Kalinga Institute of Industrial Technology (KIIT)</h3>
                    <p className="text-[#D7E2EA]/80 italic">B.Tech in Computer Science and Engineering</p>
                  </div>
                  <div className="text-right text-[#D7E2EA]/70">
                    <p>Bhubaneswar, India</p>
                    <p>Aug 2024 – May 2028 (Expected)</p>
                  </div>
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#BBCCD7] border-b border-[#D7E2EA]/10 pb-1 mb-2">
                  Technical Skills
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  <p><strong className="text-white">Languages:</strong> C++, Python, C, JavaScript, TypeScript, SQL, Java</p>
                  <p><strong className="text-white">Frontend:</strong> React 19, Next.js 15, Redux Toolkit, Tailwind CSS v4, HTML, CSS</p>
                  <p><strong className="text-white">Backend & DB:</strong> Next.js API Routes, RESTful API Design, Prisma ORM, Relational Database Design</p>
                  <p><strong className="text-white">Core CS & AI:</strong> Data Structures & Algorithms (DSA), OOP, DBMS, Machine Learning, Computer Vision</p>
                  <p className="sm:col-span-2"><strong className="text-white">Developer Tools:</strong> Git, GitHub, VS Code, Vercel, Netlify</p>
                </div>
              </div>

              {/* Projects */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#BBCCD7] border-b border-[#D7E2EA]/10 pb-1 mb-3">
                  Projects
                </h2>
                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-white">SugaCart – Multivendor E-Commerce Platform</h3>
                      <span className="text-[11px] text-[#BBCCD7]">Next.js 15, React 19, Redux Toolkit, Prisma ORM, Tailwind CSS, Recharts</span>
                    </div>
                    <ul className="list-disc list-inside text-[#D7E2EA]/80 space-y-1 font-light">
                      <li>Engineered full-stack multivendor platform supporting 3 role-based workflows (Buyer, Seller, Super Admin) via Next.js App Router & Prisma models.</li>
                      <li>Architected relational schemas in Prisma ORM and centralized Redux Toolkit state management for cart, address, and ratings.</li>
                      <li>Developed URL-driven search, multicategory filtering, dynamic review modals, and responsive user interfaces.</li>
                      <li>Implemented seller inventory control, admin merchant verification, promotional coupons, and revenue analytics dashboards.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-white">Sneaker Authenticity Checker</h3>
                      <span className="text-[11px] text-[#BBCCD7]">JavaScript, HTML, CSS</span>
                    </div>
                    <ul className="list-disc list-inside text-[#D7E2EA]/80 space-y-1 font-light">
                      <li>Developed responsive web application evaluating sneaker attributes and authenticity indicators from structured user inputs.</li>
                      <li>Streamlined client-side state transitions and adaptive layouts across desktop and mobile devices.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-white">Real-Time Object Detector</h3>
                      <span className="text-[11px] text-[#BBCCD7]">Python, Computer Vision, Machine Learning</span>
                    </div>
                    <ul className="list-disc list-inside text-[#D7E2EA]/80 space-y-1 font-light">
                      <li>Built real-time computer vision application detecting and classifying objects from live video streams and static images.</li>
                      <li>Integrated image preprocessing and machine learning inference pipelines in Python for continuous object classification.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#BBCCD7] border-b border-[#D7E2EA]/10 pb-1 mb-2">
                  Experience
                </h2>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-white">Open Source Contributor • Remote</h3>
                      <span className="text-[#BBCCD7] text-xs">Oct 2024 – Present</span>
                    </div>
                    <p className="text-[#D7E2EA]/80 font-light mt-0.5">Resolved defects and refactored data preprocessing pipelines across open-source Python ML and web repositories.</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-white">Placement Coordinator • Training & Placement Cell, KIIT</h3>
                      <span className="text-[#BBCCD7] text-xs">Nov 2024 – Present</span>
                    </div>
                    <p className="text-[#D7E2EA]/80 font-light mt-0.5">Orchestrated campus recruitment drives, interview scheduling, logistics and communication across administration, students and corporate HR teams.</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#BBCCD7] border-b border-[#D7E2EA]/10 pb-1 mb-2">
                  Achievements
                </h2>
                <ul className="list-disc list-inside text-xs sm:text-sm text-[#D7E2EA]/80 space-y-1 font-light">
                  <li>Solved 500+ algorithmic problems across LeetCode, Codeforces and CodeChef covering data structures, dynamic programming, graphs and greedy algorithms.</li>
                  <li>Secured Global Rank 1326 out of 25,000+ participants in CodeChef Starters 227.</li>
                  <li>Achieved Rank 5668 in Codeforces Round 1064 (Div. 2) and Rank 7527 in LeetCode Weekly Contest 490.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResumeModal;
