import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';
import VectorSpaceRunner from '../components/VectorSpaceRunner';

const NAV_LINKS = ['Projects', 'About', 'Skills', 'Contact'];

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col"
      style={{ overflowX: 'clip', background: '#0B0E14' }}
    >
      <FadeIn
        delay={0}
        y={-20}
        as="nav"
        className="absolute left-0 right-0 top-0 z-30"
      >
        <div className="flex justify-between px-6 pt-6 md:px-10 md:pt-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium uppercase tracking-wider text-[#E8EDF4] transition-opacity duration-200 hover:opacity-60 md:text-base lg:text-lg"
            >
              {link}
            </a>
          ))}
        </div>
      </FadeIn>

      <div className="relative z-20 flex flex-col items-center gap-6 px-6 pb-6 pt-28 text-center sm:gap-8 sm:pt-32">
        <div className="overflow-hidden">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading-dark w-full whitespace-nowrap text-center text-[9vw] font-black uppercase leading-none tracking-tight sm:text-[8vw] md:text-[7vw] lg:text-[5.5vw]">
              Hi, i&apos;m sadbhav
            </h1>
          </FadeIn>
        </div>

        <FadeIn delay={0.3} y={20}>
          <p
            className="max-w-md font-light leading-relaxed text-[#9AA3B2]"
            style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)' }}
          >
            Software engineering student at UT Arlington, building full-stack
            apps and ML-driven tools.
          </p>
        </FadeIn>

        <FadeIn delay={0.45} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      <div className="flex-1" />

      <FadeIn delay={0.4} className="relative z-10 w-full pt-6">
        <VectorSpaceRunner />
      </FadeIn>
    </section>
  );
}
