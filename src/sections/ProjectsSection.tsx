import { useEffect, useRef, useState } from 'react';
import { Github, Lock } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { projects, type Project } from '../data/projects';

const tripledProjects = [...projects, ...projects, ...projects];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const newOffset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(newOffset);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-16 sm:py-20"
    >
      <FadeIn>
        <h2
          className="hero-heading mb-10 px-5 text-center font-black uppercase leading-none tracking-tight sm:mb-12 sm:px-8 md:mb-14 md:px-10"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 96px)' }}
        >
          Projects
        </h2>
      </FadeIn>

      <div className="overflow-hidden">
        <div
          className="flex gap-6"
          style={{
            transform: `translateX(${offset - 300}px)`,
            willChange: 'transform',
          }}
        >
          {tripledProjects.map((project, i) => (
            <ProjectCard key={`${project.number}-${i}`} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const Wrapper = project.githubUrl ? 'a' : 'div';

  return (
    <Wrapper
      {...(project.githubUrl
        ? {
            href: project.githubUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
          }
        : {})}
      className={`group flex w-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border border-[#1B1B18]/12 bg-white transition-colors duration-300 sm:w-[360px] ${
        project.githubUrl ? 'hover:border-[#12483d]/50' : ''
      }`}
    >
      <div className="aspect-[2/1] w-full overflow-hidden border-b border-[#1B1B18]/12 bg-[#F1EDE4]">
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.name} preview`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #12483d 0%, #1f3a5f 100%)',
            }}
          >
            <span className="text-4xl font-black uppercase text-white/90">
              {project.name.slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-widest text-[#4A4740]">
              {project.category}
            </span>
            <span className="text-lg font-medium text-[#1B1B18]">
              {project.name}
            </span>
          </div>
          {project.githubUrl ? (
            <Github size={18} className="mt-1 shrink-0 text-[#1B1B18]/60" />
          ) : (
            <Lock size={16} className="mt-1 shrink-0 text-[#1B1B18]/35" />
          )}
        </div>

        <p className="text-sm font-light leading-relaxed text-[#4A4740]">
          {project.description}
        </p>

        <div className="mt-1 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F1EDE4] px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-[#4A4740]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
