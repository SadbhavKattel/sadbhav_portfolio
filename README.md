# Sadbhav Kattel — Portfolio

My personal portfolio site: a single-page site introducing me, the projects I've built, and how to get in touch.

**Live:** _add your deployed URL here once hosted_

## Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev/build tooling
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://motion.dev/) for scroll-triggered fade-in animations
- [lucide-react](https://lucide.dev/) for icons

## Structure

```
src/
  components/       Reusable building blocks (FadeIn, AnimatedText, ContactButton)
  sections/         Page sections rendered in order by App.tsx
    HeroSection.tsx
    ProjectsSection.tsx
    AboutSection.tsx
    SkillsSection.tsx
    Footer.tsx
  data/
    projects.ts     Project list shown in the Projects section
    skills.ts        Skill list shown in the Skills section
  App.tsx           Assembles the sections
  main.tsx          React entry point
  index.css         Tailwind imports + global styles
```

To add or update a project, edit `src/data/projects.ts`. To add or update a skill, edit `src/data/skills.ts`. Both are typed arrays, so TypeScript will catch missing fields.

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
npm run lint       # run oxlint
```

## Deploying

This is a static Vite build (`dist/`), so it deploys as-is to any static host:

- **Vercel / Netlify**: import the repo, build command `npm run build`, output directory `dist`.
- **GitHub Pages**: build locally and push `dist/` to a `gh-pages` branch, or use a GitHub Actions workflow that runs `npm run build` and publishes `dist/`.

## Contact

- GitHub: [SadbhavKattel](https://github.com/SadbhavKattel)
- LinkedIn: [sadbhav-kattel](https://www.linkedin.com/in/sadbhav-kattel-2ab3aa29a/)
- Email: kattelsubha@gmail.com
