import { groq } from 'next-sanity';

const paintingFields = groq`
  _id,
  name,
  "imageUrl": image.asset->url
`;

export const allPaitingsQuery = groq`
  *[_type == 'painting'] {
    ${paintingFields}
  }
`;

export interface Painting {
  _id: string;
  name: string;
  imageUrl: string;
}
