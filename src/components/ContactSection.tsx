import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import FadeIn from './FadeIn';
import Heading3D from './Heading3D';
import ResumeModal from './ResumeModal';
import { Mail, Phone, MapPin, Linkedin, Github, Download, CheckCircle, AlertCircle, Send, ExternalLink, RotateCcw, LucideIcon } from 'lucide-react';
import { playKeyboardSound } from '../utils/audio';

interface ContactCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  accentColor: string;
  glowColor: string;
  iconBgColor: string;
  index: number;
}

const ContactInfoCard3D: React.FC<ContactCardProps> = ({
  icon: Icon,
  label,
  value,
  href,
  accentColor,
  glowColor,
  iconBgColor,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotation({
      x: -((y - centerY) / centerY) * 6,
      y: ((x - centerX) / centerX) * 6,
    });
    setSpotlight({ x, y, opacity: 1 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playKeyboardSound(index, false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const content = (
    <div style={{ perspective: 1000 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => playKeyboardSound(index, true)}
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          y: isHovered ? -5 : 0,
          scale: isHovered ? 1.015 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 22,
          mass: 0.6,
        }}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="relative flex items-center gap-4.5 p-5 sm:p-5.5 rounded-2xl border border-white/15 hover:border-white/35 bg-[#101115]/95 shadow-[0_15px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden transition-colors duration-300 group select-none cursor-pointer"
      >
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(350px circle at ${spotlight.x}px ${spotlight.y}px, ${glowColor}, transparent 75%)`,
          }}
        />

        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-colors" />

        <div
          style={{ transform: 'translateZ(26px)', transformStyle: 'preserve-3d' }}
          className={`w-12 h-12 rounded-xl ${iconBgColor} border border-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]`}
        >
          <Icon className={`w-5 h-5 ${accentColor}`} />
        </div>

        <div
          style={{ transform: 'translateZ(24px)', transformStyle: 'preserve-3d' }}
          className="overflow-hidden"
        >
          <div className="text-[11px] font-mono text-[#D7E2EA]/60 uppercase tracking-wider mb-0.5">
            {label}
          </div>
          <div className="text-sm sm:text-base font-bold text-white group-hover:text-white transition-colors truncate">
            {value}
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block no-underline">
        {content}
      </a>
    );
  }

  return content;
};

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success' | 'needs_activation' | 'error'>('idle');
  const [submittingStatus, setSubmittingStatus] = useState<string>('Preparing Message...');
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const formCardRef = useRef<HTMLDivElement>(null);
  const [formRotation, setFormRotation] = useState({ x: 0, y: 0 });
  const [formSpotlight, setFormSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const handleFormMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formCardRef.current) return;
    const rect = formCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setFormRotation({
      x: -((y - centerY) / centerY) * 3,
      y: ((x - centerX) / centerX) * 3,
    });
    setFormSpotlight({ x, y, opacity: 1 });
  };

  const handleFormMouseLeave = () => {
    setFormRotation({ x: 0, y: 0 });
    setFormSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (statusError) setStatusError(null);
  };

  const getMailtoUrl = () => {
    const s = encodeURIComponent(formData.subject.trim() || `Portfolio Inquiry from ${formData.name.trim() || 'Visitor'}`);
    const b = encodeURIComponent(
      `Hi Shourya,\n\n${formData.message.trim()}\n\n---\nSender: ${formData.name.trim() || 'Visitor'}\nEmail: ${formData.email.trim() || 'Not specified'}`
    );
    return `mailto:shourya24600101@gmail.com?subject=${s}&body=${b}`;
  };

  const getGmailWebUrl = () => {
    const s = encodeURIComponent(formData.subject.trim() || `Portfolio Inquiry from ${formData.name.trim() || 'Visitor'}`);
    const b = encodeURIComponent(
      `Hi Shourya,\n\n${formData.message.trim()}\n\n---\nSender: ${formData.name.trim() || 'Visitor'}\nEmail: ${formData.email.trim() || 'Not specified'}`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=shourya24600101@gmail.com&su=${s}&body=${b}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionState('submitting');
    setSubmittingStatus('Connecting to mail service...');
    setStatusError(null);
    playKeyboardSound(7, true);

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanSubject = formData.subject.trim() || `Portfolio Inquiry from ${cleanName}`;
    const cleanMessage = formData.message.trim();

    const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 5000) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return res;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    // Attempt 1: Try the backend, which delivers through configured mail or FormSubmit.
    try {
      setSubmittingStatus('Checking server mail handler...');
      const apiRes = await fetchWithTimeout('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
        }),
      }, 12000);

      const apiData = await apiRes.json();
      if (apiRes.ok) {
        if (apiData.success && !apiData.needsActivation) {
          setIsSubmitting(false);
          setSubmissionState('success');
          return;
        }
      }

      if (apiData.needsActivation || (typeof apiData.message === 'string' && /activation|confirm.*email|verify.*email/i.test(apiData.message))) {
        setIsSubmitting(false);
        setSubmissionState('needs_activation');
        setStatusError(
          "FormSubmit requires a one-time email activation. Check shourya24600101@gmail.com and click 'Activate Form' to enable automatic delivery. Your message is preserved below if you need to send it manually."
        );
        return;
      }
    } catch {
      // Backend not running, timed out, or not configured - seamlessly fall through to FormSubmit
    }

    // Attempt 2: Direct FormSubmit with a 6-second timeout
    try {
      setSubmittingStatus('Dispatching via FormSubmit...');
      const payload = {
        name: cleanName,
        email: cleanEmail,
        _subject: cleanSubject,
        message: cleanMessage,
        _captcha: 'false',
        _template: 'table',
      };

      const response = await fetchWithTimeout('https://formsubmit.co/ajax/shourya24600101@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      }, 6000);

      const data = await response.json();
      setIsSubmitting(false);

      if (typeof data.message === 'string' && /activation|confirm.*email|verify.*email/i.test(data.message)) {
        // FormSubmit requires one-time email activation from shourya24600101@gmail.com
        setSubmissionState('needs_activation');
        setStatusError(
          "FormSubmit sent an activation email to shourya24600101@gmail.com. Once you click 'Activate Form' in your inbox (or Spam folder), automatic delivery will be enabled. Until then, use the instant 1-click Gmail or Mail App button below!"
        );
      } else if (data.success === 'true' || data.success === true) {
        setSubmissionState('success');
      } else {
        setSubmissionState('error');
        setStatusError(
          data.message ||
          `Form submission failed${response.ok ? '' : ` (HTTP ${response.status})`}. You can still send the message using the Gmail or Mail App option below.`
        );
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      setSubmissionState('error');
      const isTimeout = err instanceof Error && (err.name === 'AbortError' || err.message?.includes('aborted'));
      setStatusError(
        isTimeout
          ? 'Network request timed out. You can dispatch your message instantly in 1-click via Gmail or your mail app below without retyping!'
          : 'Could not connect to the remote mail forwarder. You can dispatch your message instantly in 1-click via Gmail or your mail app below!'
      );
    }
  };

  return (
    <>
      <footer
        id="contact"
        className="bg-[#0C0C0C] pt-24 sm:pt-32 pb-16 px-5 sm:px-8 md:px-10 border-t border-[#D7E2EA]/15 select-none relative"
      >
        <div className="max-w-6xl mx-auto">
          <Heading3D
            title="Let's Build Something Together"
            subtitle="I'm always interested in discussing software development, innovative projects, open-source contributions, and exciting opportunities."
            subtitleType="prose"
            className="mb-16 sm:mb-20"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-14 items-start">
            {/* Left Contact Information (5 cols) */}
            <FadeIn delay={0.15} y={30} className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#B600A8]" />
                <h3 className="text-xs uppercase tracking-widest font-mono text-[#D7E2EA]/75 font-semibold">
                  Contact Information
                </h3>
              </div>

              <ContactInfoCard3D
                icon={Mail}
                label="Email"
                value="shourya24600101@gmail.com"
                href="mailto:shourya24600101@gmail.com"
                accentColor="text-[#E879F9]"
                glowColor="rgba(182, 0, 168, 0.2)"
                iconBgColor="bg-[#B600A8]/15"
                index={0}
              />

              <ContactInfoCard3D
                icon={Phone}
                label="Phone"
                value="+91 7870026644"
                href="tel:+917870026644"
                accentColor="text-emerald-400"
                glowColor="rgba(16, 185, 129, 0.2)"
                iconBgColor="bg-emerald-500/15"
                index={1}
              />

              <ContactInfoCard3D
                icon={MapPin}
                label="Location"
                value="Bhubaneswar, India"
                accentColor="text-cyan-400"
                glowColor="rgba(6, 182, 212, 0.2)"
                iconBgColor="bg-cyan-500/15"
                index={2}
              />

              {/* Quick links & Resume button */}
              <div className="pt-3 flex flex-wrap gap-3">
                <motion.a
                  href="https://linkedin.com/in/shourya-kumar-9143372b9"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => playKeyboardSound(3, false)}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ y: 1, scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 hover:border-[#0077B5]/60 bg-[#121316] hover:bg-[#17181d] text-xs uppercase tracking-wider font-medium text-white transition-colors no-underline group cursor-pointer"
                >
                  <Linkedin className="w-4 h-4 text-[#0077B5] group-hover:scale-110 transition-transform" />
                  <span>LinkedIn Profile</span>
                </motion.a>

                <motion.a
                  href="https://github.com/shouryakumar246001"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => playKeyboardSound(4, false)}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ y: 1, scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 hover:border-white/40 bg-[#121316] hover:bg-[#17181d] text-xs uppercase tracking-wider font-medium text-white transition-colors no-underline group cursor-pointer"
                >
                  <Github className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>GitHub Profile</span>
                </motion.a>

                <motion.a
                  href="https://codolio.com/profile/sugaa.shourya"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => playKeyboardSound(5, false)}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ y: 1, scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 hover:border-[#F97316]/60 bg-[#121316] hover:bg-[#17181d] text-xs uppercase tracking-wider font-medium text-white transition-colors no-underline group cursor-pointer"
                >
                  <img src="/codolio.png" alt="Codolio" className="w-4 h-4 object-contain group-hover:scale-110 transition-transform" />
                  <span>Codolio Profile</span>
                </motion.a>

                <motion.button
                  onClick={() => {
                    playKeyboardSound(6, true);
                    const link = document.createElement('a');
                    link.href = '/Shourya_Kumar_Resume.pdf';
                    link.download = 'Shourya_Kumar_Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setIsResumeOpen(true);
                  }}
                  onMouseEnter={() => playKeyboardSound(6, false)}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ y: 1, scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-emerald-500/50 bg-[#091411] hover:bg-[#0d1c17] hover:border-emerald-500/70 text-xs uppercase tracking-wider font-medium text-emerald-300 transition-colors cursor-pointer group"
                >
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Download Resume</span>
                </motion.button>
              </div>
            </FadeIn>

            {/* Right Contact Form (7 cols) — Spider Gwen stands beside this */}
            <FadeIn delay={0.25} y={30} className="lg:col-span-7">
              {/* Outer wrapper: relative so Spider Gwen can be positioned outside the card */}
              <div className="relative">

              <div style={{ perspective: 1200 }}>
                <motion.div
                  ref={formCardRef}
                  onMouseMove={handleFormMouseMove}
                  onMouseLeave={handleFormMouseLeave}
                  animate={{
                    rotateX: formRotation.x,
                    rotateY: formRotation.y,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 24,
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  className="relative rounded-[28px] sm:rounded-[36px] border border-white/20 bg-[#101115]/95 backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(182,0,168,0.15)] overflow-hidden"
                >
                  <div
                    className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
                    style={{
                      opacity: formSpotlight.opacity,
                      background: `radial-gradient(550px circle at ${formSpotlight.x}px ${formSpotlight.y}px, rgba(182, 0, 168, 0.12), transparent 75%)`,
                    }}
                  />

                  <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
                    <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
                      Send a Message
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D7E2EA]/70 font-light mb-7">
                      Fill in the details below and send directly to my email.
                    </p>
                  </div>

                  {submissionState === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4"
                    >
                      <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                      <h4 className="font-bold text-white uppercase text-base sm:text-lg">
                        Message Sent Successfully!
                      </h4>
                      <p className="text-xs sm:text-sm text-[#D7E2EA]/85 font-light max-w-md mx-auto leading-relaxed">
                        Your message has been dispatched directly to{' '}
                        <span className="text-white font-mono font-medium underline underline-offset-4 decoration-emerald-500/60">
                          shourya24600101@gmail.com
                        </span>
                        . Thank you for reaching out!
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSubmissionState('idle');
                            setStatusError(null);
                            setFormData({ name: '', email: '', subject: '', message: '' });
                          }}
                          className="px-6 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs uppercase font-mono tracking-wider text-white hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          Send another message
                        </button>
                      </div>
                    </motion.div>
                  ) : submissionState === 'needs_activation' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-7 sm:p-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-4"
                    >
                      <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
                      <h4 className="font-bold text-white uppercase text-base sm:text-lg">
                        One-Time Mailbox Activation Needed
                      </h4>
                      <p className="text-xs sm:text-sm text-[#D7E2EA]/85 font-light max-w-lg mx-auto leading-relaxed">
                        FormSubmit requires a one-time activation. A confirmation email was sent to{' '}
                        <span className="text-white font-mono font-medium underline underline-offset-4 decoration-amber-500/60">
                          shourya24600101@gmail.com
                        </span>
                        . Please click <span className="text-amber-300 font-semibold">'Activate Form'</span> in your inbox or spam folder to enable automatic submissions!
                      </p>
                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 max-w-lg mx-auto space-y-2 text-left">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                          Send this message right now with 1-click:
                        </div>
                        <p className="text-xs text-[#D7E2EA]/70">
                          Your typed message is preserved! Click below to send directly to Shourya's email with zero delay:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a
                            href={getGmailWebUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold transition-all no-underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open in Gmail (Instant)</span>
                          </a>
                          <a
                            href={getMailtoUrl()}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-mono transition-all no-underline"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Default Mail App</span>
                          </a>
                        </div>
                      </div>
                      <div className="pt-2 flex justify-center gap-3">
                        <button
                          onClick={() => setSubmissionState('idle')}
                          className="px-5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs uppercase font-mono tracking-wider text-white transition-colors cursor-pointer"
                        >
                          Back to Edit Form
                        </button>
                      </div>
                    </motion.div>
                  ) : submissionState === 'error' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-7 sm:p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-4"
                    >
                      <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                      <h4 className="font-bold text-white uppercase text-base sm:text-lg">
                        Service Delay / Network Issue
                      </h4>
                      <p className="text-xs sm:text-sm text-[#D7E2EA]/85 font-light max-w-lg mx-auto leading-relaxed">
                        {statusError || 'The web dispatch service took too long or was unreachable.'}
                      </p>
                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 max-w-lg mx-auto space-y-2 text-left">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                          Send instantly via Gmail or Mail App:
                        </div>
                        <p className="text-xs text-[#D7E2EA]/70">
                          Don't worry, your typed message is saved! Click below to send directly:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a
                            href={getGmailWebUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold transition-all no-underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Send via Gmail Web</span>
                          </a>
                          <a
                            href={getMailtoUrl()}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-mono transition-all no-underline"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Send via Mail App</span>
                          </a>
                        </div>
                      </div>
                      <div className="pt-2 flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setSubmissionState('idle');
                            setStatusError(null);
                          }}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs uppercase font-mono tracking-wider text-white transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return to Form</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      {statusError && (
                        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{statusError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/75 mb-1.5 font-medium">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full px-4.5 py-3.5 rounded-xl bg-[#16171B]/90 border border-white/15 text-white placeholder-[#D7E2EA]/30 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-[#1B1C22] focus:shadow-[0_0_25px_rgba(182,0,168,0.25),inset_0_1px_2px_rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/75 mb-1.5 font-medium">
                            Your Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full px-4.5 py-3.5 rounded-xl bg-[#16171B]/90 border border-white/15 text-white placeholder-[#D7E2EA]/30 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-[#1B1C22] focus:shadow-[0_0_25px_rgba(182,0,168,0.25),inset_0_1px_2px_rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/75 mb-1.5 font-medium">
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Internship Opportunity / Project Inquiry"
                          className="w-full px-4.5 py-3.5 rounded-xl bg-[#16171B]/90 border border-white/15 text-white placeholder-[#D7E2EA]/30 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-[#1B1C22] focus:shadow-[0_0_25px_rgba(182,0,168,0.25),inset_0_1px_2px_rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/75 mb-1.5 font-medium">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Hi Shourya, I would like to discuss..."
                          className="w-full px-4.5 py-3.5 rounded-xl bg-[#16171B]/90 border border-white/15 text-white placeholder-[#D7E2EA]/30 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-[#1B1C22] focus:shadow-[0_0_25px_rgba(182,0,168,0.25),inset_0_1px_2px_rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-200 resize-none"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={isSubmitting ? {} : { scale: 1.02, y: -2 }}
                        whileTap={isSubmitting ? {} : { scale: 0.97, y: 1 }}
                        className={`w-full rounded-full text-white font-medium uppercase tracking-widest py-4 text-xs sm:text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        style={{
                          background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                          boxShadow: '0px 8px 30px rgba(182, 0, 168, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.4), inset 0 -2px 6px rgba(0, 0, 0, 0.5)',
                          outline: '2px solid rgba(255, 255, 255, 0.85)',
                          outlineOffset: '-3px',
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{submittingStatus}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </motion.button>

                      <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#D7E2EA]/60 flex-wrap gap-2">
                        <span>Prefer direct email?</span>
                        <div className="flex items-center gap-3">
                          <a
                            href={getGmailWebUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#E879F9] hover:underline flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Gmail</span>
                          </a>
                          <span>•</span>
                          <a
                            href={getMailtoUrl()}
                            className="text-emerald-400 hover:underline flex items-center gap-1 transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Mail App</span>
                          </a>
                        </div>
                      </div>
                    </form>
                  )}
                </motion.div>
              </div>
              </div>{/* end relative wrapper for Spider Gwen */}
            </FadeIn>
          </div>

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
