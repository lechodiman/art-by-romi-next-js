import { groq, PortableTextBlock } from 'next-sanity';

const paintingFields = groq`
  _id,
  name,
  "image": image.asset->url
`;

export const allPaintingsQuery = groq`
  *[_type == 'painting'] {
    ${paintingFields}
  }
`;

export const featuredPaintingsQuery = groq`
  *[_type == "siteSettings"][0].featuredPaintings[] -> {
    ${paintingFields}
  }
`;

const productFields = groq`
  _id,
  name,
  description,
  price,
  "images": images[].asset->url,
  category,
  size
`;

export const allProductsQuery = groq`
  *[_type == "product"] | order(
    select(
      size == "mini" => 1,
      size == "medium" => 2,
      size == "large" => 3,
      4
    )
  ) {
    ${productFields}
  }
`;

export const productByIdQuery = groq`
  *[_type == "product" && _id == $id][0] {
    _id,
    name,
    description,
    price,
    "images": images[].asset->url,
    category,
    size  // Agregar este campo
  }
`;

export interface Painting {
  _id: string;
  name: string;
  image: string;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface SiteSettings {
  title: string;
  subtitle: string;
  aboutMe: {
    image: string;
    text: PortableTextBlock[];
  };
  heroImage: string;
  faqItems: Array<{ question: string; answer: string }>;
  testimonials: Array<{
    _id: string;
    name: string;
    image: SanityImage; // Reemplazar any por SanityImage
    text: string;
  }>;
  featuredPaintings: Painting[];
  differentiators: Array<{
    title: string;
    description: string;
    image: string;
    imagePosition: 'left' | 'right';
  }>;
}

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    subtitle,
    aboutMe {
      "image": image.asset->url,
      text
    },
    heroImage,
    faqItems,
    testimonials[] -> {
      _id,
      name,
      image,
      text
    },
    featuredPaintings[] -> {
      ${paintingFields}
    },
    differentiators[] {
      title,
      description,
      "image": image.asset->url,
      imagePosition
    }
  }
`;
