import React, { useState } from 'react';
import FadeIn from './FadeIn';
import Heading3D from './Heading3D';
import ResumeModal from './ResumeModal';
import { Mail, Phone, MapPin, Linkedin, Github, Download, CheckCircle, Send } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mailto = `mailto:shourya24600101@gmail.com?subject=${encodeURIComponent(
      formData.subject || `Inquiry from ${formData.name}`
    )}&body=${encodeURIComponent(`Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}`)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.location.href = mailto;
    }, 600);
  };

  return (
    <>
      <footer id="contact" className="bg-[#0C0C0C] pt-24 sm:pt-32 pb-16 px-5 sm:px-8 md:px-10 border-t border-[#D7E2EA]/15 select-none relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Heading3D
            title="Let's Build Something Together."
            subtitle="I'm always interested in discussing software development, innovative projects, open-source contributions, and exciting opportunities."
            subtitleType="prose"
            className="mb-16 sm:mb-20"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
            {/* Left Contact Information (5 cols) */}
            <FadeIn delay={0.15} y={30} className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#BBCCD7] mb-2">
                Contact Information
              </h3>

              {/* Email Card */}
              <a
                href="mailto:shourya24600101@gmail.com"
                className="flex items-center gap-4 p-5 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl hover:border-white/35 hover:bg-white/[0.07] shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.1)] transition-all group no-underline"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
                  <Mail className="w-5 h-5 text-[#B600A8]" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] font-mono text-[#D7E2EA]/60 uppercase tracking-wider">Email</div>
                  <div className="text-sm sm:text-base font-bold text-white truncate">shourya24600101@gmail.com</div>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href="tel:+917870026644"
                className="flex items-center gap-4 p-5 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl hover:border-white/35 hover:bg-white/[0.07] shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.1)] transition-all group no-underline"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#D7E2EA]/60 uppercase tracking-wider">Phone</div>
                  <div className="text-sm sm:text-base font-bold text-white">+91 7870026644</div>
                </div>
              </a>

              {/* Location Card */}
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.1)]">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#D7E2EA]/60 uppercase tracking-wider">Location</div>
                  <div className="text-sm sm:text-base font-bold text-white">Bhubaneswar, India</div>
                </div>
              </div>

              {/* Quick links & Resume button */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://linkedin.com/in/shourya-kumar-9143372b9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md hover:border-white/35 hover:bg-white/[0.09] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] text-xs uppercase tracking-wider font-medium text-white transition-all no-underline"
                >
                  <Linkedin className="w-4 h-4 text-[#0077B5]" />
                  <span>LinkedIn Profile</span>
                </a>

                <a
                  href="https://github.com/shouryakumar246001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md hover:border-white/35 hover:bg-white/[0.09] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] text-xs uppercase tracking-wider font-medium text-white transition-all no-underline"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Profile</span>
                </a>

                <a
                  href="https://codolio.com/profile/sugaa.shourya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md hover:border-white/35 hover:bg-white/[0.09] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] text-xs uppercase tracking-wider font-medium text-white transition-all no-underline"
                >
                  <img src="/codolio.png" alt="Codolio" className="w-4 h-4 object-contain" />
                  <span>Codolio Profile</span>
                </a>

                <button
                  onClick={() => setIsResumeOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-md hover:bg-emerald-500/20 hover:border-emerald-500/60 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] text-xs uppercase tracking-wider font-medium text-emerald-300 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </button>
              </div>
            </FadeIn>

            {/* Right Contact Form (7 cols) */}
            <FadeIn delay={0.25} y={30} className="lg:col-span-7">
              <div className="rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_0_rgba(255,255,255,0.12)]">
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white mb-2">
                  Send a Message
                </h3>
                <p className="text-xs sm:text-sm text-[#D7E2EA]/70 font-light mb-6">
                  Fill in the details below and I will get back to you promptly.
                </p>

                {isSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-white uppercase text-base">Message Prompt Ready!</h4>
                    <p className="text-xs sm:text-sm text-[#D7E2EA]/80 font-light">
                      Your email client has been launched with your message. Thank you for reaching out!
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-3 text-xs uppercase font-mono tracking-wider text-[#BBCCD7] hover:underline cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/70 mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/15 text-white placeholder-[#D7E2EA]/30 text-sm focus:outline-none focus:border-white/40 focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(255,255,255,0.06)] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/70 mb-1.5">
                          Your Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/15 text-white placeholder-[#D7E2EA]/30 text-sm focus:outline-none focus:border-white/40 focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(255,255,255,0.06)] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/70 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Internship Opportunity / Project Inquiry"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/15 text-white placeholder-[#D7E2EA]/30 text-sm focus:outline-none focus:border-white/40 focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(255,255,255,0.06)] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/70 mb-1.5">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Hi Shourya, I would like to discuss..."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/15 text-white placeholder-[#D7E2EA]/30 text-sm focus:outline-none focus:border-white/40 focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(255,255,255,0.06)] transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full text-white font-medium uppercase tracking-widest py-3.5 text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                        outline: '2px solid white',
                        outlineOffset: '-3px',
                      }}
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Footer bar */}
          <div className="mt-20 pt-8 border-t border-[#D7E2EA]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#D7E2EA]/50 text-center sm:text-left">
            <div>© {new Date().getFullYear()} Shourya Kumar. All rights reserved.</div>
            <div>Designed with React • TypeScript • Tailwind CSS • Framer Motion</div>
          </div>
        </div>

        <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      </footer>
    </>
  );
};

export default ContactSection;
