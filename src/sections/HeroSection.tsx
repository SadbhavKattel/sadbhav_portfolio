import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';

const NAV_LINKS = ['About', 'Skills', 'Projects', 'Contact'];

export default function HeroSection() {
  return (
    <section
      className="relative flex h-screen flex-col justify-center"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn
        delay={0}
        y={-20}
        as="nav"
        className="absolute left-0 right-0 top-0"
      >
        <div className="flex justify-between px-6 pt-6 md:px-10 md:pt-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium uppercase tracking-wider text-[#1B1B18] transition-opacity duration-200 hover:opacity-60 md:text-base lg:text-lg"
            >
              {link}
            </a>
          ))}
        </div>
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading w-full whitespace-nowrap text-center text-[13vw] font-black uppercase leading-none tracking-tight sm:text-[13vw] md:text-[12vw] lg:text-[10vw]">
            Hi, i&apos;m sadbhav
          </h1>
        </FadeIn>
      </div>

      <div className="relative z-20 mx-auto mt-10 flex w-full max-w-3xl flex-col items-center gap-8 px-6 text-center sm:mt-14 md:mt-16">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-md font-light leading-relaxed text-[#4A4740]"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}
          >
            Software engineering student at UT Arlington, building full-stack
            apps and ML-driven tools.
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
