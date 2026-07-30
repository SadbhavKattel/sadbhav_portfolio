import FadeIn from '../components/FadeIn';
import { skills } from '../data/skills';

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-28"
    >
      <h2
        className="mb-14 text-center font-black uppercase text-[#1B1B18] sm:mb-16 md:mb-20"
        style={{ fontSize: 'clamp(2.5rem, 9vw, 96px)' }}
      >
        Skills
      </h2>

      <div className="mx-auto flex max-w-4xl flex-col">
        {skills.map((skill, i) => (
          <FadeIn key={skill.number} delay={i * 0.1}>
            <div
              className="flex items-start gap-4 border-t py-8 last:border-b sm:gap-8 sm:py-10"
              style={{ borderColor: 'rgba(27, 27, 24, 0.12)' }}
            >
              <span
                className="shrink-0 font-black text-[#1B1B18]"
                style={{ fontSize: 'clamp(2.25rem, 7vw, 88px)' }}
              >
                {skill.number}
              </span>
              <div className="flex flex-col justify-center gap-2">
                <h3
                  className="font-medium uppercase text-[#1B1B18]"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.75rem)' }}
                >
                  {skill.name}
                </h3>
                <p
                  className="max-w-xl font-light leading-relaxed text-[#4A4740]"
                  style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)' }}
                >
                  {skill.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
