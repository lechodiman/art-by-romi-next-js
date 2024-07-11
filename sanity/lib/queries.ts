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
}
