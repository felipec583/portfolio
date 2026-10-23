export type Project = {
  name: string;
  href: string;
  dates: string;
  problem: string;
  built: string;
  decision: string;
  pills: string[];
};

export type Copy = {
  htmlLang: 'es' | 'en';
  role: string;
  tagline: string;
  aboutTitle: string;
  about: string;
  projectsTitle: string;
  projects: Project[];
  experienceTitle: string;
  job: {
    company: string;
    role: string;
    dates: string;
    facts: string[];
  };
  stackTitle: string;
  stack: string[];
  educationTitle: string;
  education: string[];
  nav: { id: string; label: string }[];
  ariaGithub: string;
  ariaLinkedin: string;
  ariaEmail: string;
};
