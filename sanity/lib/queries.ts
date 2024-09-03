import { groq, PortableTextBlock } from 'next-sanity';
import { Image } from 'sanity';

const paintingFields = groq`
  _id,
  name,
  image,
`;

export const allPaitingsQuery = groq`
  *[_type == 'painting'] {
    ${paintingFields}
  }
`;

export interface Painting {
  _id: string;
  name: string;
  image: Image;
}

export interface SiteSettings {
  title: string;
  subtitle: string;
  aboutMe: PortableTextBlock[];
  heroImage: Image;
  faqItems: Array<{ question: string; answer: string }>;
  testimonials: Array<{
    _id: string;
    name: string;
    image: any; // You might want to create a more specific type for Sanity images
    text: string;
  }>;
}

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    subtitle,
    aboutMe,
    heroImage,
    faqItems,
    testimonials[] -> {
      _id,
      name,
      image,
      text
    }
  }
`;
