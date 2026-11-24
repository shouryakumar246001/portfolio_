import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import FadeIn from './FadeIn';
import Heading3D from './Heading3D';
import VintageTelephone3D from './VintageTelephone3D';
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Send,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { playKeyboardSound, playVintageBellRing } from '../utils/audio';

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

  // 3D Telephone Ringing State
  const [isRinging, setIsRinging] = useState(false);
  const [hasInteractedWithPhone, setHasInteractedWithPhone] = useState(false);
  const telephoneRef = useRef<HTMLDivElement>(null);

  // Form 3D Tilt
  const formCardRef = useRef<HTMLDivElement>(null);
  const [formRotation, setFormRotation] = useState({ x: 0, y: 0 });

  // Trigger brief telephone ring animation when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasInteractedWithPhone) {
            triggerTelephoneRing();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (telephoneRef.current) {
      observer.observe(telephoneRef.current);
    }

    return () => observer.disconnect();
  }, [hasInteractedWithPhone]);

  const triggerTelephoneRing = () => {
    setIsRinging(true);
    setHasInteractedWithPhone(true);
    playVintageBellRing();
    setTimeout(() => {
      setIsRinging(false);
    }, 2200);
  };

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
  };

  const handleFormMouseLeave = () => {
    setFormRotation({ x: 0, y: 0 });
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
    setSubmittingStatus('Connecting to vintage dispatch line...');
    setStatusError(null);
    playKeyboardSound(7, true);

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanSubject = formData.subject.trim() || `Portfolio Inquiry from ${cleanName}`;
    const cleanMessage = formData.message.trim();

    const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 30000) => {
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

    // Attempt 1: Try backend API (/api/contact) with a 3.5s timeout
    try {
      setSubmittingStatus('Checking server dispatch handler...');
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
      }, 3500);

      const apiData = await apiRes.json().catch(() => ({}));

      if (apiData.needsActivation || (typeof apiData.message === 'string' && /activation|confirm.*email|verify.*email/i.test(apiData.message))) {
        setIsSubmitting(false);
        setSubmissionState('needs_activation');
        setStatusError(
          "FormSubmit requires a one-time email activation. Check shourya24600101@gmail.com and click 'Activate Form' to enable automatic delivery."
        );
        return;
      }

      if (apiRes.ok && apiData.success === true) {
        setIsSubmitting(false);
        setSubmissionState('success');
        return;
      }
    } catch {
      // Backend offline or timed out - seamlessly fall through to direct FormSubmit
    }

    // Attempt 2: Direct browser dispatch via FormSubmit (6s timeout)
    try {
      setSubmittingStatus('Transmitting dispatch via FormSubmit...');
      const formSubmitRes = await fetchWithTimeout('https://formsubmit.co/ajax/shourya24600101@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          _subject: `[Portfolio Inquiry] ${cleanSubject}`,
          message: cleanMessage,
          _captcha: 'false',
          _template: 'box',
          _replyto: cleanEmail,
        }),
      }, 6000);

      const data = await formSubmitRes.json().catch(() => ({}));
      setIsSubmitting(false);

      if (data.success === 'true' || data.success === true) {
        setSubmissionState('success');
        return;
      }

      if (typeof data.message === 'string' && /activation|confirm.*email|verify.*email/i.test(data.message)) {
        setSubmissionState('needs_activation');
        setStatusError(
          "FormSubmit sent an activation email to shourya24600101@gmail.com. Once you click 'Activate Form' in your inbox (or Spam folder), automatic delivery will be enabled. Until then, use the instant 1-click Gmail or Mail App button below!"
        );
        return;
      }

      setSubmissionState('error');
      setStatusError(data.message || 'The mail service took too long to confirm delivery.');
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
        className="pt-24 sm:pt-32 pb-16 px-5 sm:px-8 md:px-10 select-none relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header with Antique Comm Plaque */}
          <div className="text-center mb-14 sm:mb-18">
            <Heading3D
              title="Let's Build Something Together"
              subtitle="Dial in directly on the antique telephone or transmit a dispatch message below. The line is always open."
              subtitleType="prose"
            />
          </div>

          {/* Main Content Grid: Independent 3D Rotary Telephone (Left) + Dispatch Form (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Independent 3D Antique Rotary Telephone (No enclosing card or separate background) */}
            <FadeIn delay={0.15} y={30} className="lg:col-span-6 flex flex-col items-center justify-center relative">
              {/* ── Independent 3D Telephone Centerpiece ── */}
              {/* Sitting directly within the website's background with zero enclosing frames or cards */}
              <div ref={telephoneRef} className="w-full relative z-10 flex items-center justify-center">
                <VintageTelephone3D isRinging={isRinging} onRingEnd={() => setIsRinging(false)} />
              </div>

            </FadeIn>

            {/* Right Column: Vintage-Themed Message Form (6 cols) */}
            <FadeIn delay={0.25} y={30} className="lg:col-span-6">
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
                  <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
                    <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2 font-['Kanit']">
                      Transmit a Dispatch
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D7E2EA]/70 font-light mb-7">
                      Send a message directly to my desk. All fields are dispatched across the wire securely.
                    </p>
                  </div>

                  {/* Submission State Handlers */}
                  {submissionState === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/35 text-center space-y-4"
                    >
                      <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                      <h4 className="font-bold text-white uppercase text-base sm:text-lg">
                        Dispatch Delivered Successfully!
                      </h4>
                      <p className="text-xs sm:text-sm text-[#D7E2EA]/85 font-light max-w-md mx-auto leading-relaxed">
                        Your message has been transmitted directly to{' '}
                        <span className="text-[#D7A7F2] font-mono font-medium underline underline-offset-4 decoration-[#B600A8]/60">
                          shourya24600101@gmail.com
                        </span>
                        . Thank you for dialing in—I will respond promptly!
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSubmissionState('idle');
                            setStatusError(null);
                            setFormData({ name: '', email: '', subject: '', message: '' });
                          }}
                          className="px-6 py-2.5 rounded-full border border-[#B600A8]/40 bg-[#B600A8]/15 hover:bg-[#B600A8]/25 text-xs uppercase font-mono tracking-wider text-white transition-colors cursor-pointer"
                        >
                          Send another dispatch
                        </button>
                      </div>
                    </motion.div>
                  ) : submissionState === 'needs_activation' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-7 sm:p-8 rounded-2xl bg-[#B600A8]/10 border border-[#B600A8]/35 text-center space-y-4"
                    >
                      <AlertCircle className="w-12 h-12 text-[#D7A7F2] mx-auto" />
                      <h4 className="font-bold text-white uppercase text-base sm:text-lg">
                        One-Time Mailbox Activation Needed
                      </h4>
                      <p className="text-xs sm:text-sm text-[#D7E2EA]/85 font-light max-w-lg mx-auto leading-relaxed">
                        FormSubmit requires a one-time activation. A confirmation email was sent to{' '}
                        <span className="text-[#D7A7F2] font-mono font-medium underline underline-offset-4 decoration-[#B600A8]/60">
                          shourya24600101@gmail.com
                        </span>
                        . Please click <span className="text-[#D7A7F2] font-semibold">'Activate Form'</span> in your inbox or spam folder to enable automatic submissions!
                      </p>
                      <div className="p-4 rounded-xl bg-black/50 border border-white/15 max-w-lg mx-auto space-y-2 text-left">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-[#D7A7F2] font-semibold">
                          Send this message right now with 1-click:
                        </div>
                        <p className="text-xs text-[#D7E2EA]/80">
                          Your typed message is preserved! Click below to send directly with zero delay:
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
                        Dispatch Delay / Network Line Busy
                      </h4>
                      <p className="text-xs sm:text-sm text-[#D7E2EA]/85 font-light max-w-lg mx-auto leading-relaxed">
                        {statusError || 'The web dispatch line took too long or was unreachable.'}
                      </p>
                      <div className="p-4 rounded-xl bg-black/50 border border-white/15 max-w-lg mx-auto space-y-2 text-left">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                          Send instantly via Gmail or Mail App:
                        </div>
                        <p className="text-xs text-[#D7E2EA]/80">
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
                          placeholder="Project Collaboration / Opportunity"
                          className="w-full px-4.5 py-3.5 rounded-xl bg-[#16171B]/90 border border-white/15 text-white placeholder-[#D7E2EA]/30 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-[#1B1C22] focus:shadow-[0_0_25px_rgba(182,0,168,0.25),inset_0_1px_2px_rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/75 mb-1.5 font-medium">
                          Write Your Message *
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

                      {/* Prominent purple SEND MESSAGE Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={isSubmitting ? {} : { scale: 1.02, y: -2 }}
                        whileTap={isSubmitting ? {} : { scale: 0.97, y: 1 }}
                        className={`w-full rounded-full text-[#FDFCF7] font-semibold uppercase tracking-widest py-4 text-xs sm:text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        style={{
                          background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 100%)',
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
                            <Send className="w-4 h-4 text-[#FDFCF7]" />
                            <span>Transmit Message</span>
                          </>
                        )}
                      </motion.button>

                      {/* Helper Fallback Links */}
                      <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#D7E2EA]/70 flex-wrap gap-2">
                        <span>Prefer direct mail application?</span>
                        <div className="flex items-center gap-3">
                          <a
                            href={getGmailWebUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D7A7F2] hover:underline flex items-center gap-1 transition-colors"
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
            </FadeIn>
          </div>

          {/* Section Footer */}
          <div className="mt-20 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#D7E2EA]/50 text-center sm:text-left">
            <div>© {new Date().getFullYear()} Shourya Kumar. All rights reserved.</div>
            <div>Vintage 3D Rotary Hotline • Three.js • Web Audio API • React • TypeScript</div>
          </div>
        </div>

      </footer>
    </>
  );
};

export default ContactSection;
