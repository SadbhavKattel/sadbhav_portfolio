export default function ContactButton() {
  return (
    <a
      href="mailto:kattelsubha@gmail.com"
      className="inline-block rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-200 hover:scale-105 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background: 'linear-gradient(135deg, #12483d 0%, #1f3a5f 100%)',
        boxShadow: '0px 6px 16px rgba(18, 72, 61, 0.25)',
      }}
    >
      Contact Me
    </a>
  );
}
