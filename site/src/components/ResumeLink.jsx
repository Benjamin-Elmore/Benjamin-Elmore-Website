import { BASE } from '../routes.js';

// Built in only when site/public/assets/Benjamin_Elmore_Resume.pdf exists at build time (see vite.config.js).
export const HAS_RESUME = __HAS_RESUME__;

export default function ResumeLink({ children = 'Résumé' }) {
  if (!HAS_RESUME) return null;
  return <a href={BASE + 'assets/Benjamin_Elmore_Resume.pdf'} type="application/pdf" download="Benjamin-Elmore-Resume.pdf">{children}</a>;
}
