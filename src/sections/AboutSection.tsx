import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="flex min-h-[80vh] flex-col items-center justify-center px-5 py-24 sm:px-8 md:px-10"
    >
      <div className="flex flex-col items-center gap-10 sm:gap-12 md:gap-14">
        <FadeIn delay={0} y={30}>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 96px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-12 sm:gap-14">
          <AnimatedText
            text="I'm a software engineering student at UT Arlington who enjoys turning complex problems into clean, usable products. From NLP-powered patent search to full-stack web apps and sonar-based ML models, I like building across the whole stack. Let's build something great together."
            className="max-w-[560px] text-center font-normal leading-relaxed text-[#4A4740]"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}
          />

          <FadeIn delay={0.15} y={20}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
