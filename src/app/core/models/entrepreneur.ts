export interface Entrepreneur {
  id: string;
  name: string;
  role: string;
  category: 'Creador' | 'Emprendedor' | 'Estudiante' | 'Profesional' | 'Comunidad';
  tag: string;
  shortDescription: string;
  story: string;
  need: string;
  irisSupport: string;
  result: string;
  image: string;
  location: string;
  year: number;
  featured?: boolean;
  hasVideo?: boolean;
  videoDuration?: string;
  quote?: string;
}

export interface VideoTestimony {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  type: 'Testimonio' | 'Detrás de escena';
}

export interface AccompanyPrinciple {
  number: string;
  title: string;
  icon: string;
  description: string;
}
