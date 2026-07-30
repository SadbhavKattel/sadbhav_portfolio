import { Github, Linkedin, Mail } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/SadbhavKattel',
    icon: Github,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sadbhav-kattel-2ab3aa29a/',
    icon: Linkedin,
  },
  {
    label: 'Email',
    href: 'mailto:kattelsubha@gmail.com',
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="flex flex-col items-center gap-8 px-5 py-20 sm:gap-10 sm:px-8 sm:py-24 md:px-10"
      style={{ background: '#F1EDE4' }}
    >
      <FadeIn>
        <h2
          className="hero-heading text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.25rem, 8vw, 88px)' }}
        >
          Let&apos;s talk
        </h2>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2 rounded-full border border-[#1B1B18]/25 px-6 py-3 text-sm font-medium uppercase tracking-widest text-[#1B1B18] transition-colors duration-200 hover:border-[#12483d] hover:text-[#12483d] sm:px-7 sm:py-3.5"
            >
              <Icon size={18} />
              {label}
            </a>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <p className="text-xs uppercase tracking-widest text-[#1B1B18]/45 sm:text-sm">
          Sadbhav Kattel -- UT Arlington
        </p>
      </FadeIn>
    </footer>
  );
}
