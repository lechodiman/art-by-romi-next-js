import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { SanityImage } from './queries';

import { dataset, projectId } from '../env';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export const urlForImage = (source: Image | string | SanityImage) => {
  return imageBuilder?.image(source).auto('format').fit('max').url();
};
